variable "aws_region" {
  description = "AWS region for all resources."
  type        = string
  default     = "us-west-2"
}

variable "aws_profile" {
  description = "Local AWS CLI profile to authenticate with."
  type        = string
  default     = "docker-sandpit"
}

variable "project" {
  description = "Project name; used for the default_tags project tag and resource naming."
  type        = string
  default     = "docker-sandpit"
}

variable "image_tag" {
  description = "ECR image tag the ECS task definition should run (e.g. the git short SHA)."
  type        = string
}

variable "container_port" {
  description = "Port the Express app listens on inside the container."
  type        = number
  default     = 3000
}

variable "db_name" {
  description = "Initial database name created in RDS."
  type        = string
  default     = "cards_db"
}

variable "db_username" {
  description = "Master username for the RDS Postgres instance."
  type        = string
  default     = "cards_user"
}

variable "task_cpu" {
  description = "Fargate task CPU units."
  type        = string
  default     = "512"
}

variable "task_memory" {
  description = "Fargate task memory (MiB)."
  type        = string
  default     = "1024"
}

variable "health_check_grace_period" {
  description = "Seconds the ECS service ignores ALB health checks after a task starts (covers migrations + slow boot)."
  type        = number
  default     = 180
}
