```shell
kubectl delete namespace workshop
kubectl create namespace workshop
```

# kubectl - PVC

```shell
kubectl apply -f pvc.yaml -n workshop

kubectl describe pvc/podinfo-log-pvc -n workshop

kubectl apply -f deployment.yaml -n workshop
```

showing that minikube using hostPath provisioning

```shell
minikube ssh
cd /tmp/hostpath-provisioner
ls -lah
```

# kubectl - configmap and secret

uncomment mountpoint in deployment

```shell
kubectl delete deployment podinfo -n workshop

kubectl apply -f configmap.yaml -n workshop

kubectl apply -f secret.yaml -n workshop

kubectl apply -f deployment.yaml -n workshop
```
