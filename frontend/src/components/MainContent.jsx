'use strict';
import ReactFlow, { Controls, Background, addEdge, useReactFlow } from 'reactflow';

import 'reactflow/dist/style.css';
import { useCallback, useEffect, useState } from 'react';
import Superblock from '../models/SuperBlock';
import SelectionBox from './SelectionBox';
import ResponseMessage from './ResponseMessage';
import SheetsComponent from './SheetsComponent';

export default function MainContent({nodes, edges, setEdges, setNodes, onNodesChange, onEdgesChange, nodeTypes}) {

    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)),
        [setEdges],
    );

    const createSuperblock = (listOfNodes) => {
        const children = listOfNodes.map(e => e.id)
        const superblock = new Superblock('superBlockNode', { x: 10, y: 10 }, { label: 'sb1', isSelected: false }, children)
       setNodes(nodes.map(e => children.includes(e.id) ? {...e, data: {...e.data, isSelected: false}, hidden: true} : e).concat(superblock));
    }

    const [selectedNodes, setSelectedNodes] = useState([]);
    const [message, setMessage] = useState('');
    const [variant, setVariant] = useState('');
    const [showMessage, setShowMessage] = useState(false);

    useEffect(() => {
        setSelectedNodes(nodes.filter(node => node.data.isSelected === true))
    }, [nodes])

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

                {selectedNodes.length !==0 &&  <SelectionBox selectedNodes={selectedNodes} createSuperblock={createSuperblock} setMessage={setMessage} setVariant={setVariant} setShowMessage={setShowMessage} /> }
                {showMessage && <ResponseMessage message={message} variant={variant} setShowMesssage={setShowMessage} /> }
                <SheetsComponent nodes={nodes} edges={edges} />

            </ReactFlow>
        </div>
    )
}