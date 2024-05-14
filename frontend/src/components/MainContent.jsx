'use strict';
import ReactFlow, { Controls, Background, addEdge } from 'reactflow';

import 'reactflow/dist/style.css';
import { useCallback } from 'react';

export default function MainContent({nodes, edges, setEdges, setNodes, onNodesChange, onEdgesChange, nodeTypes}) {

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