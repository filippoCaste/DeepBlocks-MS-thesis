'use strict';
import React from 'react';
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

  const handleAddNode = (node) => {
    // check if there is a supernode which is opened in a sheet
    const superBlockOpened = nodes.find(e => e.data.isOpenInSheet === true);
    if(superBlockOpened) {
      superBlockOpened.children.push(node.id);
    }
    setNodes((prevNodes) => [...prevNodes, node]);
  }

  const handleDeleteNode = (node) => {
    let updatedNodes=[];
    if(node.type === 'superBlockNode') {
      const nodeChildren = nodes.find(e => e.id === node.id).children;
      // delete the children
      nodes.filter(n => !nodeChildren.includes(n.id));
      // delete the supernode
      updatedNodes = nodes.filter(n => n.id != node.id);

    } else {
      updatedNodes = nodes.filter(n => n.id != node.id);
    }

    setNodes(() => updatedNodes);
  }

  const handleRenameNode = (node, newName) => {
    const nodeToRename = nodes.find(e => e.id === node.id);
    nodeToRename.data.label = newName;
    const updatedNodes = nodes.map(n => n.id === node.id ? nodeToRename : n)
    setNodes(() => updatedNodes)
  }

  const handleDuplicateNode = (node) => {
    let copy = {};
    if (node.type === 'superBlockNode') {
      copy = new Superblock(node.type, { ...node.position, y: node.position.y - 10 }, { ...node.data, label: node.data.label + " copy" }, []);
    } else {
      copy = new Block(node.type, {...node.position, y: node.position.y-10}, {...node.data, label: node.data.label+" copy"}, node.parameters);
    }
    setNodes((prevNodes) => [...prevNodes, copy])
  }
  return (
    <BrowserRouter>
      <div className='app-container' style={{ display: 'flex' }}>
        <Sidebar nodes={nodes} setNodes={setNodes} handleAddNode={handleAddNode} 
            handleDeleteNode={handleDeleteNode} handleRenameNode={handleRenameNode} handleDuplicateNode={handleDuplicateNode}
          />
        <Routes>
          <Route index element={<MainContent style={{ flex: 1 }} edges={edges} setNodes={setNodes} setEdges={setEdges}
                                      nodeTypes={nodeTypes} nodes={nodes} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}
                                  />} 
            />
          <Route path='*' element={<NotFoundPage />} />

        </Routes>
      </div>
    </BrowserRouter>
  );
}