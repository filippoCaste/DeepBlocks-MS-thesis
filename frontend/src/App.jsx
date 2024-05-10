import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import MainContent from './components/MainContent';
import CustomNode from './components/CustomNode';



const initialNodes = [
  { id: '1', type: 'customNode', position: { x: 10, y: 0 }, data: { label: 'ReLU' } },
  { id: '2', type: 'customNode', position: { x: 10, y: 100 }, data: { label: 'Softmax' } },
];
const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];
const nodeTypes = { customNode: CustomNode };


export default function App() {
  const [nodes, setNodes] = useState(initialNodes);

  return (
    <div className='app-container' style={{ display: 'flex' }}>
      <Sidebar nodes={nodes}/>
      <MainContent style={{ flex:1 }} initialNodes={initialNodes} initialEdges={initialEdges} nodeTypes={nodeTypes} nodes={nodes} setNodes={setNodes}/>
    </div>
  );
}