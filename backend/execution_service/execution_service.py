import grpc, logging, os
from concurrent import futures
from proto.proto_pb2 import NetworkResult
from proto.proto_pb2_grpc import TrainerServicer, add_TrainerServicer_to_server

UPLOAD_DIRECTORY = 'uploads'
if not os.path.exists(UPLOAD_DIRECTORY):
    os.makedirs(UPLOAD_DIRECTORY)

# delete upload directory on exit
import atexit, shutil
atexit.register(lambda: shutil.rmtree(f"./{UPLOAD_DIRECTORY}"))
#############################################################


class Executor(TrainerServicer):
    def TrainNetwork(self, request, context):       
        print("This operation is not yet implemented") 

        for file in request.files:
            file_path = os.path.join(UPLOAD_DIRECTORY, file.file_name)
            with open(file_path, 'wb') as w_file:
                w_file.write(file.file_data)
        
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
