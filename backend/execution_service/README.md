# Execution service
There are two rpc implemented inside the `Trainer` service:
- `TrainNetwork` which role is to build the network, train it. Returns the result.
- `ExportNetwork` which receives the user preference to export the file (can be either `onnx` or a `pth` file) and returns the file.
- `ForwardBlock` which receives the network and checks each block by forwarding it. Returns a message.

From the `proto/proto.proto` file you can inspect how the response is structured.
