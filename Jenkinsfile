pipeline {
  agent any

  parameters {
    choice(name: 'DEPLOYMENT_TYPE', choices: ['Docker-Compose', 'Kubernetes'], description: 'Choose the deployment type')
  }

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
        dir('node-app') {
          sh 'sudo docker build -t node-app:latest .'
        }
      }
    }

    stage('Run Docker container') {
      steps {
        dir('node-app') {
          sh 'sudo docker run -p 80:3000 -d node-app:latest'
        }
      }
    }

    stage('Execute the Bash Script to docker login and save image') {
      steps {
        dir('node-app') {
          sh 'sudo bash docker-credentials.sh'
          sh 'sudo docker tag node-app:latest hvxuser/jenkins'
          sh 'sudo docker push hvxuser/jenkins'
        }
      }
    }

    stage('Create Docker-compose') {
      when {
        expression { params.DEPLOYMENT_TYPE == 'Docker-Compose' }
      }
      steps {
        dir('node-app') {
          sh 'sudo docker stack deploy -c docker-compose.yml my-node-app'
        }
      }
    }

    stage('Create Kubernetes Deployment') {
      when {
        expression { params.DEPLOYMENT_TYPE == 'Kubernetes' }
      }
      steps {
        dir('node-app') {
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
      when {
        expression { params.DEPLOYMENT_TYPE == 'Kubernetes' }
      }
      steps {
        dir('node-app') {
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
