# Stage 1: the image registry must exist (and hold an image) before the ECS
# service can place a task. force_delete lets `terraform destroy` remove the
# repo even though it still contains images.
resource "aws_ecr_repository" "app" {
  name                 = var.project
  image_tag_mutability = "MUTABLE"
  force_delete         = true

  image_scanning_configuration {
    scan_on_push = false
  }
}
