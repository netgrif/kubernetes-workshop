# Module 3: Persistent storage

## Refresh namespace

```shell
kubectl delete namespace workshop
kubectl create namespace workshop
```

# PVC

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

make few request and look into log

```shell
kubectl port-forward pod/podinfo 8080:8080 -n workshop

cat /tmp/hostpath-provisioner/workshop/podinfo-log-pvc/pod-<id>.log
```

# ConfigMap and Secret

```shell
kubectl apply -f configmap.yaml -n workshop

kubectl apply -f secret.yaml -n workshop

kubectl apply -f deployment-config.yaml -n workshop

kubectl port-forward pod/podinfo 8080:8080 -n workshop
```

look inside the pod to find mounted files go browser and look into ENV variables

```shell
kubectl exec -it pod/podinfo-<dpl id> -n workshop -- sh

cd mnt
ls
cat mnt/config/config.json
cat mnt/secret/secret_key
```
