'use strict';
import React, { useCallback, useEffect, useState, useRef } from 'react';
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
import { BLOCKS_API } from './API/blocks';
import ResponseMessage from './components/ResponseMessage';
import { SESSION_API } from './API/session';
import InvisibleInputNode from './components/InvisibleInputNode';
import { InvisibleOutputNode } from './components/InvisibleOutputNode';
import InvisibleBlock from './models/InvisibleBlock';
import isEqual from 'lodash.isequal';  
import Spinner from 'react-bootstrap/Spinner';
import Welcome from './components/Welcome';

const initialEdges = [];
const initialNodes = [];

const DEBOUNCE_DELAY = 4000; // 4 seconds

export const sessionId = await SESSION_API.getSession();
window.addEventListener('beforeunload', SESSION_API.deleteSession);

const nodeTypes = { customNode: CustomNode, superBlockNode: SuperBlockNode, invisibleInputNode: InvisibleInputNode, invisibleOutputNode: InvisibleOutputNode };

export default function App() {

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // training parameters
  const [learningRate, setLearningRate] = useState(0);
  const [epochs, setEpochs] = useState(0);
  const [batchSize, setBatchSize] = useState(0);
  const [loss, setLoss] = useState('');
  const [customLoss, setCustomLoss] = useState(null);
  const [optimizer, setOptimizer] = useState('');
  // --------------------------------------------------
  const [openMenu, setOpenMenu] = useState('none');
  const [sheets, setSheets] = useState([['main', 'main']])
  const [appName, setAppName] = useState("My DeepBlock's network")

  const [metrics, setMetrics] = useState([]);
  const [nodeParams, setNodeParams] = useState([]);
  const [isTraining, setIsTraining] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [checkingResult, setCheckingResult] = useState(null);
  
  const [messages, setMessages] = useState([]);

  const [errNode, setErrNode] = useState(null);
  const [errSuperBlock, setErrSuperBlock] = useState(null);
  const [errNodeMsg, setErrNodeMsg] = useState(null)

  const [openNodeInfo, setOpenNodeInfo] = useState(false);
  const [nodeInfo, setNodeInfo] = useState(null);


  useEffect(() => {
    if(errNode !== null) {
      setNodes((prevNodes) => prevNodes.map((node) => (node.id === errNode.id ? { ...node, style: {
        ...node.style,
        border: "3px dashed red",
        borderRadius: "2em",
        padding: '5px'
      }} : node)));
      if(errSuperBlock) {
        setNodes((prevNodes) => prevNodes.map((node) => (node.id === errSuperBlock.id ? { ...node, style: {
          ...node.style,
          border: "3px dashed red",
          borderRadius: "2em",
          padding: '5px'
        }} : node)));
      }
    } else {
      setNodes((prevNodes) => prevNodes.map((node) => {return { ...node, style: {
        ...node.style,
        border: "none"
      }}}));
      }
  }, [errNode]);

  const addMessage = (message, variant) => {
    const id = new Date().getTime(); 
    setMessages((prevMessages) => [...prevMessages, { id, message, variant }]);

    // Remove the message after the timeout
    if (variant !== 'danger') {
      setTimeout(() => {
        setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== id));
      }, 10000);
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };

  const debounceTimeoutRef = useRef(null);

  // forwarding api
  useEffect(() => {
    const paramObj = [
      { "key": "learningRate", "value": learningRate },
      { "key": "epochs", "value": epochs },
      { "key": "batchSize", "value": batchSize },
      { "key": "loss", "value": loss },
      { "key": "optimizer", "value": optimizer }
    ]

    const debounceEffect = () => {
      // check if all the conditions are satisfied
      const inputNode = nodes.find(n => n.type === 'customNode' && n.parameters.length>0 && n.parameters[0].name === 'input_dataset')
      if (!isTraining && inputNode && edges.find(e => e.source === inputNode.id)) {
        const isParamsSet = learningRate !== 0 && epochs !== 0 && batchSize !== 0 && loss !== '' && optimizer !== ''
        if(!isParamsSet) {
          addMessage("To run your network, please set all the parameters in the sidebar.", "warning")
          return;
        }
        clearMessages();
        addMessage("Checking your network...", "info")
        setIsChecking(true);
        setNodes((currentNodes) => currentNodes.map(n => n.style?.border !== 'none' ? { ...n, style: { ...n.style, border: "none", padding: '0' } } : n))
        const connectedNodes = nodes.filter(n => edges.find(e => e.target==n.id || e.source==n.id))
        BLOCKS_API.forwardBlock(connectedNodes, edges, paramObj).then(() => {
          setIsChecking(false);
          setErrNode(null)
          setErrSuperBlock(null)
          setErrNodeMsg(null)
          setCheckingResult(true);
          addMessage("Check completed! You are good to go.", "success")
        }).catch(err => {
          setCheckingResult(false)
          setIsChecking(false);
          // console.log(err)
          setErrNode(null)
          setErrSuperBlock(null)
          setErrNodeMsg(err.message.split("Error:")[1])
          const errNodeId = err.message.split("ID: ")[1].split(",")[0]
          const errNode = nodes.filter(n => n.id === errNodeId)[0]

          // check if it is contained in a supernode
          let errSn = nodes.filter(n => n.type === 'superBlockNode') // get supernodes
            .filter(sn => sn.children.includes(errNode.id)) // get supernodes that contains the node
          
          errSn && setErrSuperBlock(errSn[0])
          setErrNode(errNode)
          addMessage("There is a problem with the block " + errNode.data.label + ": \n\t" + err.message.split("Error:")[1].replace(/\"/,""), "danger")          
        })
      }
    }
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(debounceEffect, DEBOUNCE_DELAY);

    return () => {
      clearTimeout(debounceTimeoutRef.current);
    };
  }, [edges, nodeParams, learningRate, epochs, batchSize, loss, optimizer])

  useEffect(() => {
    const newNodeParams = nodes.map(n => n.parameters).flat();
    if (!isEqual(newNodeParams, nodeParams))
      setNodeParams(newNodeParams)
  }, [nodes])


  const handleAddNode = (node) => {
    // check if there is a supernode which is opened in a sheet
    const superBlockOpened = nodes.find(e => e.data.isOpenInSheet === true);
    if(superBlockOpened) {
      superBlockOpened.children.push(node.id);
    }
    addMessage("Added node: " + node.data.label, "success")
    setNodes((prevNodes) => [...prevNodes, node]);
  }

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

        if(nodeInfo !== null && nodeInfo.id === node.id) {
          closeNodeParameters();
        }
      }
    }

    setEdges(() => [...updatedEdges]);
    setNodes(() => [...updatedNodes]);
  }

  const handleRenameNode = (node, newName) => {
    const updatedNodes = nodes.map(n => n.id === node.id ? {...n, data: {...n.data, label: newName}} : n)
    setSheets((shs) => [...shs.map(e => e[0] == node.id ? [e[0], newName] : e)])
    setNodes(() => [...updatedNodes])
  }

  const handleDuplicateNode = (node) => {
    let copy = [];
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
        let b = new Block(n.type, { ...n.position }, { ...n.data, label: n.data.label }, n.parameters, n.fn);
        b = {...b, hidden: true};
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
        return {...e, 
          source: e.source.includes('i') ? invisibleInput.id : pairIds.find(p => p[0] == e.source)[1], 
          target: e.target.includes('o') ? invisibleOutput.id : pairIds.find(p => p[0] == e.target)[1]}
      });

      setEdges((prevEdges) => [...prevEdges, ...edgesToCopy])

    } else {
      let newBlock = new Block(node.type, { ...node.position, y: node.position.y - 10 }, { ...node.data, label: "copy of " + node.data.label }, node.parameters, node.fn, node.description);
      
      let superBlockOpened = nodes.find(n => n.data.isOpenInSheet === true);
      if(superBlockOpened) {
        newBlock = {...newBlock, hidden: false, fn: node.fn };
        superBlockOpened.children.push(newBlock.id);
      }

      copy.push(newBlock);

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

        addMessage("Network succesfully downloaded", "success");

      }).catch((error) => {
        addMessage("Error while exporting the network: " + error.message, "danger");
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
            throw new Error('The file is not a valid JSON file');
          }
          // let mapping = [];
          // let childrenIds = [];
          // let newNodes = nodes.map(n => {
          //   if(n.type === 'superBlockNode') {
          //     let b = new Superblock(n.type, n.position, n.data, n.children);
          //     mapping.push([n.id, b.id]);
          //     childrenIds.push(...n.children.map(c => {
          //       if(c == n.id+"i") {
          //         return b.id+"i"
          //     } else if(c == n.id+"o") {
          //         return b.id+"o"
          //     } else {
          //       return c;
          //     }}));
          //     return b;
          //   } else if(n.type === 'invisibleInputNode' || n.type === 'invisibleOutputNode') {
          //     let newId;
          //     for(let m of mapping) {
          //       if(m[0] === n.id) {
          //         newId = m[1];
          //         break;
          //       }
          //     }
          //     let b = new InvisibleBlock(n.id, n.type, n.position);
          //     if(newId) {
          //       b = {...b, id: newId};
          //     } else{
          //       mapping.push([n.id, b.id]);
          //     }
          //     return b;
          //   } else {
          //     let b = new Block(n.type, n.position, n.data, n.parameters, n.fn);
          //     mapping.push([n.id, b.id]);
          //     return b;
          //   }
          // });
          // newNodes = newNodes.map(n => n.type === 'superBlockNode' ? { ...n, children: n.children.map(c => mapping.find(m => m[0] === c)[1]) } : n)
          // childrenIds = childrenIds.map(c => {
          //   for(let m of mapping) {
          //     if(m[0] === c) {
          //       return m[1];
          //     }
          //   }
          //   return c;
          // })
          // newNodes = newNodes.map(n => childrenIds.find(c => c === n.id) ? {...n, hidden: true} : n);

          // const newEdges = edges.map(e => {
          //   let newEdge = {...e };
          //   for(let m of mapping) {
          //     if(m[0] === e.source) {
          //       newEdge = { ...newEdge, source: m[1] }
          //     } else if(m[0] === e.target) {
          //       newEdge = { ...newEdge, target: m[1] }
          //     }
          //   }
            
          //   return newEdge;
          // })
          // setNodes(newNodes);
          // setEdges(newEdges);

          setErrNodeMsg(null);
          setErrNode(null);
          setErrSuperBlock(null);
          setIsChecking(false);
          setCheckingResult(null);

          setNodes(nodes);
          setEdges(edges);
          let maxId = 0;
          for (let nodeId of nodes.map(n => n.id)) {
            if(parseInt(nodeId) > maxId) {
              maxId = parseInt(nodeId);
            }
          }
          Block.updateIdCounter(maxId+1)
          setAppName(inputFile.name);
          setSheets([['main', 'main']]);

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
          addMessage(error.message, "danger");
        }
      };

      reader.onerror = () => {
        addMessage("Error while uploading the file: " + reader.error.message, "danger");
      };

      reader.readAsText(inputFile);
      
      addMessage("Network successfully uploaded", "success");

    }
  }

  function closeNodeParameters() {
    setNodes(n => n.map(n => n.id === nodeInfo?.id ? { ...n, data: { ...n.data, openInfo: false }, style: { ...n.style, filter: 'none' } } : n))
    setNodeInfo(null);
    setOpenNodeInfo(false);
  }

  return (
    <BrowserRouter>
      <div className='app-container' style={{ display: 'flex' }}>
        <Sidebar nodes={nodes} edges={edges} setNodes={setNodes} handleAddNode={handleAddNode} 
            handleDeleteNodes={handleDeleteNodes} handleRenameNode={handleRenameNode} handleDuplicateNode={handleDuplicateNode}
            handleDownload={handleDownload} handleUpload={handleUpload} openMenu={openMenu} setOpenMenu={setOpenMenu}
            learningRate={learningRate} epochs={epochs} batchSize={batchSize} loss={loss} optimizer={optimizer} customLoss={customLoss}
            setLearningRate={setLearningRate} setEpochs={setEpochs} setBatchSize={setBatchSize} setLoss={setLoss} setOptimizer={setOptimizer} setCustomLoss={setCustomLoss}
            metrics={metrics} setMetrics={setMetrics} addMessage={addMessage} isTraining={isTraining} setIsTraining={setIsTraining} isChecking={isChecking} errNodeMsg={errNodeMsg}
            setIsChecking={setIsChecking} checkingResult={checkingResult}
          />

        <div style={{ position: 'fixed', top: '7em', right: '1.5em', zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          {messages.map(({ id, message, variant }) => <ResponseMessage key={id} message={message} variant={variant} 
                  setShowMessage={() => setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== id))} />)}
        </div>

        {nodes.length === 0 && <Welcome setOpenMenu={setOpenMenu} />}

        {(isTraining || isChecking) && <div style={{ position: 'fixed', top:'7em', left: '50%', display:'inline'}}> 
          <Spinner animation="border" variant="primary" /> <p style={{ display: 'inline' }}> {isChecking ? 'Checking...' : 'Training...'}  </p>
          </div>}

        <Routes>
          <Route index element={<MainContent style={{ flex: 1 }} edges={edges} setNodes={setNodes} setEdges={setEdges}
                                      nodeTypes={nodeTypes} nodes={nodes} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onNodesDelete={onNodesDelete}
                                      appName={appName} setAppName={setAppName} handleDeleteNodes={handleDeleteNodes}
                                      handleAddNode={handleAddNode} sheets={sheets} setSheets={setSheets} addMessage={addMessage}
                                      isChecking={isChecking} checkingResult={checkingResult} errNode={errNode} errNodeMsg={errNodeMsg}
                                      nodeInfo={nodeInfo} setNodeInfo={setNodeInfo} openNodeInfo={openNodeInfo} setOpenNodeInfo={setOpenNodeInfo}
                                  />} 
            />
          <Route path='*' element={<NotFoundPage />} />

        </Routes>
      </div>
    </BrowserRouter>
  );
}