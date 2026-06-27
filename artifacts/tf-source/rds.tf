resource "aws_db_subnet_group" "main" {
  name       = var.project
  subnet_ids = data.aws_subnets.default.ids
}

resource "aws_db_instance" "main" {
  identifier        = var.project
  engine            = "postgres"
  engine_version    = "16"
  instance_class    = "db.t3.micro"
  allocated_storage = 20

  db_name  = var.db_name
  username = var.db_username
  password = random_password.db.result

  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.rds.id]
  publicly_accessible    = false
  multi_az               = false

  # Teardown-first: no final snapshot, no deletion protection.
  skip_final_snapshot = true
  deletion_protection = false
  apply_immediately   = true
}
