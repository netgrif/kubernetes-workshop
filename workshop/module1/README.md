# Module 1: Introduction to Kubernetes


## starting minikube

```shell
minikube start

minikube addons enable dashboard
minikube addons enable metrics-server

minikube config set memory 4096

minikube stop
minikube start

minikube ip
```

### kubectl from minikube

if no kubectl

#### linux

```shell
alias kubectl="minikube kubectl --"
```

#### macos

```shell
alias kubectl="minikube kubectl --"
```

#### windows

```powershell
function kubectl { minikube kubectl -- $args }
```

```cmd
doskey kubectl=minikube kubectl $*
```


## Cluster info

```shell
kubectl get nodes

kubectl describe node minikube

kubectl get pods -ALL

kubectl get namespaces

kubectl get pods

kubectl cluster-info
```

## Create single pod

```shell
kubectl run nginx --image=nginx

kubectl apply -f pod.yaml

kubectl describe pod nginx

kubectl logs nginx

kubectl exec -it nginx -- sh

kubectl delete pod nginx
```
