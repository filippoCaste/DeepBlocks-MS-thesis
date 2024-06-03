'use strict';

import { useState } from "react";
import { NodePlus, XCircle } from "react-bootstrap-icons";
import { useReactFlow } from "reactflow";

export default function SheetsComponent(props) {

    const nodes = props.nodes;
    const reactflow = useReactFlow();
    const createdSheet = props.createdSheet;
    const setCreatedSheet = props.setCreatedSheet;
    const selectedSheet = props.selectedSheet;
    const setSelectedSheet = props.setSelectedSheet;
    const [sheets, setSheets] = useState([['main', 'main']])

    const handleCloseSheet = (id, label) => {
        setCreatedSheet(null);

        handleOpenSheet('main', 'main');
        nodes.find(e => e.id == id).data.openInfo = false;
        reactflow.setNodes([...nodes]);

        setSheets((oldSheets) => { return [...oldSheets.filter(([eId]) => eId != id)]});
        // console.log(sheets)
    }

    const handleOpenSheet = (id, label) => {
        // hide all the other nodes, show just the children of the supernodes

        // if already opened, return
        if(label === selectedSheet[1]) return
        
        if(label === 'main') {
            let childIds = [];
            for(let node of nodes) {
                node.hidden = false;
                if(node.type === 'superBlockNode') {
                    childIds = [...childIds, ...node.children]
                    node.data.isOpenInSheet = false;
                }
            }

            for(let node of nodes) {
                if(childIds.includes(node.id)) {
                    node.hidden = true;
                }
            }

        } else {
            const node = nodes.find(e => e.id == id);

            for(let node of nodes) {
                node.hidden =  true;
            }

            for(let childId of node.children){
                nodes.find(e => e.id === childId).hidden = false;
            }

            node.data.isOpenInSheet = true;
        }
        setSelectedSheet([id, label]);
        reactflow.setNodes([...nodes]);
    }

    if (createdSheet && sheets.filter(e => e[0] === createdSheet[0]).length === 0) {
        handleOpenSheet(createdSheet[0], createdSheet[1])
        setSheets((oldSheets) => [...oldSheets, createdSheet]);
    }


    return (
        <div className='sheets'>
            {/* <Sheet key='main' label='main' handleOpenSheet={handleOpenSheet} selectedSheet={selectedSheet} /> */}
            {sheets.map((e) => <Sheet key={e[0]} id={e[0]} label={e[1]} handleOpenSheet={handleOpenSheet} handleCloseSheet={handleCloseSheet} selectedSheet={selectedSheet} />)}
            {/* {superNodes.map(e => <Sheet key={e.id} node={e} label={e.data.label} handleOpenSheet={handleOpenSheet} selectedSheet={selectedSheet} />)} */}
        </div>
    );
}

function Sheet(props) {

    const handleOpenSheet = props.handleOpenSheet;
    const handleCloseSheet = props.handleCloseSheet;

    return (
        <div className={`sheet ${props.label === props.selectedSheet[1] ? 'selectedSheet' : ''}`} onClick={() => handleOpenSheet(props.id, props.label)}>
            <p>{props.label !== 'main' && <NodePlus style={{fontSize:'1em'}} />} {props.label}</p>
            {props.label !== 'main' && <XCircle style={{
                padding: '0',
                border: 'none',
                verticalAlign: 'middle',
                height: '100%',
                justifyContent: 'flex-end'
            }} onClick={() => handleCloseSheet(props.id, props.label)} />}
        </div>
    )
}