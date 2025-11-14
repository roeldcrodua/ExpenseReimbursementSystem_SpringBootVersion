# Oracle Cloud Deployment Script (PowerShell)
# This script builds and deploys the application to Oracle Cloud

Write-Host "🚀 Starting Oracle Cloud Deployment..." -ForegroundColor Cyan

# Configuration
$APP_NAME = "ers-springboot"
$DOCKER_REGISTRY = "<your-region>.ocir.io"  # e.g., iad.ocir.io for US East
$DOCKER_NAMESPACE = "<your-tenancy-namespace>"
$IMAGE_TAG = "${DOCKER_REGISTRY}/${DOCKER_NAMESPACE}/${APP_NAME}:latest"

# Step 1: Build the Docker image
Write-Host "📦 Building Docker image..." -ForegroundColor Yellow
docker build -t "${APP_NAME}:latest" .

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Docker build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Docker image built successfully!" -ForegroundColor Green

# Step 2: Tag the image for Oracle Container Registry
Write-Host "🏷️  Tagging image for Oracle Container Registry..." -ForegroundColor Yellow
docker tag "${APP_NAME}:latest" $IMAGE_TAG

# Step 3: Push to Oracle Container Registry
Write-Host "📤 Pushing image to Oracle Container Registry..." -ForegroundColor Yellow
Write-Host "Please make sure you're logged in to OCIR:" -ForegroundColor Cyan
Write-Host "docker login $DOCKER_REGISTRY" -ForegroundColor White
Write-Host ""
Read-Host "Press Enter to continue with push"

docker push $IMAGE_TAG

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to push image to OCIR!" -ForegroundColor Red
    Write-Host "Make sure you're logged in: docker login $DOCKER_REGISTRY" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Image pushed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "🎉 Deployment preparation complete!" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Create a Compute instance in Oracle Cloud"
Write-Host "2. SSH into the instance"
Write-Host "3. Install Docker on the instance"
Write-Host "4. Pull the image: docker pull $IMAGE_TAG"
Write-Host "5. Run the container with environment variables"
Write-Host ""
Write-Host "Sample run command:" -ForegroundColor Cyan
Write-Host "docker run -d -p 8080:8080 \"
Write-Host "  -e DATABASE_URL=<your-db-url> \"
Write-Host "  -e DATABASE_USERNAME=<your-db-user> \"
Write-Host "  -e DATABASE_PASSWORD=<your-db-password> \"
Write-Host "  --name ers-app \"
Write-Host "  $IMAGE_TAG"
