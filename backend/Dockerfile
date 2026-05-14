
provider "aws" {
  region = "us-east-1"
}

resource "aws_security_group" "app_sg" {
  name = "hashtag-simple-sg"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 8000
    to_port     = 8000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # Backend API
  }

  ingress {
    from_port   = 5173
    to_port     = 5173
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # Frontend Nginx
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_instance" "app_server" {
  ami           = "ami-0c7217cdde317cfec" # Ubuntu 22.04 LTS
  instance_type = "t2.micro"
  key_name      = "test" # Change to your key name
  vpc_security_group_ids = [aws_security_group.app_sg.id]

  user_data = <<-EOF
              #!/bin/bash
              sudo apt-get update -y
              sudo apt-get install -y docker.io
              sudo systemctl start docker
              sudo usermod -aG docker ubuntu

              # Pull your images
              docker pull your_username/hashtag-backend:latest
              docker pull your_username/hashtag-frontend:latest

              # Run Backend (Passing the URI here at RUNTIME)
              docker run -d --name backend -p 8000:8000 \
                -e MONGO_URI="" \
                your_username/hashtag-backend:latest

              # Run Frontend
              docker run -d --name frontend -p 5173:80 \
                your_username/hashtag-frontend:latest
              EOF

  tags = {
    Name = "Hashtag-Single-Instance"
  }
}

output "public_ip" {
  value = aws_instance.app_server.public_ip
}