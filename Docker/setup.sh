# actions: 
#   reset  - reset minikube and start with volume mount
#   apply  - (default) sets up configs, services and pods
#   fwd    - Start port forwarding
#   delete - delete setup

MOUNT_PATH="$(pwd)/taps"
DEFAULT_ACTION="apply"
action="${1:-$DEFAULT_ACTION}"
echo $action

if [ $action = "reset" ]; then
    minikube stop
    minikube delete
    minikube start --mount-string=$MOUNT_PATH --mount
    exit 0
fi

if [ $action = "fwd" ]; then
    kubectl port-forward ingress 8080:8080
    exit 0
fi

kubectl $action -f envoy_collector.conf.yaml
kubectl $action -f envoy_ingress.conf.yaml
kubectl $action -f envoy_target.conf.yaml

kubectl $action -f pods/collector.pod.yaml
kubectl $action -f pods/ingress.pod.yaml
kubectl $action -f pods/target.pod.yaml

