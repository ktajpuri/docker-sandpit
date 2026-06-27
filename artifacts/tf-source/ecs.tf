# Log group is defined explicitly (never auto-created by the awslogs driver) so
# `terraform destroy` owns and removes it.
resource "aws_cloudwatch_log_group" "app" {
  name              = "/ecs/${var.project}"
  retention_in_days = 7
}

resource "aws_ecs_cluster" "main" {
  name = var.project
}

resource "aws_ecs_task_definition" "app" {
  family                   = var.project
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = var.task_cpu
  memory                   = var.task_memory
  execution_role_arn       = aws_iam_role.task_exec.arn
  task_role_arn            = aws_iam_role.task.arn

  runtime_platform {
    operating_system_family = "LINUX"
    cpu_architecture        = "ARM64"
  }

  container_definitions = jsonencode([
    {
      name      = "app"
      image     = "${aws_ecr_repository.app.repository_url}:${var.image_tag}"
      essential = true

      # Run migrations against RDS, then start the server.
      command = ["sh", "-c", "npx knex migrate:latest && node src/index.js"]

      portMappings = [
        {
          containerPort = var.container_port
          protocol      = "tcp"
        }
      ]

      environment = [
        { name = "NODE_ENV", value = "production" },
        { name = "PORT", value = tostring(var.container_port) },
        { name = "DB_HOST", value = aws_db_instance.main.address },
        { name = "DB_PORT", value = "5432" },
        { name = "DB_USER", value = var.db_username },
        { name = "DB_PASSWORD", value = random_password.db.result },
        { name = "DB_NAME", value = var.db_name },
        { name = "REDIS_HOST", value = aws_elasticache_cluster.main.cache_nodes[0].address },
        { name = "REDIS_PORT", value = "6379" },
        { name = "JWT_SECRET", value = random_password.jwt.result },
        { name = "JWT_EXPIRES_IN", value = "24h" },
      ]

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.app.name
          "awslogs-region"        = var.aws_region
          "awslogs-stream-prefix" = "app"
        }
      }
    }
  ])
}

resource "aws_ecs_service" "app" {
  name            = var.project
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.app.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  health_check_grace_period_seconds = var.health_check_grace_period

  network_configuration {
    subnets          = data.aws_subnets.default.ids
    security_groups  = [aws_security_group.task.id]
    assign_public_ip = true # required to pull from ECR without a NAT gateway
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.app.arn
    container_name   = "app"
    container_port   = var.container_port
  }

  depends_on = [aws_lb_listener.http]
}
