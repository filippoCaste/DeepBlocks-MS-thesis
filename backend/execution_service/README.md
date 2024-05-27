# Execution service
There are two rpc implemented inside the `Executor` service:
- `TrainNetwork` which role is to build the network, train it and returns the result
- `ExportNetwork` which receives the user preference to export the file (can be either `onnx` or a `pth` file) and returns the file.