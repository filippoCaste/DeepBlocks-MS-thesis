'use strict';
import React from 'react'
import Download from 'react-bootstrap-icons/dist/icons/download'
import Upload from 'react-bootstrap-icons/dist/icons/upload'
import PencilFill from 'react-bootstrap-icons/dist/icons/pencil-fill'
import Pencil from 'react-bootstrap-icons/dist/icons/pencil';
import PlayFill from 'react-bootstrap-icons/dist/icons/play-fill'
import List from 'react-bootstrap-icons/dist/icons/list'
import GraphDown from 'react-bootstrap-icons/dist/icons/graph-down';
import { ExclamationTriangleFill } from 'react-bootstrap-icons';
import { Alert, Image } from 'react-bootstrap';

export default function Help() {
    return (
        <div className='help-page'>
            <h1>Welcome to DeepBlocks</h1>
            <hr />
            <p>DeepBlocks is a platform to help you practice with deep learning. It allows you to create your own network, train it, and visualize the results.</p>

            <br />
            <h2>How to Use DeepBlocks</h2>
            <br />
            <h3>Create Your Network</h3>
            <p>Open the <PencilFill /> menu on the left, choose and add your blocks, and then connect them to create your network.</p>
            <Image src="./src/pages/imgs/help-add-block.png" rounded alt="Add blocks" style={{ height: '700px', width: '800px' }} />

            <p>You can also create your own custom superblocks by right-clicking on a block, selecting it, and then pressing "Group".</p>
            <Image src="./src/pages/imgs/help-blocks-selection.png" rounded alt="Select blocks" style={{ height: '700px', width: '800px' }} />

            <br />
            <h3>List of Blocks</h3>
            <p>By clicking on the <List /> button, you can see the list of blocks in the current sheet.</p>
            <Image src="./src/pages/imgs/help-blocks-list.png" rounded alt="List of blocks" style={{ height: '700px', width: '800px' }} />

            <br />
            <h3>Check Your Network</h3>
            <p>DeepBlocks will check your network automatically (after 10 seconds without any change). You will receive a message indicating if there is any error and which node caused the error, if any.</p>
            <Image src="./src/pages/imgs/help-forwarding-message.png" rounded alt="Error message" style={{ height: '700px', width: '800px' }} />

            <br />
            <h3>Train Your Network</h3>
            <p>Click on the <PlayFill /> button to open the "Training" menu from which you can train your network.</p>
            <p>Set the parameters for training (learning rate, epochs, batch size, loss function, optimizer).</p>
            <p>You can also choose to define your own custom loss function by selecting the "Custom" option and uploading a file containing a function called "custom_loss".</p>
            <p>After pressing the "Train" button, the network will be trained and the results will be shown in the "Analysis" tab.</p>
            <Image src="./src/pages/imgs/help-training-menu.png" rounded alt="Training menu" style={{ height: '700px', width: '800px' }} />

            <br />
            <h3>Visualize the Results</h3>
            <p>Visualize the training metrics and the network's performance by opening the <GraphDown /> menu.</p>

            <br />
            <h3>Export Your Network</h3>
            <p>Export your network to a file by opening the <Download /> menu (formats: onnx, pth, or JSON).</p>
            <p>You can set the name of your network (which will be the file name) by clicking on the <Pencil /> button at the top of the page next to the app name.</p>

            <br />
            <h3>Upload a Network</h3>
            <p>Open the <Upload /> menu and upload a network from your computer (accepted format: JSON).</p>
            <Alert variant="warning" style={{ width: 'fit-content' }}>
                <ExclamationTriangleFill /> If you want to continue working on a previous project, you must first download it as a JSON file in order to upload it.
            </Alert>

            <br />
            <h3>Zoom Controls</h3>
            <p>Use the mouse wheel to zoom in and out, or use the buttons in the bottom right of the screen to zoom in, zoom out, fit the view, and toggle the interactivity.</p>

            <hr />
            <br />
            <h2>Pytorch Implementation</h2>
            <p>The backend of the DeepBlocks application uses Pytorch. The model is generated according to the blocks added in the frontend.</p>
            <p>To start the training, you need to add an Input dataset block, double-click on the block to open the parameters, and set up the input dataset.</p>
            <p>You also need to set up the training parameters such as the learning rate, the number of epochs, the batch size, and the loss function.</p>

            <br />
            <h2>About</h2>
            <p>Developed by Filippo Castellarin (<a href="https://github.com/filippocaste">https://github.com/filippocaste</a>) during his Master's thesis at the Polytechnic University of Turin.</p>
            <p>Supervisors of the project: Prof. Luigi de Russis, Tommaso Calò.</p>
        </div>
    );
}
