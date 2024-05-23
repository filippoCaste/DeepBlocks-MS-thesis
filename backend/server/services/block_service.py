import grpc
from proto_pb2_grpc import TrainerStub

def train_network():
    with grpc.insecure_channel('localhost:50051') as channel:
        stub = TrainerStub(channel)
        # response = stub.SayHello(HelloRequest(name='Flask'))
        return f"Greeter client received: {response.message}"
