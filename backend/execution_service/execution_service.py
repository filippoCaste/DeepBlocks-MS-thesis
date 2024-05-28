import grpc, logging, os, shutil
from concurrent import futures
from proto.proto_pb2 import NetworkResult, File
from proto.proto_pb2_grpc import TrainerServicer, add_TrainerServicer_to_server

from network_generation.model_generation import export_to_onnx, export_to_pth

MAX_MESSAGE_LENGTH = 100 * 1024 * 1024
UPLOAD_DIRECTORY = 'uploads'
CONVERTED_DIRECTORY = 'converted'
if not os.path.exists(UPLOAD_DIRECTORY):
    os.makedirs(UPLOAD_DIRECTORY)

if not os.path.exists(CONVERTED_DIRECTORY):
    os.makedirs(CONVERTED_DIRECTORY)

# delete upload directory on exit
import atexit, shutil
atexit.register(lambda: shutil.rmtree(f"./{UPLOAD_DIRECTORY}"))
atexit.register(lambda: shutil.rmtree(f"./{CONVERTED_DIRECTORY}"))
#############################################################

USERS_ID = 100;

class Executor(TrainerServicer):
    def TrainNetwork(self, request, context):       
        print("This operation is not yet implemented")

        global USERS_ID
        uid = USERS_ID
        USERS_ID += 1

        os.makedirs('uploads/' + str(uid), exist_ok=True)
        if len(request.files) != 0:
            for file in request.files:
                file_path = os.path.join(UPLOAD_DIRECTORY, str(uid), file.file_name)
                with open(file_path, 'wb') as w_file:
                    w_file.write(file.file_data)
        
        # delete id folder when the operations are completed
        shutil.rmtree('uploads/' + str(uid))

        return NetworkResult(status="200", message="OK, completed")

    def ExportNetwork(self, request, context):

        # the request contain the Network object which contains a list of files `files` that in this case
        # will contain {'file_name': 'test.pth', 'file_data': b'000'}

        global USERS_ID
        uid = USERS_ID
        USERS_ID += 1

        file_type = request.files[0].file_name.split('.')[-1]

        os.makedirs('converted/' + str(uid), exist_ok=True)

        if file_type == 'onnx':
            export_to_onnx(request.nodes, request.edges, request.parameters, request.files[0].file_name,uid)

        if file_type == 'pth':
            export_to_pth(request.nodes, request.edges, request.parameters, request.files[0].file_name, uid)

        with open(os.path.join(CONVERTED_DIRECTORY+"/"+str(uid), request.files[0].file_name), 'rb') as r_file:
            ret_file = File(file_data=r_file.read(), file_name=request.files[0].file_name)

        # delete id folder when the operations are completed
        shutil.rmtree('converted/' + str(uid))
        
        return ret_file

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
