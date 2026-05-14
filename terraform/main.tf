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
  ami           = "ami-091138d0f0d41ff90" # Ubuntu 22.04 LTS
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

              # Replace 'your_username' with your actual Docker Hub username
              docker pull praveen0031/hashtag-backend:latest
              docker pull praveen0031/hashtag-frontend:latest

              # Run the Backend
              docker run -d --name backend -p 8000:8000 \
                -e MONGO_URI="mongodb+srv://praveen:dbPass0031@cluster0.fqnvpdr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0" \
                praveen0031/hashtag-backend:latest

              # Run the Frontend
              docker run -d --name frontend -p 5173:80 \
                praveen0031/hashtag-frontend:latest
              EOF

  tags = {
    Name = "Simple-Hashtag-Deploy"
  }
}

# 4. Output the Public IP
output "server_public_ip" {
  value = aws_instance.app_server.public_ip
}