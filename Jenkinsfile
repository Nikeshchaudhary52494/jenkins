pipeline {
    agent any
    
    environment {
        EC2_IP = "65.0.21.169"
        EC2_USER = "ubuntu"
        // This refers to the Secret File ID you created
        MY_KEY = credentials('aws-ec2-key')
    }

    stages {
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Unit Tests') {
            steps {
                // If this fails, the pipeline stops here
                sh 'npm test'
            }
        }

        stage('Deploy to EC2') {
            steps {
                echo "Deploying to ${EC2_IP}..."
                sh '''
                    ssh -o StrictHostKeyChecking=no -i $MY_KEY $EC2_USER@$EC2_IP "mkdir -p ~/app"
                    scp -o StrictHostKeyChecking=no -i $MY_KEY app.js package.json $EC2_USER@$EC2_IP:~/app/
                    ssh -o StrictHostKeyChecking=no -i $MY_KEY $EC2_USER@$EC2_IP << EOF
                        cd ~/app
                        npm install --production
                        sudo npm install -g pm2
                        pm2 delete my-express-app || true
                        pm2 start app.js --name my-express-app
                    EOF
                '''
            }
        }
    }
    
    post {
        success {
            echo 'Deployment Finished Successfully! 🎉'
        }
        failure {
            echo 'Build Failed. Checking logs recommended. ❌'
        }
    }
}