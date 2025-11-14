#!/bin/bash

# Oracle Cloud Deployment Script
# This script builds and deploys the application to Oracle Cloud

echo "🚀 Starting Oracle Cloud Deployment..."

# Configuration
APP_NAME="ers-springboot"
DOCKER_REGISTRY="<your-region>.ocir.io"
DOCKER_NAMESPACE="<your-tenancy-namespace>"
IMAGE_TAG="${DOCKER_REGISTRY}/${DOCKER_NAMESPACE}/${APP_NAME}:latest"

# Step 1: Build the Docker image
echo "📦 Building Docker image..."
docker build -t ${APP_NAME}:latest .

if [ $? -ne 0 ]; then
    echo "❌ Docker build failed!"
    exit 1
fi

echo "✅ Docker image built successfully!"

# Step 2: Tag the image for Oracle Container Registry
echo "🏷️  Tagging image for Oracle Container Registry..."
docker tag ${APP_NAME}:latest ${IMAGE_TAG}

# Step 3: Push to Oracle Container Registry
echo "📤 Pushing image to Oracle Container Registry..."
echo "Please make sure you're logged in to OCIR:"
echo "docker login ${DOCKER_REGISTRY}"
echo ""
read -p "Press Enter to continue with push..."

docker push ${IMAGE_TAG}

if [ $? -ne 0 ]; then
    echo "❌ Failed to push image to OCIR!"
    echo "Make sure you're logged in: docker login ${DOCKER_REGISTRY}"
    exit 1
fi

echo "✅ Image pushed successfully!"
echo ""
echo "🎉 Deployment preparation complete!"
echo ""
echo "Next steps:"
echo "1. Create a Compute instance in Oracle Cloud"
echo "2. SSH into the instance"
echo "3. Install Docker on the instance"
echo "4. Pull the image: docker pull ${IMAGE_TAG}"
echo "5. Run the container with environment variables"
echo ""
echo "Sample run command:"
echo "docker run -d -p 8080:8080 \\"
echo "  -e DATABASE_URL=<your-db-url> \\"
echo "  -e DATABASE_USERNAME=<your-db-user> \\"
echo "  -e DATABASE_PASSWORD=<your-db-password> \\"
echo "  --name ers-app \\"
echo "  ${IMAGE_TAG}"
