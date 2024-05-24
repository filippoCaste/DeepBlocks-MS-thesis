'use strict';
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import MainContent from './components/MainContent';
import CustomNode from './components/CustomNode';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NotFoundPage from './pages/NotFoundPage';
import { useNodesState, useEdgesState } from 'reactflow';
import SuperBlockNode from './components/SuperBlockNode';
import Block from './models/Block';
import Superblock from './models/SuperBlock';
import AlertConfirmation from './components/AlertConfirmation';
import { BLOCKS_API } from './API/blocks';
import ResponseMessage from './components/ResponseMessage';

// just for temporary use
const node1 = new Block('customNode', { x: 10, y: 0 }, { label: 'Leaky ReLU' }, [
  { name: "input_tensor", description: "Input tensor", value: 'null' }, 
  { name: "negative_slope", description: "Negative slope", value: 'null' } ]);

const node2 = new Block('customNode', { x: 10, y: 100 }, { label: 'ReLU' }, [
    { name: "input_tensor", description: "Input tensor", value: null }
]);

const superNode1 = new Superblock('superBlockNode', { x: 10, y: 200 }, { label: 'sb1', isSelected: false }, [node1.id, node2.id]);


const initialNodes = [node1, node2, superNode1]
const initialEdges = [{ id: 'e1-2', source: '0', target: '1' }];
// -----------------------------------------------------------------------------------------------------

const nodeTypes = { customNode: CustomNode, superBlockNode: SuperBlockNode };


export default function App() {

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [variant, setVariant] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  // training parameters
  const [learningRate, setLearningRate] = useState(0);
  const [epochs, setEpochs] = useState(0);
  const [batchSize, setBatchSize] = useState(0);
  const [loss, setLoss] = useState('');
  const [optimizer, setOptimizer] = useState('');
  // --------------------------------------------------

  // message props
  const [showMessage, setShowMessage] = useState(false);
  // --------------------------------------------------


  const [appName, setAppName] = useState("My DeepBlock's network")

  const handleAddNode = (node) => {
    // check if there is a supernode which is opened in a sheet
    const superBlockOpened = nodes.find(e => e.data.isOpenInSheet === true);
    if(superBlockOpened) {
      superBlockOpened.children.push(node.id);
    }
    setNodes((prevNodes) => [...prevNodes, node]);
  }

  // const handleDeleteNode = (node) => {
  //   let updatedNodes=[];
  //   if(node.type === 'superBlockNode') {
  //     const nodeChildren = nodes.find(e => e.id === node.id).children;
  //     // delete the children
  //     nodes.filter(n => !nodeChildren.includes(n.id));
  //     // delete the supernode
  //     updatedNodes = nodes.filter(n => n.id != node.id);

  //   } else {
  //     updatedNodes = nodes.filter(n => n.id != node.id);
  //   }

  //   setNodes(() => updatedNodes);
  // }

  const handleDeleteNodes = (toDeleteNodes) => {
    let updatedNodes = [...nodes];
    for(let node of toDeleteNodes) {
      if (node.type === 'superBlockNode') {
        const nodeChildren = updatedNodes.find(e => e.id === node.id).children;
        // delete the children
        updatedNodes = [...updatedNodes.filter(n => !nodeChildren.includes(n.id))]
        // delete the supernode
        updatedNodes = [...updatedNodes.filter(n => n.id != node.id)];

      } else {
        updatedNodes = [...updatedNodes.filter(n => n.id != node.id)]
      }
    }
    setNodes(() => updatedNodes);
  }

  const handleRenameNode = (node, newName) => {
    const updatedNodes = nodes.map(n => n.id === node.id ? {...n, data: {...n.data, label: newName}} : n)
    setNodes(() => updatedNodes)
  }

  const handleDuplicateNode = (node) => {
    let copy = {};
    if (node.type === 'superBlockNode') {
      copy = new Superblock(node.type, { ...node.position, y: node.position.y - 10 }, { ...node.data, label: "copy of " + node.data.label}, []);
    } else {
      copy = new Block(node.type, {...node.position, y: node.position.y-10}, {...node.data, label: "copy of " + node.data.label}, node.parameters);
    }
    setNodes((prevNodes) => [...prevNodes, copy])
  }

  const handleDownload = (networkParameters, fileType) => {
    if(fileType === 'json') {
      // convert collections to downloadable json file
      const network = JSON.stringify({
        nodes: nodes,
        edges: edges,
        params: networkParameters
      })

      const blob = new Blob([network], { type: 'application/json;charset=utf-8' })

      const dataUrl = window.URL.createObjectURL(blob);
      const downloadLink = document.createElement('a');
      downloadLink.href = dataUrl;
      downloadLink.setAttribute('download', appName);

      document.body.appendChild(downloadLink);
      downloadLink.click();
      window.URL.revokeObjectURL(dataUrl);
      document.body.removeChild(downloadLink);
    } else if(fileType === 'onnx') {
      
    } else if(fileType === 'pth') {
      
    }

    setShowMessage(true);
    setMessage("Network succesfully downloaded");
    setVariant("success");
  }

  const handleUpload = (inputFile) => {
    if (inputFile) {
      const reader = new FileReader();

      reader.onload = () => {
        try {
          const jsonData = JSON.parse(reader.result);
          const { nodes, edges, params } = jsonData;

          if(!nodes || !edges || !params) {
            throw new Error('Error while uploading the file: the file is not a valid json file');
          }

          setNodes(nodes);
          setEdges(edges);
          setLearningRate(params.learningRate);
          setEpochs(params.epochs);
          setBatchSize(params.batchSize);
          setLoss(params.loss);
          setOptimizer(params.optimizer);

        } catch (error) {
          setShowMessage(true);
          setMessage(error.message);
          setVariant("danger");
        }
      };

      reader.onerror = () => {
        setShowMessage(true);
        setMessage("Error while uploading the file: " + reader.error.message);
        setVariant("danger");
      };

      reader.readAsText(inputFile);
      
      setShowMessage(true);
      setMessage("Network succesfully uploaded");
      setVariant("success");

    }
  }

  return (
    <BrowserRouter>
      <div className='app-container' style={{ display: 'flex' }}>
        <Sidebar nodes={nodes} edges={edges} setNodes={setNodes} handleAddNode={handleAddNode} 
            handleDeleteNodes={handleDeleteNodes} handleRenameNode={handleRenameNode} handleDuplicateNode={handleDuplicateNode}
            handleDownload={handleDownload} handleUpload={handleUpload}
            learningRate={learningRate} epochs={epochs} batchSize={batchSize} loss={loss} optimizer={optimizer}
            setLearningRate={setLearningRate} setEpochs={setEpochs} setBatchSize={setBatchSize} setLoss={setLoss} setOptimizer={setOptimizer}
          />

        {showMessage && <ResponseMessage message={message} variant={variant} setShowMesssage={setShowMessage} />}
        {showConfirmation && <AlertConfirmation message={message} title={title} handleCancel={handleCancel} handleConfirm={handleConfirm} variant={variant} />}
        <Routes>
          <Route index element={<MainContent style={{ flex: 1 }} edges={edges} setNodes={setNodes} setEdges={setEdges}
                                      nodeTypes={nodeTypes} nodes={nodes} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}
                                      appName={appName} setAppName={setAppName} handleDeleteNodes={handleDeleteNodes}
                                      
                                  />} 
            />
          <Route path='*' element={<NotFoundPage />} />

        </Routes>
      </div>
    </BrowserRouter>
  );
}