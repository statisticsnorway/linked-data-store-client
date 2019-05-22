pipeline {
    agent any
    environment {
        DOCKER_REPO = "eu.gcr.io/bip-nullfem"
        DOCKER_IMAGE = "linked-data-store-client"
        DOCKER_TAG = "${env.BRANCH_NAME}-${GIT_COMMIT.substring(0,7)}"
        DOCKER_SCAN_TAG = "image-scan-${env.BRANCH_NAME}-${GIT_COMMIT.substring(0,7)}"
        PACKAGE_JSON = readJSON file: 'package.json'
        ARTIFACT_ID = "${PACKAGE_JSON.name}"
        VERSION = "${PACKAGE_JSON.version}"
        SLACK_PREFIX = "Build <${env.BUILD_URL}|${env.JOB_NAME}/${env.BUILD_NUMBER}>:"
    }
    stages {
        stage('Build start') {
            steps {
                slackSend color: "#439FE0", message: "${env.SLACK_PREFIX} Started\nArtifact ID: `${env.ARTIFACT_ID}`\nApplication version: `${env.VERSION}`\nGit branch: `${env.BRANCH_NAME}`"
            }
        }
        stage('Docker build and push image') {
            steps {
                slackSend color: '#439FE0', message: "${env.SLACK_PREFIX} Docker build/push - Start"
                sh "docker build . -t ${env.DOCKER_REPO}/${env.DOCKER_IMAGE}:${env.DOCKER_SCAN_TAG}"
                withCredentials([file(credentialsId: 'jenkins-google-cloud-registry-key', variable: 'GCR_KEY')]) {
                    sh "docker login -u _json_key --password-stdin https://eu.gcr.io < ${GCR_KEY}"
                    sh "docker push ${env.DOCKER_REPO}/${env.DOCKER_IMAGE}:${env.DOCKER_SCAN_TAG}"
                }
            }
            post {
                success {
                    slackSend color: 'good', message: "${env.SLACK_PREFIX} Docker build/push - Success\nNew image built and pushed with temporary tag to GCR: ${env.DOCKER_REPO}/${env.DOCKER_IMAGE}:${env.DOCKER_SCAN_TAG}"
                }
            }
        }
        stage('Image vulnerability scanning') {
            steps {
                slackSend color: '#439FE0', message: "${env.SLACK_PREFIX} Anchore scan - Start\nStarting scan of image ${env.DOCKER_REPO}/${env.DOCKER_IMAGE}:${env.DOCKER_SCAN_TAG}"
                script {
                    try {
                        writeFile file: 'anchore_images', text: "${env.DOCKER_REPO}/${env.DOCKER_IMAGE}:${env.DOCKER_SCAN_TAG}"
                        anchore name: 'anchore_images', engineCredentialsId: 'jenkins-anchore-token'
                        slackSend color: 'good', message: "${env.SLACK_PREFIX} Anchore scan - Success\nImage ${env.DOCKER_REPO}/${env.DOCKER_IMAGE}:${env.DOCKER_SCAN_TAG} successfully scanned"
                    } catch (err) {
                        slackSend color: 'warning', message: "${env.SLACK_PREFIX} Anchore scan - Failed\nImage failed vulnerabillity scanning!"
                    }
                }
            }
        }
        stage('Add and push image tags') {
            steps {
                slackSend color: '#439FE0', message: "${env.SLACK_PREFIX} Docker tag - Start"
                sh "docker tag ${env.DOCKER_REPO}/${env.DOCKER_IMAGE}:${env.DOCKER_SCAN_TAG} ${env.DOCKER_REPO}/${env.DOCKER_IMAGE}:${env.DOCKER_TAG}"
                withCredentials([file(credentialsId: 'jenkins-google-cloud-registry-key', variable: 'GCR_KEY')]) {
                    sh "docker login -u _json_key --password-stdin https://eu.gcr.io < ${GCR_KEY}"
                    sh "docker push ${env.DOCKER_REPO}/${env.DOCKER_IMAGE}:${env.DOCKER_TAG}"
                }
            }
            post {
                success {
                    slackSend color: 'good', message: "${env.SLACK_PREFIX} Docker tag - Success\nNew image tags added and pushed to GCR: ${env.DOCKER_REPO}/${env.DOCKER_IMAGE}:${env.DOCKER_TAG}"
                }
            }
        }
    }
    post {
        success {
            slackSend color: 'good', message: "${env.SLACK_PREFIX} Success!"
        }
        failure {
            slackSend color: 'danger', message: "${env.SLACK_PREFIX} Build failed!"
        }
    }
}