import grpc, logging
from concurrent import futures
from proto.proto_pb2 import NetworkResult
from proto.proto_pb2_grpc import TrainerServicer, add_TrainerServicer_to_server

class Executor(TrainerServicer):
    def TrainNetwork(self, request, context):       
        print("This operation is not yet implemented") 
        print(f"The request is {request}")
        return NetworkResult(status="200", message="OK, completed")

def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=3))
    add_TrainerServicer_to_server(Executor(), server)
    server.add_insecure_port('[::]:50051')
    server.start()
    server.wait_for_termination()

if __name__ == '__main__':
    logging.basicConfig()
    serve()
