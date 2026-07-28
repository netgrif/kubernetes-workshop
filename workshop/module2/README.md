# Module 2: Deployment and services

## Create namespace

```shell
kubectl create namespace workshop
```

## Deployment

```shell
kubectl apply -f deployment.yaml -n workshop

kubectl describe deployment/podinfo -n workshop

kubectl get pods -n workshop

kubectl delete pod -l app=podinfo -n workshop

minikube node add

kubectl scale deployment/podinfo -n workshop --replicas=3
```

## Service

```shell
kubectl apply -f service-clusterip.yaml -n workshop

kubectl get svc -n workshop

kubectl describe svc/podinfo-clusterip -n workshop
```

### NodePort service

```shell
kubectl apply -f service-nodeport.yaml -n workshop

kubectl get svc -n workshop

kubectl describe svc/podinfo-nodeport -n workshop

minikube ip
```

open browser http://<minikube ip>:30080

pods are served by round-robin - it is balancing per-connection not per-request

```shell
kubectl get all -n workshop
```

### LoadBalancer service

```shell
kubectl apply -f service-loadbalancer.yaml -n workshop

kubectl describe svc/podinfo-loadbalancer -n workshop

kubectl get svc -n workshop
```

### Tunnel traffic from minikube to local machine

```shell
minikube tunnel
# alebo
minikube service list

minikube service podinfo-loadbalancer -n workshop
```

# Deployment probes

```shell
kubectl apply -f deployment-probes.yaml -n workshop

kubectl get pods -l app=podinfo

kubectl describe -l app=podinfo -n workshop
```
