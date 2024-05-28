# services/block_service.py

import grpc, os
from proto.proto_pb2_grpc import TrainerStub
from proto.proto_pb2 import Network

MAX_MESSAGE_LENGTH = 100 * 1024 * 1024

def train_network(nodes, edges, params, session_id):
    with grpc.insecure_channel('localhost:50051',
                               options=[('grpc_max_send_message_length', MAX_MESSAGE_LENGTH),
                                        ('grpc_max_receive_message_length', MAX_MESSAGE_LENGTH)]) as channel:
        stub = TrainerStub(channel)
        
        uploads_dir = os.path.join('uploads', str(session_id))
        files = []
        for filename in os.listdir(uploads_dir):
            with open(os.path.join(uploads_dir, filename), 'rb') as file:
                files.append({'file_data': file.read(), 'file_name': filename})

        print(nodes)
        print(edges)
        print(params)

        response = stub.TrainNetwork(Network(nodes=nodes, edges=edges, parameters=params, files=files))
        return response

def export_network(nodes, edges, params, file_name, session_id):
    with grpc.insecure_channel('localhost:50051',
                               options=[('grpc_max_send_message_length', MAX_MESSAGE_LENGTH),
                                        ('grpc_max_receive_message_length', MAX_MESSAGE_LENGTH)]) as channel:
        stub = TrainerStub(channel)

        files = [{'file_data': b'000', 'file_name': file_name}]

        response = stub.ExportNetwork(Network(nodes=nodes, edges=edges, parameters=params, files=files))

        os.makedirs(os.path.join('converted', str(session_id)), exist_ok=True)

        with open(os.path.join('converted', str(session_id), file_name), 'wb') as file:
            file.write(response.file_data)

        return response