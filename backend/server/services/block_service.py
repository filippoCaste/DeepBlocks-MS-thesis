import grpc
from proto.proto_pb2_grpc import TrainerStub
from proto.proto_pb2 import Network

def train_network(nodes, edges, params):
    with grpc.insecure_channel('localhost:50051') as channel:
        stub = TrainerStub(channel)
        response = stub.TrainNetwork(Network(nodes=nodes, edges=edges, parameters=params))
        return response
