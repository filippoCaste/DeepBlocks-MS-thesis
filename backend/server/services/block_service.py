# services/block_service.py

import grpc, os
from proto.proto_pb2_grpc import TrainerStub
from proto.proto_pb2 import Network

def train_network(nodes, edges, params, session_id):
    with grpc.insecure_channel('localhost:50051') as channel:
        stub = TrainerStub(channel)
        
        uploads_dir = 'uploads/' + str(session_id)
        files = []
        for filename in os.listdir(uploads_dir):
            with open(os.path.join(uploads_dir, filename), 'rb') as file:
                files.append({'file_data': file.read(), 'file_name': filename})

        print(nodes)
        print(edges)
        print(params)

        response = stub.TrainNetwork(Network(nodes=nodes, edges=edges, parameters=params, files=files))
        return response
