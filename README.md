# Kubernetes Workshop

A hands-on workshop repository for learning core Kubernetes concepts. It includes a purpose-built demo application
(`podinfo`) and a full set of Kubernetes manifests covering the most common resource types.

## Repository Structure

```text
kubernetes-workshop/
├── manifests/          # Kubernetes resource manifests for the workshop exercises
├── podinfo/            # The demo application (Node.js) and its own Dockerfile
├── workshop/           # (Workshop content)
├── COMMANDS.md         # Quick-reference kubectl commands
└── WORKSHOP-SETUP.md   # Environment setup guide (minikube)
```

## The Demo App — `podinfo`

`podinfo` is a tiny, dependency-free Node.js application designed specifically for demonstrating how Kubernetes works.
It exposes an HTML dashboard and a JSON API showing:

- **Pod identity** — pod name, IP, UID, namespace, node name, service account (injected via the Kubernetes Downward API)
- **Request info** — client socket address, `X-Forwarded-For` header, all request headers
- **Runtime info** — uptime, Node.js version, CPU/memory usage
- **All environment variables** — great for demonstrating ConfigMaps and Secrets
- **Per-instance color and ID** — changes with every pod restart, making load balancing across replicas immediately
  visible in the browser

### App Endpoints

| Endpoint  | Description                                   |
|-----------|-----------------------------------------------|
| `/`       | HTML dashboard with all pod/request info      |
| `/api`    | Same data as JSON (useful for `curl`/scripts) |
| `/health` | Liveness probe — returns `ok`                 |
| `/ready`  | Readiness probe — returns `ready`             |
| `/logs`   | Contents of this instance's request log file  |

### Run Locally

```bash
cd podinfo
node server.js
# Open http://localhost:8080
```

### Build & Push the Docker Image

```bash
cd podinfo
docker build \
--build-arg BUILD_DATE=$(date -u +%Y-%m-%dT%H:%M:%SZ) \
--build-arg VCS_REF=$(git rev-parse --short HEAD) \
--build-arg VERSION=1.0.0 \
-t netgrif/podinfo:1.0.0 .
docker run -p 8080:8080 netgrif/podinfo:1.0.0
```

The pre-built image is available on Docker Hub as **`netgrif/podinfo:latest`**.

---

## Kubernetes Manifests

All manifests are in the `manifests/` directory and use the `netgrif/podinfo:latest` image.

### Resources Covered

| Manifest                    | Kind                   | Description                                               |
|-----------------------------|------------------------|-----------------------------------------------------------|
| `pod.yaml`                  | Pod                    | Bare pod with Downward API env vars                       |
| `deployment.yaml`           | Deployment             | Deployment with ConfigMap, Secret, and PVC volumes        |
| `configmap.yaml`            | ConfigMap              | App configuration injected as env vars and a mounted file |
| `secret.yaml`               | Secret                 | Opaque secret (base64-encoded)                            |
| `pvc.yaml`                  | PersistentVolumeClaim  | 100 Mi `ReadWriteOnce` claim for log persistence          |
| `statefulset.yaml`          | StatefulSet            | StatefulSet backed by the headless service                |
| `service-clusterip.yaml`    | Service (ClusterIP)    | Internal-only service                                     |
| `service-nodeport.yaml`     | Service (NodePort)     | Exposes port `30080` on every node                        |
| `service-loadbalancer.yaml` | Service (LoadBalancer) | Cloud-provisioned external load balancer                  |
| `service-headless.yaml`     | Service (Headless)     | Per-pod DNS for StatefulSets                              |
| `ingress.yaml`              | Ingress                | NGINX Ingress routing `podinfo.local` → ClusterIP         |

### Apply All Manifests

```bash
kubectl apply -f manifests/
```

Or apply individual resources:

```bash
kubectl apply -f manifests/deployment.yaml
kubectl apply -f manifests/service-clusterip.yaml
```

### Quick Access via Port-Forward

```bash
kubectl port-forward svc/podinfo-clusterip 8080:80
# Open http://localhost:8080
```

---

## Workshop Setup

See **[WORKSHOP-SETUP.md](WORKSHOP-SETUP.md)** for full setup instructions including minikube installation and addon
configuration (Ingress, Dashboard, Metrics Server).

### Quick Start with minikube

```bash
minikube start
minikube addons enable ingress
minikube addons enable dashboard
minikube addons enable metrics-server
```

For local Ingress DNS resolution (so `podinfo.local` resolves on your machine):

```bash
minikube addons enable ingress-dns
```

---

## Workshop Ideas

- **Load balancing** — Scale replicas and refresh the page; watch the pod color and instance ID change with each
  request.
- **Downward API** — Observe that `POD_NAME`, `POD_IP`, etc. are injected by Kubernetes, not guessed by the app.
- **ConfigMaps & Secrets** — Mount them as env vars and see them appear in the dashboard.
- **Rolling updates** — Change the image, run `kubectl set image`, and watch pods roll one at a time.
- **Self-healing** — Delete a pod (`kubectl delete pod <name>`) and watch Kubernetes recreate it.
- **Readiness vs. liveness probes** — Break `/ready` and observe that the pod is removed from Service endpoints but not
  restarted.
- **PersistentVolumeClaims** — Delete a pod and show that the log file survives on the PVC.
- **StatefulSets** — Use the headless service to reach individual pods by stable DNS name.
- **Graceful shutdown** — The app handles `SIGTERM`, useful for discussing pod termination grace periods.

---

## License

[Apache 2.0](LICENSE.txt)

