# Web app for kubernetes - podinfo

A deliberately tiny, dependency-free Node.js app for demonstrating how
Kubernetes works. It has no `npm install` step at all — just Node's
built-in `http` module.

## What it shows on `/`

- **Pod identity**: pod name, pod IP, pod UID, namespace, node name,
  service account (all populated via the Kubernetes **Downward API**)
- **Request/client info**: the socket's remote address and the
  `X-Forwarded-For` header (great for showing the difference once you
  put an Ingress or LoadBalancer in front)
- **Runtime info**: uptime, Node version, CPU/memory of the pod
- **All environment variables** — useful for showing ConfigMaps/Secrets
  injected as env vars
- **All request headers**
- A color + random instance ID banner, so when you scale to multiple
  replicas and refresh, you can visually see the Service load-balancing
  across different pods

Other endpoints:

- `/health` — for a liveness probe
- `/ready` — for a readiness probe
- `/api` — same data as JSON, handy for `curl` or load-testing scripts

## Run locally

```bash
node server.js
# then open http://localhost:8080
```

## Build the image

```bash
docker build \
  --build-arg BUILD_DATE=$(date -u +%Y-%m-%dT%H:%M:%SZ) \
  --build-arg VCS_REF=$(git rev-parse --short HEAD) \
  --build-arg VERSION=1.0.0 \
  -t netgrif/podinfo:1.0.0 .
docker run -p 8080:8080 podinfo:latest
```

## Deploy to Kubernetes

`deployment.yaml` includes a Deployment (3 replicas) and a Service, and
wires up the Downward API so `POD_NAME`, `POD_IP`, `POD_NAMESPACE`,
`POD_UID`, `POD_SERVICE_ACCOUNT`, and `NODE_NAME` are all populated
automatically — no extra code needed in the app.

```bash
# push your built image somewhere the cluster can pull it, then:
kubectl apply -f deployment.yaml

# port-forward to try it out
kubectl port-forward svc/podinfo 8080:80
# open http://localhost:8080
```

### Workshop ideas this app is good for

- **Load balancing**: scale replicas (`kubectl scale deployment/podinfo --replicas=5`)
  and refresh the page repeatedly — watch the pod name/color/instance ID change.
- **Downward API**: point out that `POD_NAME`/`POD_IP`/etc. are not "guessed"
  by the app — they're injected by Kubernetes itself.
- **ConfigMaps & Secrets**: add a ConfigMap or Secret, mount as env vars,
  and show them appear in the "All environment variables" table.
- **Rolling updates**: change the pod's color logic or add a banner text,
  rebuild, `kubectl set image`, and watch pods roll one at a time — old
  color disappears as new color appears.
- **Self-healing**: `kubectl delete pod <name>` and watch a new one with
  a different name/UID/instance ID appear.
- **Readiness vs liveness**: temporarily break `/ready` and show the pod
  gets removed from the Service endpoints, but not restarted, unlike a
  `/health` failure.
- **Horizontal Pod Autoscaler**: generate load against `/api` and watch
  replicas scale.
- **Graceful shutdown**: the app handles `SIGTERM` and logs it — good for
  discussing pod termination grace periods.
