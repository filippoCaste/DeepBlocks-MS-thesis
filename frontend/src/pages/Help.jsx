'use strict';
import React from 'react'
import {Remarkable} from 'remarkable';

export default function Help() {

    const md = new Remarkable();

    const markdownContent = `
# Welcome to DeepBlocks
DeepBlocks is a platform to help you practice with deep learning. It allows you to create your own network, train it, and visualize the results.

## How to Use DeepBlocks
### Create Your Network
Add blocks to the canvas and connect them to create your network


or create your own custom superblocks.


### Train Your Network
Set the parameters for training (learning rate, epochs, batch size, loss, optimizer). 


DeepBlocks will train your network automatically (after 10 seconds without any change) and provide you with the training results.


### Visualize the Results

Visualize the training metrics and the network's performances.


### Export Your Network
Export your network to a file (format: onnx, pth or JSON).


You can set the name of your Network (which will be the file name) by clicking on the ✏️ button.


### Upload a Network
Upload a network from your computer (accepted format: JSON).


### Zoom controls
Use the mouse wheel to zoom in and out, or use the buttons in the bottom right of the screen to zoom in, zoom out, fit the view and toggle the interactivity.


`;

    return (
        <div className='help-page'>
            <div dangerouslySetInnerHTML={{ __html: md.render(markdownContent) }} />
        </div>
    );
}