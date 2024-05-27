'use strict';
import ReactFlow, { Controls, Background, addEdge } from 'reactflow';

import 'reactflow/dist/style.css';
import { useCallback, useEffect, useState } from 'react';
import Superblock from '../models/SuperBlock';
import SelectionBox from './SelectionBox';
import ResponseMessage from './ResponseMessage';
import SheetsComponent from './SheetsComponent';
import NodeInfoBar from './NodeInfoBar';
import AppNameBar from './AppNameBar';

export default function MainContent({ nodes, edges, setEdges, setNodes, onNodesChange, onEdgesChange, nodeTypes, appName, setAppName, handleDeleteNodes }) {

    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)),
        [setEdges],
    );

    const createSuperblock = (listOfNodes) => {
        const children = listOfNodes.map(e => e.id)
        const superblock = new Superblock('superBlockNode', { x: 10, y: 10 }, { label: 'new superblock', isSelected: false }, children)
       setNodes(nodes.map(e => children.includes(e.id) ? {...e, data: {...e.data, isSelected: false}, hidden: true} : e).concat(superblock));
    }

    const [selectedNodes, setSelectedNodes] = useState([]);
    const [message, setMessage] = useState('');
    const [variant, setVariant] = useState('');
    const [showMessage, setShowMessage] = useState(false);
    const [openNodeInfo, setOpenNodeInfo] = useState(false);
    const [nodeInfo, setNodeInfo] = useState(null);
    const [selectedSheet, setSelectedSheet] = useState('main');


    useEffect(() => {
        setSelectedNodes(nodes.filter(node => node.data.isSelected === true))
        const tmp = nodes.filter(node => node.data.openInfo === true)
        if(tmp.length > 0) {
            setOpenNodeInfo(true)
            setNodeInfo(tmp[0])
        }

    }, [nodes])

    const handleCloseNodeInfo = () => {
        setOpenNodeInfo(false);
        nodeInfo.data.openInfo = false;
        setNodeInfo(null);
    }

    const handleDelete = (toDeleteNodes) => {
        handleDeleteNodes(toDeleteNodes)
    }

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

                <div className={`${selectedSheet !== 'main' ? 'sheet-border' : ''}`}></div>

                {selectedNodes.length !==0 &&  <SelectionBox selectedNodes={selectedNodes} createSuperblock={createSuperblock} 
                                                    setMessage={setMessage} setVariant={setVariant} setShowMessage={setShowMessage} 
                                                    handleDeleteNodes={handleDelete}    
                                                /> }
                {showMessage && <ResponseMessage message={message} variant={variant} setShowMessage={setShowMessage} /> }
                {openNodeInfo && <NodeInfoBar nodeInfo={nodeInfo} handleCloseNodeInfo={handleCloseNodeInfo} /> }

                <AppNameBar appName={appName} setAppName={setAppName} />
                <SheetsComponent nodes={nodes} edges={edges} selectedSheet={selectedSheet} setSelectedSheet={setSelectedSheet} />

            </ReactFlow>
        </div>
    )
}
