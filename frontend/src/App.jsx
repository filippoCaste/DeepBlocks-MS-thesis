'use strict';
import React, { useCallback, useState } from 'react';
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
import { SESSION_API } from './API/session';
import InvisibleInputNode from './components/InvisibleInputNode';
import { InvisibleOutputNode } from './components/InvisibleOutputNode';
import InvisibleBlock from './models/InvisibleBlock';

// just for temporary use
let node1 = new Block('customNode', { x: 10, y: 0 }, { label: 'Leaky ReLU' }, [
  { "name": "layer_type", "description": "Type of the layer", "value": null },
  { "name": "input_tensor", "description": "Input tensor", "value": null },
  { "name": "output_tensor", "description": "Output tensor", "value": null },
  { "name": "negative_slope", "description": "Negative slope", "value": null }
  ], 'torch.nn.functional.leaky_relu');

let node2 = new Block('customNode', { x: 10, y: 100 }, { label: 'ReLU' }, [
  { "name": "layer_type", "description": "Type of the layer", "value": null },
  { "name": "input_tensor", "description": "Input tensor", "value": null },
  { "name": "output_tensor", "description": "Output tensor", "value": null }
], 'torch.relu');

node1.hidden = true;
node2.hidden = true;

let superNode1 = new Superblock('superBlockNode', { x: 10, y: 200 }, { label: 'sb1', isSelected: false }, [node1.id, node2.id]);
superNode1.hidden = false;

const initialNodes = [node1, node2, superNode1]
const initialEdges = [{ id: 'e1-2', source: '0', target: '1' }];
// -----------------------------------------------------------------------------------------------------

export const sessionId = await SESSION_API.getSession();
window.addEventListener('beforeunload', SESSION_API.deleteSession);

