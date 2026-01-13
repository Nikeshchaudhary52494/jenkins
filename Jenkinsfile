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
                echo "Deploying to ${EC2_IP}..."
                // Use single quotes (''' ''') to avoid the Groovy Interpolation warning
                sh '''
                    # 1. Ensure directory exists
                    ssh -o StrictHostKeyChecking=no -i $MY_KEY $EC2_USER@$EC2_IP "mkdir -p ~/app"
                    
                    # 2. Copy files
                    scp -o StrictHostKeyChecking=no -i $MY_KEY app.js package.json $EC2_USER@$EC2_IP:~/app/
                    
                    # 3. Remote commands
                    ssh -o StrictHostKeyChecking=no -i $MY_KEY $EC2_USER@$EC2_IP "
                        cd ~/app && \
                        npm install --production && \
                        
                        # Only install pm2 if it is missing to avoid 'directory not empty' errors
                        if ! command -v pm2 &> /dev/null; then
                            sudo npm install -g pm2
                        fi
                        
                        # Restart the app
                        /usr/local/bin/pm2 delete my-express-app || pm2 delete my-express-app || true
                        /usr/local/bin/pm2 start app.js --name my-express-app || pm2 start app.js --name my-express-app
                    "
                '''
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