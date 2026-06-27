resource "aws_elasticache_subnet_group" "main" {
  name       = var.project
  subnet_ids = data.aws_subnets.default.ids
}

resource "aws_elasticache_cluster" "main" {
  cluster_id           = var.project
  engine               = "redis"
  engine_version       = "7.1"
  node_type            = "cache.t3.micro"
  num_cache_nodes      = 1
  parameter_group_name = "default.redis7"
  port                 = 6379

  subnet_group_name  = aws_elasticache_subnet_group.main.name
  security_group_ids = [aws_security_group.cache.id]

  # Teardown-first: disable snapshots so there is no final snapshot on destroy.
  snapshot_retention_limit = 0
}
