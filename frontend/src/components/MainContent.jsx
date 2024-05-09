'use strict';
import ReactFlow, { Controls, Background, useNodesState, useEdgesState } from 'reactflow';

import 'reactflow/dist/style.css';
import CustomNode from './CustomNode';
import { useCallback } from 'react';


const initialNodes = [
    { id: '1', type: 'customNode', position: { x: 10, y: 0 }, data: { label: '1' } },
    { id: '2', type: 'customNode', position: { x: 10, y: 100 }, data: { label: '2' } },
];
const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];
const nodeTypes = { customNode: CustomNode };


export default function MainContent() {

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)),
        [setEdges],
    );

    return(
        <div style={{ height: '100vh', width: '105.5rem'}}>
            <ReactFlow 
                nodes={nodes} 
                edges={edges}
                nodeTypes={nodeTypes}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView                
            >
                <Controls position='bottom-right' />
                <Background />
            </ReactFlow>
        </div>
    )
}