const nodeTypes = { customNode: CustomNode, superBlockNode: SuperBlockNode, invisibleInputNode: InvisibleInputNode, invisibleOutputNode: InvisibleOutputNode };


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

  const [sheets, setSheets] = useState([['main', 'main']])
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
  
  const onNodesDelete = useCallback(
    (deleted) => {
      handleDeleteNodes(deleted);
    }, [nodes, edges]
  );

  /**
 * Deletes the specified nodes and their associated edges from the graph.
 *
 * @param {Array} toDeleteNodes - An array of nodes to be deleted.
 * @return {void} This function does not return a value.
 */
  const handleDeleteNodes = (toDeleteNodes) => {
    let updatedNodes = [...nodes];
    let updatedEdges = [...edges];

    let superNodes = nodes.filter(e => e.type === 'superBlockNode');

    for(let node of toDeleteNodes) {

      if (node.type === 'superBlockNode') {
        const nodeChildren = updatedNodes.find(e => e.id === node.id).children;
        // delete the children
        updatedNodes = [...updatedNodes.filter(n => !nodeChildren.includes(n.id))]
        // delete the supernode
        updatedNodes = [...updatedNodes.filter(n => n.id != node.id)];

        // delete the edges inside the supernode
        updatedEdges = [...updatedEdges.filter(e => !nodeChildren.includes(e.source) && !nodeChildren.includes(e.target))]

        // delete the edges coming/going to the supernode
        updatedEdges = [...updatedEdges.filter(e => e.source != node.id && e.target != node.id)]

        setSheets((oldSheets) => [...oldSheets.filter(e => e[0] != node.id)]);
      } else {
        // delete the child from the supernode
        for (let sn of superNodes) {
          if (sn.children.includes(node.id)) {
            sn.children = sn.children.filter(e => e != node.id);
          }
        }

        updatedEdges = [...updatedEdges.filter(n => n.source != node.id && n.target != node.id)];
        updatedNodes = [...updatedNodes.filter(n => n.id != node.id)]
      }
    }

    setEdges(() => [...updatedEdges]);
    setNodes(() => [...updatedNodes]);
  }

  const handleRenameNode = (node, newName) => {
    const updatedNodes = nodes.map(n => n.id === node.id ? {...n, data: {...n.data, label: newName}} : n)
    setNodes(() => [...updatedNodes])
  }

  const handleDuplicateNode = (node) => {
    let copy = {};
    if (node.type === 'superBlockNode') {
      // copy the superblock
      //// get children
      const childrenId = nodes.find(e => e.id === node.id).children.filter(e => !e.includes('i') && !e.includes('o'));
      let childrenNodes = [];

      for(let childId of childrenId) {
        childrenNodes.push(nodes.find(e => e.id === childId));
      }

      let pairIds = []

      //// create children blocks
      copy = childrenNodes.map(n => {
        let b = new Block(n.type, { ...n.position }, { ...n.data, label: n.data.label }, n.parameters);
        b = {...b, hidden: true, fn: n.fn };
        pairIds.push([n.id, b.id]);
        return b;
      })

      //// get the new blocksId
      const newChildrenId = copy.map(e => e.id);
      //// create superblock
      let superblock = new Superblock(node.type, { ...node.position, y: node.position.y - 10 }, { ...node.data, label: "copy of " + node.data.label, hasSheet: false, isOpenInSheet: false, openInfo: false }, newChildrenId);
      const invisibleInput = new InvisibleBlock(superblock.id + 'i', 'invisibleInputNode', { x: -250, y: 100 })
      const invisibleOutput = new InvisibleBlock(superblock.id + 'o', 'invisibleOutputNode', { x: 300, y: 100 })
      superblock.children.push(invisibleInput.id, invisibleOutput.id)
      copy.push({...invisibleInput, hidden:true})
      copy.push({...invisibleOutput, hidden:true})
      copy.push(superblock);

      // copy the edges
      const edgesToCopy = edges.filter(e => childrenId.includes(e.source) || childrenId.includes(e.target)).map(e => {
        // console.log(pairIds.find(e => { console.log(e, e.source) ; return e[0] == e.source}))
        return {...e, 
          source: e.source.includes('i') ? invisibleInput.id : pairIds.find(p => p[0] == e.source)[1], 
          target: e.target.includes('o') ? invisibleOutput.id : pairIds.find(p => p[0] == e.target)[1]}
      });

      setEdges((prevEdges) => [...prevEdges, ...edgesToCopy])

    } else {

      copy.push(new Block(node.type, {...node.position, y: node.position.y-10}, {...node.data, label: "copy of " + node.data.label}, node.parameters));

    }
    setNodes((prevNodes) => [...prevNodes, ...copy])
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
    } else {
      BLOCKS_API.exportNetwork(nodes, edges, networkParameters,fileType, appName).then((blob) => {
        const dataUrl = window.URL.createObjectURL(blob);
        const downloadLink = document.createElement('a');
        downloadLink.href = dataUrl;
        downloadLink.setAttribute('download', appName+'.'+fileType);

        document.body.appendChild(downloadLink);
        downloadLink.click();
        window.URL.revokeObjectURL(dataUrl);
        document.body.removeChild(downloadLink);

        setShowMessage(true);
        setMessage("Network succesfully downloaded");
        setVariant("success");

      }).catch((error) => {
        // console.log(error);
        setShowMessage(true);
        setMessage("Error while exporting the network: " + error.message);
        setVariant("danger");
      })
    }
  }

  const handleUpload = (inputFile) => {
    if (inputFile) {
      const reader = new FileReader();

      reader.onload = () => {
        try {
          const jsonData = JSON.parse(reader.result);
          const { nodes, edges, params } = jsonData;

          if(!nodes || !edges || !params) {
            throw new Error('The file is not a valid json file');
          }

          setNodes(nodes);
          setEdges(edges);

          for(let param of params) {
            if(param.key === 'learningRate') {
              setLearningRate(param.value);
            } else if(param.key === 'epochs') {
              setEpochs(param.value);
            } else if(param.key === 'batchSize') {
              setBatchSize(param.value);
            } else if(param.key === 'loss') {
              setLoss(param.value);
            } else if(param.key === 'optimizer') {
              setOptimizer(param.value);
            }
          }

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

        {showMessage && <ResponseMessage message={message} variant={variant} setShowMessage={setShowMessage} />}
        {showConfirmation && <AlertConfirmation message={message} title={title} handleCancel={handleCancel} handleConfirm={handleConfirm} variant={variant} />}
        <Routes>
          <Route index element={<MainContent style={{ flex: 1 }} edges={edges} setNodes={setNodes} setEdges={setEdges}
                                      nodeTypes={nodeTypes} nodes={nodes} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onNodesDelete={onNodesDelete}
                                      appName={appName} setAppName={setAppName} handleDeleteNodes={handleDeleteNodes}
                                      handleAddNode={handleAddNode} sheets={sheets} setSheets={setSheets}
                                  />} 
            />
          <Route path='*' element={<NotFoundPage />} />

        </Routes>
      </div>
    </BrowserRouter>
  );
}