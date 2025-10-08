## Cloud & Container Tools

### **docker** - Container Platform
<!-- metadata:
category: Cloud & Container Tools
difficulty: ⭐⭐⭐⭐ Advanced
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [docker, container platform]
synonyms: [docker]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Platform for developing, shipping, and running applications in containers
**Location**: `/Applications/Docker.app/Contents/Resources/bin/docker`
**Difficulty**: ⭐⭐⭐ Intermediate (Basic containers) / ⭐⭐⭐⭐ Advanced (Networking, volumes)
**Common Use Cases**:

- Application containerization
- Development environment isolation
- Deployment automation

**Essential Examples**:

```bash
# Container Management
docker ps                    # List running containers
docker ps -a                 # List all containers (including stopped)
docker images                # List downloaded images
docker pull nginx:latest     # Download image from registry

# Running Containers
docker run -d nginx                      # Run container in background
docker run -p 8080:80 nginx             # Map port 8080 to container port 80
docker run -it ubuntu bash              # Interactive container with bash
docker run --name myapp -d nginx        # Run with custom name
docker run -v /host:/container nginx    # Mount volume from host

# Container Operations
docker start container_name     # Start stopped container
docker stop container_name      # Stop running container
docker restart container_name   # Restart container
docker rm container_name        # Remove container
docker logs container_name      # View container logs
docker logs -f container_name   # Follow container logs

# Executing Commands in Containers
docker exec -it container_name bash     # Interactive bash session
docker exec container_name ls -la       # Run single command
docker exec -u root container_name bash # Execute as specific user

# Building Images
docker build -t myapp:latest .              # Build image with tag
docker build -f Dockerfile.prod -t myapp .  # Use specific Dockerfile
docker build --no-cache -t myapp .          # Build without cache

# Image Management
docker tag myapp:latest myapp:v1.0     # Tag image
docker push myapp:latest               # Push to registry
docker rmi image_name                  # Remove image
docker system prune                    # Clean up unused resources

# Development Workflows
docker run --rm -v $(pwd):/workspace -w /workspace node:16 npm install
docker-compose up -d                   # Start multi-container application
docker-compose down                    # Stop multi-container application
```



**See Also**: Related tools in this category

**Examples**:

```bash
# Basic usage
# (Add specific examples for this tool)
```
### **docker-compose** - Multi-Container Docker Applications
<!-- metadata:
category: Cloud & Container Tools
difficulty: ⭐⭐⭐⭐ Advanced
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [docker-compose, multi-container docker applica]
synonyms: [docker-compose]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Tool for defining and running multi-container Docker applications
**Location**: `/opt/homebrew/bin/docker-compose`
**Difficulty**: ⭐⭐⭐ Intermediate (Basic compose) / ⭐⭐⭐⭐ Advanced (Complex orchestration)
**Common Use Cases**:

- Multi-container application development
- Local development environment setup
- Testing complex service architectures
- Container orchestration

**See Also**: `docker` (single containers), `kubectl` (Kubernetes), `docker swarm` (Docker native clustering)

**Examples**:

```bash
# Basic docker-compose operations
docker-compose up                    # Start all services defined in docker-compose.yml
docker-compose up -d                 # Start services in background (detached mode)
docker-compose down                  # Stop and remove containers, networks, volumes
docker-compose ps                    # List running services
docker-compose logs                  # View logs from all services
docker-compose logs -f web           # Follow logs for specific service

# Service management
docker-compose start web             # Start specific service
docker-compose stop web              # Stop specific service
docker-compose restart web           # Restart specific service
docker-compose pull                  # Pull latest images for all services
docker-compose build                 # Build images for services with build configuration

# Scaling services
docker-compose up --scale web=3      # Scale web service to 3 instances
docker-compose scale web=2 worker=4 # Scale multiple services

# Development workflows
docker-compose exec web bash         # Execute bash in running web container
docker-compose run --rm web npm test # Run one-off command in new container
docker-compose config                # Validate and view compose configuration

# Environment and configuration
docker-compose -f docker-compose.prod.yml up  # Use specific compose file
docker-compose --env-file .env.prod up        # Use specific environment file
docker-compose up --build                     # Force rebuild of images

# Example docker-compose.yml structure:
# version: '3.8'
# services:
#   web:
#     build: .
#     ports:
#       - "3000:3000"
#     environment:
#       - NODE_ENV=development
#     volumes:
#       - .:/app
#   db:
#     image: postgres:13
#     environment:
#       - POSTGRES_DB=myapp
#       - POSTGRES_PASSWORD=password
#     volumes:
#       - postgres_data:/var/lib/postgresql/data
# volumes:
#   postgres_data:
```


