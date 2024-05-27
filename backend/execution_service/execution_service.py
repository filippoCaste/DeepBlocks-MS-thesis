import grpc, logging, os
from concurrent import futures
from proto.proto_pb2 import NetworkResult, File
from proto.proto_pb2_grpc import TrainerServicer, add_TrainerServicer_to_server

MAX_MESSAGE_LENGTH = 100 * 1024 * 1024
UPLOAD_DIRECTORY = 'uploads'
if not os.path.exists(UPLOAD_DIRECTORY):
    os.makedirs(UPLOAD_DIRECTORY)

# delete upload directory on exit
import atexit, shutil
atexit.register(lambda: shutil.rmtree(f"./{UPLOAD_DIRECTORY}"))
#############################################################

USERS_ID = 100;

class Executor(TrainerServicer):
    def TrainNetwork(self, request, context):       
        print("This operation is not yet implemented")

        global USERS_ID
        os.makedirs('uploads/' + str(USERS_ID), exist_ok=True)
        if len(request.files) != 0:
            for file in request.files:
                file_path = os.path.join(UPLOAD_DIRECTORY, str(USERS_ID), file.file_name)
                with open(file_path, 'wb') as w_file:
                    w_file.write(file.file_data)
        
        USERS_ID += 1
        # print(f"The request is {request}")
        # delete id folder when the operations are completed
        return NetworkResult(status="200", message="OK, completed")

    def ExportNetwork(self, request, context):
        print("This operation is not yet implemented")

        print(f"The request is {request}")

        return File(file_data=b'000', file_name='test.pth')

def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=3), 
                                                    options=[('grpc.max_send_message_length', MAX_MESSAGE_LENGTH),
                                                            ('grpc.max_receive_message_length', MAX_MESSAGE_LENGTH)])
    add_TrainerServicer_to_server(Executor(), server)
    server.add_insecure_port('[::]:50051')
    server.start()
    server.wait_for_termination()

if __name__ == '__main__':
    logging.basicConfig()
    serve()
