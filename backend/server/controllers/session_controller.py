# controllers/session_controller.py

import os, shutil
from flask import jsonify, request
from USERS_SET import USERS_SET

USER_SESSION_NUM = 10000

def get_session():
    global USER_SESSION_NUM 
    global USERS_SET

    USERS_SET.add(USER_SESSION_NUM)

    print("Assigned session: " + str(USER_SESSION_NUM))
    print(USERS_SET)

    os.makedirs('uploads/' + str(USER_SESSION_NUM), exist_ok=True)
    response = jsonify({'sessionId': USER_SESSION_NUM})

    USER_SESSION_NUM += 1
    return response

def delete_session():
    data = request.get_json()
    session_id = data.get('sessionId')

    global USERS_SET

    USERS_SET.remove(session_id)

    try:
        shutil.rmtree(os.path.join('uploads', str(session_id)))
        shutil.rmtree(os.path.join('converted', str(session_id)))
        print("Deleted session: " + str(session_id))
    except OSError as e:
        print(f"Error: {e.strerror}")
    
    return jsonify({'status': 'OK'})
