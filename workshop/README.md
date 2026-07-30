# Kubernetes Workshop

A hands-on workshop covering core Kubernetes concepts through five progressive modules. Each module builds on the
previous one and includes ready-to-apply YAML manifests and step-by-step instructions.

---

## Prerequisites

- [minikube](https://minikube.sigs.k8s.io/docs/start/) installed and running
- `kubectl` available (or aliased from minikube — see [Module 1](#module-1-introduction-to-kubernetes))
- Basic familiarity with the terminal

---

## Workshop Modules

### Module 1 — Introduction to Kubernetes

> **Folder:** `module1/`

An introduction to the Kubernetes cluster and its core building block — the **Pod**.

**Topics covered:**

- Starting and configuring minikube
- Exploring the cluster (`nodes`, `namespaces`, `pods`)
- Creating, inspecting, and deleting a single Pod manually and via a manifest

**Files:**

| File       | Description                  |
|------------|------------------------------|
| `pod.yaml` | A minimal nginx Pod manifest |

---

### Module 2 — Deployments and Services

> **Folder:** `module2/`

Introduces **Deployments** for managing replicated, self-healing workloads and **Services** for exposing them inside and
outside the cluster.

**Topics covered:**

- Creating a dedicated namespace
- Deploying and scaling a Deployment
- Exposing Pods via `ClusterIP`, `NodePort`, and `LoadBalancer` services
- Tunneling traffic from minikube to your local machine
- Configuring **liveness** and **readiness** probes

**Files:**

| File                        | Description                                               | 
|-----------------------------|-----------------------------------------------------------| 
| `deployment.yaml`           | Basic Deployment of the `podinfo` app                     | 
| `deployment-probes.yaml`    | Deployment extended with liveness and readiness probes    | 
| `service-clusterip.yaml`    | ClusterIP service — internal cluster access only          |
| `service-nodeport.yaml`     | NodePort service — accessible via`<NodeIP>:30080`         |
| `service-loadbalancer.yaml` | LoadBalancer service — cloud/tunnel-based external access |

---

### Module 3 — Persistent Storage, ConfigMaps & Secrets

> **Folder:** `module3/`

Covers how to attach durable storage to Pods and how to inject configuration and sensitive data without rebuilding
images.

**Topics covered:**

- Creating and binding a `PersistentVolumeClaim` (PVC)
- Observing minikube's `hostPath` storage provisioner
- Creating and consuming a `ConfigMap` (as env vars and mounted files)
- Creating and consuming a `Secret` (as env vars and mounted files)

**Files:**

| File                     | Description                                                  | 
|--------------------------|--------------------------------------------------------------| 
| `pvc.yaml`               | PersistentVolumeClaim for pod log storage                    | 
| `deployment.yaml`        | Deployment with a PVC mounted for log persistence            | 
| `configmap.yaml`         | ConfigMap holding a greeting value and a JSON config file    | 
| `secret.yaml`            | Secret holding a base64-encoded secret key                   | 
| `deployment-config.yaml` | Deployment wiring up the PVC, ConfigMap, and Secret together |

---

### Module 4 — StatefulSets

> **Folder:** `module4/`

Introduces **StatefulSets** for workloads that require stable identity and per-replica persistent storage — the right
tool for databases and clustered applications.

**Topics covered:**

- Key differences between a Deployment and a StatefulSet
- Stable, ordered pod naming (`podinfo-0`, `podinfo-1`, …)
- Per-pod PVCs via `volumeClaimTemplates`
- **Headless Service** for stable DNS-based pod addressing
- Accessing individual pods by name via `<pod>.<service>.<namespace>.svc.cluster.local`

**Files:**

| File                    | Description                                         | 
|-------------------------|-----------------------------------------------------| 
| `statefulset.yaml`      | StatefulSet with per-pod PVC provisioning           | 
| `service-headless.yaml` | Headless service enabling direct pod DNS resolution |

---

### Module 5 — Ingress

> **Folder:** `module5/`

Shows how to expose multiple services through a single entry point using an **Ingress** resource and the NGINX Ingress
Controller.

**Topics covered:**

- Enabling the minikube `ingress` addon
- Mapping a local hostname to the minikube IP
- Routing external HTTP traffic to a ClusterIP service via Ingress rules

**Files:**

| File                          | Description                                              | 
|-------------------------------|----------------------------------------------------------| 
| `deployment-and-service.yaml` | Combined Deployment and ClusterIPService manifest        | 
| `ingress.yaml`                | Ingress routing `podinfo.local` to the ClusterIP service |

---

## The `podinfo` App

All modules use the **`netgrif/podinfo`** container image — a minimal, dependency-free Node.js app built specifically
for Kubernetes demos. It exposes:

| Endpoint  | Purpose                                                                |
|-----------|------------------------------------------------------------------------|
| `/`       | HTML dashboard — pod identity, env vars, request headers, runtime info |
| `/api`    | Same data as JSON                                                      |
| `/health` | Liveness probe endpoint                                                |
| `/ready`  | Readiness probe endpoint                                               |
| `/logs`   | Contents of this instance's log file                                   |

The color and instance ID on the dashboard change per pod, making it easy to visually confirm load balancing when scaled
to multiple replicas.

---

## Additional Resources

- `presentation.pdf` — slide deck accompanying the workshop
- [`../WORKSHOP-SETUP.md`](../WORKSHOP-SETUP.md) — environment setup guide
- [`../podinfo/`](../podinfo/) — source code and Dockerfile for the `podinfo` image