### **dive** - Docker Image Explorer
<!-- metadata:
category: Cloud & Container Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#docker, #containers, #analysis, #optimization]
related: [docker, lazydocker, ctop, docker-slim]
keywords: [dive, docker, image, layer, analysis, size, optimization, explorer]
synonyms: [docker-dive, image-analyzer, layer-explorer, docker-inspector]
platform: [macOS, Linux, Windows]
installation: brew install dive
-->
**Description**: Tool for exploring Docker image layers, contents, and optimizing image size
**Location**: `/opt/homebrew/bin/dive`
**Difficulty**: ⭐⭐⭐ Intermediate
**Common Use Cases**:

- Docker image size optimization
- Layer-by-layer content analysis
- Identifying wasted space
- CI/CD image validation
- Security auditing

**See Also**: `docker` (container platform), `lazydocker` (Docker TUI), `ctop` (container metrics), `docker-slim` (image minification)

**Examples**:

```bash
# Basic usage
dive nginx:latest           # Analyze nginx image
dive myapp:latest          # Analyze local image
dive build -t myapp .      # Build and analyze in one step

# Interactive mode (default)
# Use Tab to switch between layers/files
# Use Ctrl+Space to collapse/expand directories
# Use / to filter files
# Use Ctrl+A to toggle added files
# Use Ctrl+R to toggle removed files
# Use Ctrl+M to toggle modified files

# CI mode (non-interactive)
dive --ci nginx:latest     # Exit with pass/fail based on efficiency
dive --ci --highestUserWastedPercent=0.1 myapp  # Fail if >10% wasted

# JSON output for automation
dive --json nginx:latest > analysis.json

# Source options
dive IMAGE_ID              # Analyze by image ID
dive IMAGE_NAME:TAG        # Analyze by name and tag
docker save nginx | dive   # Analyze from tar stream

# Configuration file (~/.dive.yaml)
cat > ~/.dive.yaml << 'EOF'
rules:
  highestUserWastedPercent: 0.10
  highestWastedBytes: 20000000
  lowestEfficiency: 0.90
EOF

# Build integration
dive build -t myapp --build-arg VERSION=1.0 .

# Comparison workflow
dive nginx:alpine          # Check Alpine version
dive nginx:latest          # Compare with standard version

# Finding optimization opportunities
# Look for:
# - Large files added then removed in later layers
# - Duplicate files across layers
# - Package manager caches not cleaned
# - Build artifacts in final image
```


