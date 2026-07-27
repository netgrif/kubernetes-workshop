# minikube

```shell
minikube start

minikube addons enable ingress
minikube addons enable dashboard
minikube addons enable metrics-server

minikube config set memory 4096

minikube stop
minikube start

minikube ip
```

# kubectl - cluster info

```shell
kubectl get nodes

kubectl describe node minikube

kubectl get pods -ALL

kubectl get namespaces

kubectl get pods

kubectl cluster-info
```

# kubectl - create pod

```shell
kubectl run nginx --image=nginx

kubectl apply -f pod.yaml

kubectl describe pod nginx

kubectl logs nginx

kubectl exec -it nginx -- sh

kubectl delete pod nginx
```
