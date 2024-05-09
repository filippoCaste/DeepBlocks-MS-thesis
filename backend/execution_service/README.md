Poi una volta definito il proto runnare:
```sh
python -m grpc_tools.protoc -I../../protos --python_out=. --pyi_out=. --grpc_python_out=. ../../protos/helloworld.proto
```

E continuare la lettura su: https://grpc.io/docs/languages/python/quickstart/ 