### **lazydocker** - Terminal UI for Docker
<!-- metadata:
category: Cloud & Container Tools
difficulty: ⭐⭐ Beginner
aliases: []
tags: [#docker, #containers, #tui, #monitoring]
related: [docker, dive, ctop, portainer]
keywords: [lazydocker, docker, tui, terminal, ui, containers, monitoring, management]
synonyms: [docker-tui, docker-ui, terminal-docker, docker-dashboard]
platform: [macOS, Linux, Windows]
installation: brew install lazydocker
-->
**Description**: Simple terminal UI for Docker and Docker Compose management
**Location**: `/opt/homebrew/bin/lazydocker`
**Difficulty**: ⭐⭐ Beginner
**Common Use Cases**:

- Visual Docker container management
- Real-time log monitoring
- Resource usage tracking
- Quick container operations
- Docker Compose visualization

**See Also**: `docker` (CLI), `dive` (image analysis), `ctop` (metrics), `portainer` (web UI)

**Examples**:

```bash
# Launch lazydocker
lazydocker                  # Start the TUI

# Navigation keys (inside lazydocker)
# Tab       - Switch between panels
# Enter     - Select/expand item
# Esc       - Go back/cancel
# q         - Quit
# ?         - Show help

# Container operations
# d         - Remove container
# s         - Stop container
# r         - Restart container
# a         - Attach to container
# E         - Exec shell in container
# l         - View logs
# m         - View stats/metrics

# Image operations
# d         - Remove image
# Enter     - Show layers

# Volume operations
# d         - Remove volume
# Enter     - Show details

# Docker Compose
# u         - Up (start services)
# d         - Down (stop services)
# S         - Stop services
# R         - Restart services

# Viewing and filtering
# /         - Filter/search
# c         - Clear filter
# H         - Toggle hidden containers

# Configuration (~/.config/lazydocker/config.yml)
mkdir -p ~/.config/lazydocker
cat > ~/.config/lazydocker/config.yml << 'EOF'
gui:
  theme:
    activeBorderColor:
      - green
      - bold
  returnImmediately: true
  wrapMainPanel: true
logs:
  timestamps: false
  since: "10m"
EOF

# Custom commands
# Add custom commands in config.yml:
# customCommands:
#   containers:
#     - name: "bash"
#       command: "docker exec -it {{ .Container.Name }} /bin/bash"
#       serviceNames: []

# Environment variables
export DOCKER_HOST=tcp://remote:2375  # Connect to remote Docker
lazydocker

# Docker Compose projects
cd /path/to/compose/project
lazydocker                  # Automatically detects docker-compose.yml
```


### **colima** - Container Runtimes for macOS
<!-- metadata:
category: Cloud & Container Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#containers, #docker, #kubernetes, #macos]
related: [docker, docker-desktop, lima, podman]
keywords: [colima, container, runtime, docker, kubernetes, lima, macos]
synonyms: [container-lima, docker-alternative, macos-containers]
platform: [macOS]
installation: brew install colima
-->
**Description**: Container runtimes on macOS with minimal setup, supports Docker and Kubernetes
**Location**: `/opt/homebrew/bin/colima`
**Difficulty**: ⭐⭐⭐ Intermediate
**Common Use Cases**:

- Docker Desktop alternative for macOS
- Lightweight container runtime
- Kubernetes development environment
- Multi-architecture container support

**See Also**: `docker` (container platform), `lima` (Linux VMs on macOS), `podman` (alternative runtime)

**Examples**:

```bash
# Start Colima
colima start

# Start with specific resources
colima start --cpu 4 --memory 8

# Start with Kubernetes
colima start --kubernetes

# Start with specific Docker version
colima start --runtime docker

# Use containerd runtime
colima start --runtime containerd

# List instances
colima list

# Stop Colima
colima stop

# Delete instance
colima delete

# SSH into VM
colima ssh

# Status
colima status

# Start with Rosetta 2 (Apple Silicon)
colima start --arch aarch64 --vm-type=vz --vz-rosetta
```


### **k9s** - Kubernetes CLI Management Tool
<!-- metadata:
category: Cloud & Container Tools
difficulty: ⭐⭐⭐⭐ Advanced
aliases: []
tags: [#kubernetes, #k8s, #container, #orchestration, #tui]
related: [kubectl, lens, octant, kui]
keywords: [k9s, kubernetes, cli, management, tui, dashboard, monitor]
synonyms: [k9s-cli, kubernetes-tui, k8s-manager]
platform: [macOS, Linux, Windows]
installation: brew install k9s
-->
**Description**: Terminal UI to interact with Kubernetes clusters
**Location**: `/opt/homebrew/bin/k9s`
**Difficulty**: ⭐⭐⭐⭐ Advanced
**Common Use Cases**:

- Kubernetes cluster management
- Real-time cluster monitoring
- Pod log viewing and debugging
- Resource editing and deletion
- Namespace navigation

**See Also**: `kubectl` (Kubernetes CLI), `lens` (Kubernetes IDE), `stern` (multi-pod log tailing)

**Examples**:

```bash
# Launch k9s
k9s

# Connect to specific context
k9s --context production

# Start in specific namespace
k9s -n kube-system

# Read-only mode
k9s --readonly

# Specific kubeconfig
k9s --kubeconfig ~/custom-config

# Commands within k9s:
# :pods         - List pods
# :svc          - List services
# :deploy       - List deployments
# :ns           - List namespaces
# :ctx          - Switch context
# /text         - Search/filter
# ?             - Help
# ctrl-a        - Show all resources
# d             - Describe resource
# l             - View logs
# s             - Shell into container
# e             - Edit resource
# ctrl-k        - Kill resource
# ESC           - Back/exit
```


### **stern** - Multi-Pod and Container Log Tailing
<!-- metadata:
category: Cloud & Container Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#kubernetes, #logs, #debugging, #containers]
related: [kubectl, k9s, kubetail]
keywords: [stern, kubernetes, logs, tail, multi-pod, container, debugging]
synonyms: [multi-tail, pod-logs, k8s-logs]
platform: [macOS, Linux, Windows]
installation: brew install stern
-->
**Description**: Multi-pod and container log tailing for Kubernetes
**Location**: `/opt/homebrew/bin/stern`
**Difficulty**: ⭐⭐⭐ Intermediate
**Common Use Cases**:

- Tailing logs from multiple pods
- Debugging distributed applications
- Monitoring pod restarts
- Filtering logs by pattern
- Color-coded output for readability

**See Also**: `kubectl logs` (basic log viewing), `k9s` (full Kubernetes TUI), `kubetail` (alternative)

**Examples**:

```bash
# Tail all pods in namespace
stern . -n production

# Tail specific pod pattern
stern web-server

# Tail with label selector
stern -l app=nginx

# Tail all containers in pod
stern my-pod --all-namespaces

# Tail specific container
stern my-pod -c nginx

# Tail with timestamp
stern my-pod -t

# Tail since duration
stern my-pod --since 10m

# Exclude pattern
stern my-pod --exclude "health check"

# Include pattern
stern my-pod -i ERROR

# Output format
stern my-pod -o json

# Tail and highlight pattern
stern my-pod --highlight "error|ERROR"

# Follow pod restarts
stern my-pod --retry
```


### **kubectl** - Kubernetes Command Line Tool
<!-- metadata:
category: Cloud & Container Tools
difficulty: ⭐⭐⭐⭐ Advanced
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [kubectl, kubernetes command line tool]
synonyms: [kubectl]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Command-line tool for controlling Kubernetes clusters
**Location**: `/Applications/Docker.app/Contents/Resources/bin/kubectl`
**Difficulty**: ⭐⭐⭐⭐ Advanced (Requires Kubernetes knowledge)
**Common Use Cases**:

- Kubernetes cluster management
- Application deployment and scaling
- Container orchestration
- Service discovery and networking

**Essential Examples**:

```bash
# Cluster Information
kubectl cluster-info                    # Display cluster information
kubectl version                        # Show client and server versions
kubectl config get-contexts            # List available contexts
kubectl config use-context my-context  # Switch to different cluster

# Pod Management
kubectl get pods                       # List all pods in current namespace
kubectl get pods -A                    # List pods in all namespaces
kubectl describe pod my-pod            # Get detailed pod information
kubectl logs my-pod                    # View pod logs
kubectl exec -it my-pod -- bash       # Execute commands in pod

# Deployment Operations
kubectl create deployment nginx --image=nginx    # Create deployment
kubectl get deployments               # List deployments
kubectl scale deployment nginx --replicas=3     # Scale deployment
kubectl set image deployment/nginx nginx=nginx:1.20  # Update image
kubectl rollout status deployment/nginx         # Check rollout status

# Service Management
kubectl expose deployment nginx --port=80 --type=LoadBalancer  # Create service
kubectl get services                   # List services
kubectl port-forward service/nginx 8080:80      # Forward local port to service

# Configuration and Secrets
kubectl create configmap my-config --from-file=config.yaml
kubectl create secret generic my-secret --from-literal=key=value
kubectl get configmaps                 # List config maps
kubectl get secrets                    # List secrets

# Namespace Operations
kubectl get namespaces                 # List namespaces
kubectl create namespace my-namespace  # Create namespace
kubectl config set-context --current --namespace=my-namespace  # Switch namespace

# Resource Management
kubectl apply -f deployment.yaml      # Apply configuration from file
kubectl delete -f deployment.yaml     # Delete resources from file
kubectl get all                       # List all resources in namespace

# Troubleshooting
kubectl describe nodes                 # Check node status
kubectl top nodes                     # Show node resource usage
kubectl top pods                      # Show pod resource usage
```



**See Also**: Related tools in this category

**Examples**:

```bash
# Basic usage
# (Add specific examples for this tool)
```
### **minikube** - Local Kubernetes Development ⭐⭐⭐**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Cloud & Container Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [local, kubernetes, development]
synonyms: [minikube]
platform: [macOS, Linux]
installation: Built-in
-->

**Description**: Tool for running a single-node Kubernetes cluster locally for development and testing. Provides a simple way to learn Kubernetes and develop applications without cloud infrastructure.
**Location**: `/opt/homebrew/bin/minikube` (Homebrew) or `/usr/local/bin/minikube`
**Installation**: `brew install minikube` or download from Kubernetes
**Common Use Cases**:

- Local Kubernetes development and testing
- Learning Kubernetes concepts
- CI/CD pipeline testing
- Application prototyping
- Kubernetes feature experimentation

**See Also**: Related tools in this category

**Examples**:

```bash
# Cluster Management
minikube start                        # Start a local Kubernetes cluster
minikube start --cpus=4 --memory=8192 # Start with specific resources
minikube start --driver=docker        # Use Docker driver
minikube start --kubernetes-version=v1.28.0  # Specific K8s version
minikube stop                         # Stop the cluster
minikube delete                       # Delete the cluster
minikube status                       # Check cluster status

# Multiple Clusters
minikube start -p minikube-dev       # Create named cluster
minikube profile list                 # List all clusters
minikube profile minikube-dev        # Switch to different cluster

# Resource Management
minikube config set cpus 4           # Set default CPUs
minikube config set memory 8192      # Set default memory
minikube config view                  # View configuration

# Addon Management
minikube addons list                 # List available addons
minikube addons enable ingress       # Enable ingress addon
minikube addons enable dashboard     # Enable Kubernetes dashboard
minikube addons enable metrics-server # Enable metrics server
minikube addons disable ingress      # Disable addon

# Service Access
minikube service list                # List services with URLs
minikube service my-service          # Open service in browser
minikube service my-service --url    # Get service URL
minikube tunnel                       # Create tunnel for LoadBalancer services

# Dashboard and Monitoring
minikube dashboard                   # Open Kubernetes dashboard
minikube dashboard --url             # Get dashboard URL

# Docker Environment
eval $(minikube docker-env)          # Use minikube's Docker daemon
docker ps                            # Now shows minikube containers
eval $(minikube docker-env -u)       # Unset Docker environment

# SSH and Debugging
minikube ssh                         # SSH into minikube VM
minikube ssh -- docker images        # Run command in VM
minikube logs                        # View cluster logs
minikube logs --file=logs.txt       # Save logs to file

# Mount Local Directory
minikube mount ./src:/data          # Mount local directory to cluster
minikube mount ./src:/data --uid=1000 --gid=1000  # With specific permissions
```


### **helm** - Kubernetes Package Manager ⭐⭐⭐⭐**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Cloud & Container Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [kubernetes, package, manager]
synonyms: [helm]
platform: [macOS, Linux]
installation: Built-in
-->

**Description**: Package manager for Kubernetes that helps define, install, and upgrade complex Kubernetes applications. Uses charts (packages of pre-configured Kubernetes resources) to streamline deployment.
**Location**: `/opt/homebrew/bin/helm` (Homebrew) or `/usr/local/bin/helm`
**Installation**: `brew install helm` or download from Helm website
**Common Use Cases**:

- Installing complex Kubernetes applications
- Managing application releases and rollbacks
- Sharing Kubernetes applications as charts
- Templating Kubernetes manifests
- Managing application dependencies

**See Also**: Related tools in this category

**Examples**:

```bash
# Repository Management
helm repo add stable https://charts.helm.sh/stable  # Add chart repository
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo list                       # List repositories
helm repo update                     # Update repository information
helm repo remove stable              # Remove repository

# Searching Charts
helm search repo nginx               # Search for nginx charts
helm search repo bitnami/postgresql  # Search specific chart
helm search hub wordpress           # Search Helm Hub

# Installing Charts
helm install my-nginx bitnami/nginx  # Install nginx chart
helm install my-db bitnami/postgresql --set auth.postgresPassword=secret
helm install my-app ./my-chart      # Install from local chart
helm install my-app chart.tgz       # Install from tarball
helm install my-app --values values.yaml bitnami/wordpress  # Custom values

# Managing Releases
helm list                            # List installed releases
helm list --all-namespaces          # List across all namespaces
helm status my-nginx                # Get release status
helm get values my-nginx            # Get release values
helm get manifest my-nginx          # Get rendered manifests

# Upgrading and Rolling Back
helm upgrade my-nginx bitnami/nginx # Upgrade release
helm upgrade my-nginx ./my-chart --values prod-values.yaml
helm rollback my-nginx 1            # Rollback to revision 1
helm history my-nginx               # View release history

# Uninstalling
helm uninstall my-nginx             # Remove release
helm uninstall my-nginx --keep-history  # Keep release history

# Chart Development
helm create my-chart                # Create new chart
helm lint my-chart                  # Validate chart
helm template my-chart              # Render templates locally
helm package my-chart               # Package chart into tarball
helm dependency update my-chart     # Update chart dependencies

# Debugging
helm install my-app ./chart --dry-run --debug  # Test installation
helm get notes my-nginx             # Get installation notes
helm get hooks my-nginx             # View hooks

# Values and Overrides
helm show values bitnami/nginx      # Show default values
helm install my-nginx bitnami/nginx --set service.type=NodePort
helm install my-nginx bitnami/nginx -f custom-values.yaml
```


### **podman** - Container Management Tool ⭐⭐⭐**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Cloud & Container Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [container, management, tool]
synonyms: [podman]
platform: [macOS, Linux]
installation: Built-in
-->

**Description**: Daemonless container engine for developing, managing, and running containers. Drop-in replacement for Docker that doesn't require root privileges and provides enhanced security.
**Location**: `/opt/homebrew/bin/podman` (Homebrew) or `/usr/local/bin/podman`
**Installation**: `brew install podman` or download from Podman website
**Common Use Cases**:

- Running containers without root privileges
- Docker-compatible container operations
- Building and managing container images
- Pod (multi-container) management
- Rootless container development

**See Also**: Related tools in this category

**Examples**:

```bash
# Container Management (Docker-compatible commands)
podman run -d --name web nginx      # Run nginx container
podman run -it ubuntu:latest bash   # Interactive container
podman run -p 8080:80 nginx         # Port mapping
podman run -v ./data:/data alpine   # Volume mounting
podman run --rm alpine echo "Hello" # Auto-remove after exit

# Container Operations
podman ps                           # List running containers
podman ps -a                        # List all containers
podman start web                    # Start container
podman stop web                     # Stop container
podman restart web                  # Restart container
podman rm web                       # Remove container
podman logs web                     # View container logs
podman exec -it web bash            # Execute command in container

# Image Management
podman images                       # List images
podman pull nginx:latest           # Pull image
podman push myimage:tag            # Push image to registry
podman rmi nginx:latest            # Remove image
podman build -t myapp .            # Build image from Dockerfile
podman tag myapp:latest myapp:v1.0 # Tag image

# Pod Management (Podman-specific)
podman pod create --name mypod     # Create pod
podman pod list                    # List pods
podman run -d --pod mypod nginx    # Run container in pod
podman pod start mypod             # Start pod
podman pod stop mypod              # Stop pod
podman pod rm mypod                # Remove pod

# System Management
podman system prune                # Clean up unused resources
podman system df                   # Show disk usage
podman system info                 # System information
podman system migrate              # Migrate containers to new version

# Rootless Containers
podman unshare cat /proc/self/uid_map  # View user namespace mapping
podman run --userns=keep-id alpine id  # Run with current user ID
podman run --security-opt label=disable nginx  # Disable SELinux labeling

# Generate Kubernetes YAML
podman generate kube web > web.yaml    # Generate K8s YAML from container
podman play kube web.yaml              # Deploy from Kubernetes YAML

# Container Inspection
podman inspect web                 # Detailed container information
podman port web                    # Show port mappings
podman top web                     # Show container processes
podman stats                       # Live resource usage stats

# Volume Management
podman volume create myvol         # Create volume
podman volume list                 # List volumes
podman volume inspect myvol        # Volume details
podman volume rm myvol             # Remove volume

# Network Management
podman network create mynet        # Create network
podman network list               # List networks
podman run -d --network mynet nginx # Use custom network
podman network inspect mynet      # Network details
```


### **gcloud** - Google Cloud Platform CLI**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Cloud & Container Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [gcloud, google cloud platform cli]
synonyms: [gcloud]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Command-line tool for Google Cloud Platform services and resources
**Location**: `/Users/allen/Downloads/google-cloud-sdk/bin/gcloud`
**Common Use Cases**:

- Google Cloud resource management
- Application deployment
- Service configuration
- Infrastructure management

**Essential Examples**:

```bash
# Authentication and Configuration
gcloud auth login                      # Authenticate with Google account
gcloud config set project my-project  # Set default project
gcloud config list                    # Show current configuration
gcloud auth application-default login # Set up Application Default Credentials

# Project Management
gcloud projects list                   # List all projects
gcloud projects create my-new-project # Create new project
gcloud config set project PROJECT_ID  # Switch to different project

# Compute Engine
gcloud compute instances list          # List VM instances
gcloud compute instances create my-vm --image-family=debian-10 --image-project=debian-cloud
gcloud compute instances start my-vm   # Start instance
gcloud compute instances stop my-vm    # Stop instance
gcloud compute ssh my-vm              # SSH into instance

# Cloud Storage
gcloud storage buckets list           # List storage buckets
gcloud storage buckets create gs://my-bucket  # Create bucket
gcloud storage cp file.txt gs://my-bucket/    # Upload file
gcloud storage cp gs://my-bucket/file.txt .   # Download file

# App Engine
gcloud app deploy                     # Deploy application
gcloud app browse                     # Open app in browser
gcloud app logs tail -s default       # Stream logs

# Cloud Run
gcloud run services list              # List Cloud Run services
gcloud run deploy --image gcr.io/my-project/my-app --platform managed
gcloud run services delete my-service # Delete service

# Container Registry
gcloud builds submit --tag gcr.io/my-project/my-app  # Build and push image
gcloud container images list         # List container images

# Identity and Access Management (IAM)
gcloud iam service-accounts list     # List service accounts
gcloud iam service-accounts create my-account --display-name="My Service Account"
gcloud projects add-iam-policy-binding my-project --member="user:email@gmail.com" --role="roles/viewer"

# Cloud SQL
gcloud sql instances list            # List database instances
gcloud sql instances create my-db --tier=db-f1-micro --region=us-central1
gcloud sql databases create my-database --instance=my-db

# Kubernetes Engine
gcloud container clusters list       # List GKE clusters
gcloud container clusters create my-cluster --num-nodes=3
gcloud container clusters get-credentials my-cluster  # Configure kubectl

# Monitoring and Logging
gcloud logging logs list             # List available logs
gcloud logging read "resource.type=gce_instance" --limit=10  # Read logs
```

---


---

### **ngrok** - Secure Tunnels to Localhost
<!-- metadata:
category: Cloud & Container Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#networking, #tunnel, #localhost, #development]
related: [localtunnel, cloudflared, serveo]
keywords: [ngrok, tunnel, localhost, expose, webhook, https, secure]
synonyms: [localhost-tunnel, secure-tunnel, webhook-tunnel]
platform: [macOS, Linux, Windows]
installation: brew install ngrok
-->
**Description**: Expose local servers to the internet with secure tunnels
**Location**: `/opt/homebrew/bin/ngrok`
**Difficulty**: ⭐⭐⭐ Intermediate
**Common Use Cases**:

- Exposing local development servers
- Webhook development and testing
- Mobile app backend testing
- Demo sharing without deployment
- Secure tunneling for IoT devices

**See Also**: `localtunnel` (open-source alternative), `cloudflared` (Cloudflare tunnel), `serveo` (SSH-based)

**Examples**:

```bash
# Expose local port 3000
ngrok http 3000

# Expose with subdomain (requires account)
ngrok http -subdomain=myapp 3000

# Expose with basic auth
ngrok http -auth="user:password" 3000

# Expose HTTPS
ngrok http https://localhost:8443

# Expose with custom hostname (paid)
ngrok http -hostname=myapp.example.com 3000

# Expose TCP port
ngrok tcp 22

# Expose with region
ngrok http -region eu 3000

# Start with config file
ngrok start --all

# Inspect traffic (web interface)
# Visit http://127.0.0.1:4040

# Get tunnel info via API
curl http://127.0.0.1:4040/api/tunnels

# Expose with request headers
ngrok http -host-header=rewrite 3000
```

