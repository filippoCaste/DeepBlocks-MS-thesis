import grpc, logging, os, shutil
from concurrent import futures
from proto.proto_pb2 import NetworkResult, File
from proto.proto_pb2_grpc import TrainerServicer, add_TrainerServicer_to_server

from network_generation.model_generation import export_to_onnx, export_to_pth, train_model

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

        file_names = []
        os.makedirs('uploads/' + str(uid), exist_ok=True)
        if len(request.files) != 0:
            for file in request.files:
                file_path = os.path.join(UPLOAD_DIRECTORY, str(uid), file.file_name)
                file_names.append(file.file_name)
                with open(file_path, 'wb') as w_file:
                    w_file.write(file.file_data)
        
        # delete id folder when the operations are completed
        shutil.rmtree('uploads/' + str(uid))
        print(request.nodes)
        print(request.edges)
        print(request.files)
        try:
            train_model(request.nodes, request.edges, request.parameters, uid, file_names)
            response = NetworkResult(status="200", message="OK, completed", parameters=[])

        except ValueError as ve:
            print(ve)
            response = NetworkResult(status="400", message=str(ve))
        except Exception as e:
            print(e)
            response = NetworkResult(status="500", message=str(e))
            raise(Exception(e))

        return response

    def ExportNetwork(self, request, context):
        """
        Exports a network to a file of the specified type.

        Args:
            request (Network): The Network object containing the list of files to be exported.
                The files are expected to be in the format {'file_name': 'test.pth', 'file_data': b'000'}.
            context: The context object for the RPC call.

        Returns:
            File: The exported file as a File object.

        Raises:
            None

        Side Effects:
            - Creates a directory named 'converted' and a subdirectory with the user ID.
            - Exports the network to a file of the specified type using the export_to_onnx or export_to_pth function.
            - Deletes the subdirectory with the user ID when the export is completed.
        """
        # the request contain the Network object which contains a list of files `files` that in this case
        # will contain {'file_name': 'test.pth', 'file_data': b'000'}

        global USERS_ID
        uid = USERS_ID
        USERS_ID += 1

        file_type = request.files[0].file_name.split('.')[-1]

        os.makedirs('converted/' + str(uid), exist_ok=True)

        if file_type == 'onnx':
            export_to_onnx(request.nodes, request.edges, request.files[0].file_name,uid)

        if file_type == 'pth':
            export_to_pth(request.nodes, request.edges, request.files[0].file_name, uid)

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
    print("GRPC Server listening on port 50051")
    server.wait_for_termination()

if __name__ == '__main__':
    logging.basicConfig()
    serve()
