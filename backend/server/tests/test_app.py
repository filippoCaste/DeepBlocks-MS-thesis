import unittest
import os
import json
import shutil
from unittest.mock import patch, MagicMock
from flask import Flask
from flask.testing import FlaskClient
from main import app 

class FlaskTestCase(unittest.TestCase):
    def setUp(self):
        app.config['TESTING'] = True
        self.client: FlaskClient = app.test_client()

        UPLOAD_DIRECTORY = 'uploads'
        if not os.path.exists(UPLOAD_DIRECTORY):
            os.makedirs(UPLOAD_DIRECTORY)

        CONVERTED_DIRECTORY = 'converted'
        if not os.path.exists(CONVERTED_DIRECTORY):
            os.makedirs(CONVERTED_DIRECTORY)


    def tearDown(self):
        from USERS_SET import USERS_SET
        global USERS_SET
        USERS_SET.clear()

    @patch('controllers.block_controller.train_network_service')
    def test_post_all_blocks(self, mock_train_network):
        data = {
            'network': {
                'params': [],
                'blocks': [],
                'edges': []
            },
            'sessionId': 1
        }
        
        mock_response = MagicMock()
        mock_response.status = '200'
        mock_response.message = 'Success'
        mock_response.metrics = [] 
        mock_train_network.return_value = mock_response

        response = self.client.post('/api/blocks', data=json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 403)

        from USERS_SET import USERS_SET
        USERS_SET.add(1)
        response = self.client.post('/api/blocks', data=json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json['message'], 'Success')
        self.assertEqual(response.json['metrics'], [])

    @patch('routes.block_routes.export_blocks')
    def test_export_blocks(self, mock_export_blocks):
        data = {
            'network': {
                'params': [],
                'blocks': [],
                'edges': []
            },
            'sessionId': 1,
            'appName': 'Test App',
            'type': 'json'
        }

        mock_response = MagicMock()
        mock_response.file_name = 'Test-App.json'
        mock_export_blocks.return_value = mock_response

        response = self.client.post('/api/blocks/export', data=json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 404)


        dummy_file_path = 'converted/1/Test-App.json'
        os.makedirs(os.path.dirname(dummy_file_path), exist_ok=True)
        with open(dummy_file_path, 'w') as f:
            f.write('dummy content')

        with open(dummy_file_path, 'r') as f:
            file_content = f.read()

        f.close()

        from USERS_SET import USERS_SET
        USERS_SET.add(1)

        response = self.client.post('/api/blocks/export', data=json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.headers['Content-Disposition'], 'attachment; filename=Test-App.json')
        self.assertEqual(response.mimetype, 'application/octet-stream')
        self.assertEqual(response.data.decode('utf-8'), 'dummy content')

    def test_get_session(self):
        response = self.client.get('/api/session')

        self.assertEqual(response.status_code, 200)
        self.assertIn('sessionId', response.json)

        session_id = response.json['sessionId']

        uploads_dir = os.path.join('uploads', str(session_id))
        self.assertTrue(os.path.exists(uploads_dir))
        self.assertTrue(os.path.isdir(uploads_dir))

        from USERS_SET import USERS_SET
        self.assertIn(session_id, USERS_SET)

if __name__ == '__main__':
    unittest.main()
