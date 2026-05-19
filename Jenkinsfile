pipeline {
    agent any

    parameters {
        choice(
            name: 'ACTION',
            choices: ['apply', 'destroy'],
            description: 'Choose whether to Create or Destroy the infrastructure.'
        )
    }
    
    environment {
        AWS_ACCESS_KEY_ID     = credentials('aws-access-key-id')
        AWS_SECRET_ACCESS_KEY = credentials('aws-secret-access-key')
        AWS_DEFAULT_REGION    = 'us-east-1' 
        DOCKER_USER           = 'praveen0031'
    }

    stages {
        stage('Checkout SCM') {
            steps {
                checkout scm
            }
        }

        stage('Infrastructure Provisioning') {
            steps {
                dir('terraform') {
                    bat 'terraform init'
                    bat "terraform ${params.ACTION} -auto-approve"
                    
                    script {
                        // ONLY attempt to capture output parameters if we are building resources
                        if (params.ACTION == 'apply') {
                            def ipRaw = bat(script: "terraform output -raw server_public_ip", returnStdout: true)
                            env.PUBLIC_IP = ipRaw.split('\r?\n')[-1].trim()
                            echo "Infrastructure is live at: ${env.PUBLIC_IP}"
                        } else {
                            echo "Infrastructure has been successfully destroyed."
                        }
                    }
                }
            }
        }

        stage('Build & Push with Dynamic IP') {
            // This cleanly prevents local compilations during teardowns
            when { expression { params.ACTION == 'apply' } }
            steps {
                script {
                    withCredentials([
                        usernamePassword(credentialsId: 'docker-hub-creds', passwordVariable: 'DOCKER_PASS', usernameVariable: 'DOCKER_ID'),
                        string(credentialsId: 'GOOGLE_CLIENT_ID', variable: 'G_CLIENT_ID')
                    ]) {
                        bat "docker login -u ${DOCKER_ID} -p ${DOCKER_PASS}"

                        dir('frontend') {
                            echo "Building Frontend with API pointing to ${env.PUBLIC_IP}..."
                            bat """
                            docker build -t ${DOCKER_USER}/hashtag-frontend:latest \
                              --build-arg VITE_BACKEND_API=http://${env.PUBLIC_IP}:8000/api/hashtag \
                              --build-arg VITE_SOCKET_URL=http://${env.PUBLIC_IP}:8000 \
                              --build-arg VITE_GOOGLE_CLIENT_ID=${G_CLIENT_ID} \
                              --build-arg VITE_FRONTEND_URL=http://${env.PUBLIC_IP}:5173 .
                            """
                            bat "docker push ${DOCKER_USER}/hashtag-frontend:latest"
                        }

                        dir('backend') {
                            bat "docker build -t ${DOCKER_USER}/hashtag-backend:latest ."
                            bat "docker push ${DOCKER_USER}/hashtag-backend:latest"
                        }
                    }
                }
            }
        }

        stage('Deploy to EC2') {
            when { expression { params.ACTION == 'apply' } }
            steps {
                script {
                    withCredentials([
                        sshUserPrivateKey(credentialsId: 'ec2-ssh-key', keyFileVariable: 'TEMP_KEY'),
                        string(credentialsId: 'MONGODB_URI', variable: 'MONGO_URL')
                    ]) {
                        bat """
                        copy /Y "%TEMP_KEY%" master_key.pem
                        icacls master_key.pem /reset
                        icacls master_key.pem /inheritance:r
                        icacls master_key.pem /grant:r *S-1-5-32-544:(R)
                        icacls master_key.pem /grant:r *S-1-5-18:(R)
                        """

                        def deployCmds = [
                            "docker stop backend || true",
                            "docker rm backend || true",
                            "docker stop frontend || true",
                            "docker rm frontend || true",
                            "docker pull ${DOCKER_USER}/hashtag-backend:latest",
                            "docker pull ${DOCKER_USER}/hashtag-frontend:latest",
                            "docker run -d --name backend -p 8000:8000 -e MONGODB_URL='${MONGO_URL}' -e FRONTEND_URL='http://${env.PUBLIC_IP}:5173' ${DOCKER_USER}/hashtag-backend:latest",
                            "docker run -d --name frontend -p 5173:80 ${DOCKER_USER}/hashtag-frontend:latest"
                        ].join(" && ")

                        echo "Deploying containers to ${env.PUBLIC_IP}..."
                        bat "ssh -i master_key.pem -o StrictHostKeyChecking=no ubuntu@${env.PUBLIC_IP} \"${deployCmds}\""
                        bat "del master_key.pem"
                    }
                }
            }
        }
    }

    post {
        success { 
            script {
                if (params.ACTION == 'apply') {
                    echo "Hashtag App is live at http://${env.PUBLIC_IP}:5173 check this out"
                } else {
                    echo "Infrastructure teardown completed clean. No active endpoints remaining."
                }
            }
        }
        failure { 
            echo "Pipeline failed. Check the console logs for Docker or Terraform errors." 
        }
    }
}