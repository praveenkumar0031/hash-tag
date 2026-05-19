# 1. Provider Configuration
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

# 2. Security Group (Opening ports for SSH, Frontend, and Backend)
data "aws_security_group" "existing_sg" {
  name = "simple-hashtag-sg"
}
# 3. Single EC2 Instance
resource "aws_instance" "app_server" {
  ami           = "ami-05cf1e9f73fbad2e2" # Ubuntu 24.04 LTS
  instance_type = "t3.micro"
  key_name      = "test" # Ensure this matches your AWS Key Pair name
  vpc_security_group_ids = [data.aws_security_group.existing_sg.id]

  # This script runs at first boot to setup the environment
  user_data = <<-EOF
              #!/bin/bash
              sudo apt-get update -y
              sudo apt-get install -y docker.io
              sudo systemctl start docker
              sudo usermod -aG docker ubuntu
              EOF

  tags = {
    Name = "Simple-Hashtag-Deploy"
  }
}

# 4. Output the Public IP
output "server_public_ip" {
  value = aws_instance.app_server.public_ip
}