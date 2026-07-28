# Module 5: Ingress

## enabling ingress in minikube

```shell
minikube addons enable ingress

echo "$(minikube ip) podinfo.local" | sudo tee -a /etc/hosts
```

## deploying pod to access with ingress

```shell
kubectl delete namespace workshop
kubectl create namespace workshop
```

```shell
kubectl get ingressClass

kubectl apply -f deployment-and-service.yaml -n workshop

kubectl apply -f ingress.yaml -n workshop

kubectl describe ingress podinfo-ingress -n workshop
```

open browser to http://podinfo.local
