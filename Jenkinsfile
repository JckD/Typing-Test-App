pipeline {
     agent any
     stages {
        stage("Build") {
            steps {
                sh "sudo npm install"
                //sh "sudo npm run build"
            }
        }
        stage("Deploy") {
            steps {
                sh "sudo rm -rf /home/ubuntu/Typing-Test-App"
                sh "sudo cp -r ${WORKSPACE}/build/ /home/ubuntu/Typing-Test-App/"
                sh "sudo cp /home/ubuntu/config.json /home/ubuntu/Typing-Test-App"
            }
        }
    }
}