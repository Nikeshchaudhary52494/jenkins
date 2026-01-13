pipeline {
    agent any

    triggers {
        pollSCM('* * * * *')
    }

    environment {
        // Variables for your EC2 Instance
        EC2_IP = "65.0.21.169"
        EC2_USER = "ubuntu"
        // 'aws-ec2-key' is the ID of the Secret File (.pem) you uploaded to Jenkins
        MY_KEY = credentials('aws-ec2-key')
    }

    stages {
        stage('Checkout') {
            steps {
                // Jenkins automatically pulls your code from GitHub, 
                // but this stage makes it visible in the UI.
                echo 'Checking out code from GitHub...'
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing local dependencies for testing...'
                sh 'npm install'
            }
        }

        stage('Run Unit Tests') {
            steps {
                echo 'Executing Jest Unit Tests...'
                // This runs the "test" script in your package.json.
                // If tests fail, the pipeline stops here and doesn't deploy.
                sh 'npm test'
            }
        }

        stage('Deploy to EC2') {
            steps {
                echo "Starting Deployment to ${EC2_IP}..."
                
                sh """
                    # 1. Ensure the app directory exists on EC2
                    ssh -o StrictHostKeyChecking=no -i $MY_KEY $EC2_USER@$EC2_IP "mkdir -p ~/app"
                    
                    # 2. Copy code files to the EC2 server
                    scp -o StrictHostKeyChecking=no -i $MY_KEY app.js package.json $EC2_USER@$EC2_IP:~/app/
                    
                    # 3. Remote commands: install production dependencies and restart via PM2
                    ssh -o StrictHostKeyChecking=no -i $MY_KEY $EC2_USER@$EC2_IP "
                        cd ~/app && \
                        npm install --production && \
                        sudo npm install -g pm2 && \
                        pm2 delete my-express-app || true && \
                        pm2 start app.js --name my-express-app
                    "
                """
            }
        }
    }

    // Post-build actions give you feedback after the stages finish
    post {
        success {
            echo "Successfully deployed to http://${EC2_IP}:3000 🎉"
        }
        failure {
            echo "Build or Deployment failed. Check the logs above. ❌"
        }
    }
}