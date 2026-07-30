# Module 4: StatefulSet

## Refresh namespace

```shell
kubectl delete namespace workshop
kubectl create namespace workshop
```

## Statefulset

```shell
kubectl apply -f statefulset.yaml -n workshop

kubectl describe sts/podinfo -n workshop

kubectl apply -f service-headless.yaml -n workshop

kubectl scale sts/podinfo -n workshop --replicas=3

kubectl get pvc -n workshop
```

## Statefulset access through headless service

even though there is one service it does not have na IP so for access we need to specify pod name

```shell
kubectl exec -it pod/podinfo-2 -n workshop -- sh

wget -qO- http://podinfo-0.podinfo-headless.workshop/api
# here it should end up with connection refused

wget -qO- http://podinfo-0.podinfo-headless.workshop:8080/api
# this command works and returns a json
```

