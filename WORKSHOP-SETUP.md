# SETUP workshop

## Install minikube

https://minikube.sigs.k8s.io/docs/start/?arch=%2Flinux%2Fx86-64%2Fstable%2Fbinary+download

```shell
minikube start

minikube addons enable dashboard
minikube addons enable metrics-server

minikube config set memory 4096

minikube stop
minikube start

minikube ip
```

## For ingress domain be available localy

`minikube addons enable ingress-dns`

https://minikube.sigs.k8s.io/docs/handbook/addons/ingress-dns/#Linux

## Setup proxy for docker

Ak minikube vyhodí pri štarte chybu, "Failing to connect to https://registry.k8s.io/ from inside the minikube VM"
môže byť potrebné nastaviť proxy.

skús najprv spustiť: `minikube ssh -- curl -sI https://registry.k8s.io/`
Ak to vráti HTTP reposne tak je dobre môžme pokračovať ... ak nie tak treba zistiť kde to vysí (DNS resolving, PROXY na
internet, lokálny firewall)

Ak to bolo ok, potiahni jeden image pre pod či nabehne:

```shell
kubectl run test --image=nginx --restart=Never
kubectl get pods
```

Ak to nabehne všetko v poriadku, ak nie tak

`kubectl describe pod test`

v eventoch bude chyba čo sa udialo.
