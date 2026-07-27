```shell
kubectl create namespace workshop
```

# kubectl - pod

```shell
kubectl apply -f pod.yaml -n workshop

kubectl describe pod/podinfo -n workshop

kubectl port-forward pod/podinfo -n workshop 8080:8080

kubectl delete pod/podinfo -n workshop
```

# kubectl - deployment

```shell
kubectl apply -f deployment.yaml -n workshop

kubectl describe deployment/podinfo -n workshop

kubectl get pods -n workshop

kubectl delete pod/podinfo -n workshop

kubectl scale deployment/podinfo -n workshop --replicas=3
```

# kubectl - service

```shell
kubectl apply -f service-clusterip.yaml -n workshop

kubectl get svc -n workshop

kubectl describe svc/podinfo-clusterip -n workshop

kubectl apply -f service-nodeport.yaml -n workshop

kubectl get svc -n workshop

kubectl describe svc/podinfo-nodeport -n workshop

minikube ip
```

browser open http://<minikube ip>:30080

pods are served by round-robin - it is balancing per connection no per request

```shell
kubectl get all -n workshop
```

```shell
kubectl apply -f service-loadbalancer.yaml -n workshop

kubectl describe svc/podinfo-loadbalancer -n workshop

kubectl get svc -n workshop

minikube service list

minikube service podinfo-loadbalancer -n workshop
```

# kubectl - update deploy

uncoment probes from deployment

```shell
kubectl apply -f deployment.yaml -n workshop

kubectl get pods -l app=podinfo

kubectl describe -l app=podinfo -n workshop

```
