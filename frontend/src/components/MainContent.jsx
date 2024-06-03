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
import InvisibleBlock from '../models/InvisibleBlock';

export default function MainContent({ nodes, edges, setEdges, setNodes, onNodesChange, onEdgesChange, onNodesDelete, nodeTypes, appName, setAppName, handleDeleteNodes, handleAddNode, sheets, setSheets }) {

    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)),
        [setEdges],
    );

    /**
     * Creates a superblock and adds input and output invisible edges to it.
     *
     * @param {Array} listOfNodes - The list of nodes to be included in the superblock.
     * @return {void} This function does not return a value.
     */
    const createSuperblock = (listOfNodes) => {
        const children = listOfNodes.map(e => e.id)

       // add input and output invisible edges
        const internalEdges = edges.filter(e => children.includes(e.source) || children.includes(e.target))
        let inp;
        let out;
       // case 1: already existing internal edges
        if (internalEdges.length > 0) {
            let possibleInputs = [...children]
            let possibleOutputs = [...children]
            for(let edge of internalEdges) {
                // if the edge is a source, then remove from possible input (since the input has no source coming from inside the superblock)
                possibleInputs = possibleInputs.filter(e => e != edge.target)
                // if the edge is a target, then remove from possible output (since the output has no target coming from inside the superblock)
                possibleOutputs = possibleOutputs.filter(e => e != edge.source)
            }

            if(possibleInputs.length > 0) {
                inp = possibleInputs[0];
            } else {
                inp = children[0];
            }

            if(possibleOutputs.length > 0) {
                out = possibleOutputs[0];
            } else {
                out = children[-1];
            }

        } else {
            
           // case 2: no existing edges (just nodes)
           // input edge with one random node (possibly the first children)
            inp = children[0];
            // output edge with one random node (possibly the last children)
            out = children[-1];
        }

        // create a new edge between the first possible input and the first possible output
        const superblock = new Superblock('superBlockNode', { x: 10, y: 10 }, { label: 'new superblock', isSelected: false }, children)

        const invisibleInput = new InvisibleBlock(superblock.id + 'i', 'invisibleInputNode', { x: 2, y: 100 })
        const invisibleOutput = new InvisibleBlock(superblock.id + 'o', 'invisibleOutputNode', { x: 300, y: 100 })
        superblock.children.push(invisibleInput.id, invisibleOutput.id)

        setEdges(eds => addEdge({ id: `e${superblock.id + '_i'}`, source: invisibleInput.id, target: inp }, eds))
        setEdges(eds => addEdge({ id: `e${superblock.id + '_o'}`, source: out, target: invisibleOutput.id }, eds))

        setNodes(nodes.map(e => children.includes(e.id) ? { ...e, data: { ...e.data, isSelected: false }, hidden: true } : e).concat(superblock));
        setNodes(prevNodes => [...prevNodes, ...invisibleInput, ...invisibleOutput])

    }

    const [selectedNodes, setSelectedNodes] = useState([]);
    const [message, setMessage] = useState('');
    const [variant, setVariant] = useState('');
    const [showMessage, setShowMessage] = useState(false);
    const [openNodeInfo, setOpenNodeInfo] = useState(false);
    const [nodeInfo, setNodeInfo] = useState(null);
    const [selectedSheet, setSelectedSheet] = useState(['main', 'main']);

    useEffect(() => {
        // get selected nodes
        setSelectedNodes(nodes.filter(node => node.data.isSelected === true));

        // check if there is an open info node
        const tmp = nodes.filter(node => node.data.openInfo === true && (node.type === 'customNode' || (node.type === 'superBlockNode' && node.data.hasSheet === false)))
        if (tmp.length > 0) {
            let nodeFound = tmp[0]
            if (nodeFound.type == 'customNode') {
                setOpenNodeInfo(true)
                setNodeInfo(nodeFound)
            } else if (nodeFound.type == 'superBlockNode') {
                if(sheets.filter(e => e[0] == nodeFound.id).length === 0) {
                    setSheets((oldSheets) => [...oldSheets, [nodeFound.id, nodeFound.data.label]]);
                }
            }
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
                onNodesDelete={onNodesDelete}
                onConnect={onConnect}
                fitView
            >
                <Controls position='bottom-right' />
                <Background />

                <div className={`${selectedSheet[1] !== 'main' ? 'sheet-border' : ''}`}></div>

                {selectedNodes.length !==0 &&  <SelectionBox selectedNodes={selectedNodes} createSuperblock={createSuperblock} 
                                                    setMessage={setMessage} setVariant={setVariant} setShowMessage={setShowMessage} 
                                                    handleDeleteNodes={handleDelete} nodes={nodes} setNodes={setNodes}
                                                /> }
                {showMessage && <ResponseMessage message={message} variant={variant} setShowMessage={setShowMessage} /> }
                {openNodeInfo && <NodeInfoBar nodeInfo={nodeInfo} handleCloseNodeInfo={handleCloseNodeInfo} /> }

                <AppNameBar appName={appName} setAppName={setAppName} />
                <SheetsComponent nodes={nodes} selectedSheet={selectedSheet} setSelectedSheet={setSelectedSheet} 
                                    sheets={sheets} setSheets={setSheets}
                    />

            </ReactFlow>
        </div>
    )
}
