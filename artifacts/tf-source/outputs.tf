output "ecr_repository_url" {
  description = "ECR repository URL to tag/push the application image to."
  value       = aws_ecr_repository.app.repository_url
}

output "alb_dns_name" {
  description = "Public DNS name of the ALB; the API base URL is http://<this>."
  value       = aws_lb.main.dns_name
}

output "rds_endpoint" {
  description = "RDS Postgres endpoint (host:port)."
  value       = aws_db_instance.main.endpoint
}

output "redis_endpoint" {
  description = "ElastiCache Redis primary node address."
  value       = aws_elasticache_cluster.main.cache_nodes[0].address
}
