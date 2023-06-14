pipeline {
  agent any

  stages {
    stage('Clone repository') {
      steps {
        git branch: 'main', url: 'https://github.com/yashwanthhvx/Node_App.git'
      }
    }
    
    stage('Show branch name') {
      steps {
        script {
          def branchName = sh(returnStdout: true, script: 'git rev-parse --abbrev-ref HEAD').trim()
          echo "Executing from branch: ${branchName}"
        }
      }
    }
    
    stage('Copy the code packages to destination path') {
      steps {
        sh 'sudo cp -R /var/lib/jenkins/workspace/Jenkins_App_main/node-app/* /var/lib/jenkins/workspace/Node_App_main/Node-App/.'
      }
    }
      
    stage('Build Docker image') {
      steps {
        sh "pwd"
        dir('Node-App') {
          sh 'sudo docker build -t node-app:latest .'
        }
      }
    }

    stage('Run Docker container') {
      steps {
        dir('Node-App') {
          sh 'sudo docker run -p 80:3000 -d node-app:latest'
        }
      }
    }

    stage('Execute the Bash Script to docker login and save image') {
      steps {
        dir('Node-App') {
          sh 'sudo bash docker-credentials.sh'
          sh 'sudo docker tag node-app:latest hvxuser/jenkins'
          sh 'sudo docker push hvxuser/jenkins'
        }
      }
    }

    stage('Create Kubernetes Deployment') {
      steps {
        dir('Node-App') {
          script {
            def deployCmd = "sudo kubectl apply -f k8-deployment.yml"
            def deployStatus = sh(script: deployCmd, returnStatus: true)

            if (deployStatus == 0) {
              echo "Kubernetes deployment succeeded"
              currentBuild.result = 'SUCCESS'
            } else {
              echo "Kubernetes deployment failed"
              currentBuild.result = 'FAILURE'
            }
          }
        }
      }
    }

    stage('Create Kubernetes Service') {
      steps {
        dir('Node-App') {
          script {
            def serviceCmd = "sudo kubectl apply -f k8-service.yml"
            def serviceStatus = sh(script: serviceCmd, returnStatus: true)

            if (serviceStatus == 0) {
              echo "Kubernetes service creation succeeded"
            } else {
              echo "Kubernetes service creation failed"
            }
          }
        }
      }
    }
  }
}
