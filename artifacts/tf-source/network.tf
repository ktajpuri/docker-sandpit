# Use the account's default VPC and its (public) default subnets. This keeps the
# teardown surface minimal: no VPC, IGW, or route tables to create or destroy.
data "aws_vpc" "default" {
  default = true
}

data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}
