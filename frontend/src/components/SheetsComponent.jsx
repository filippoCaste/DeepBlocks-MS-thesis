'use strict';

import { useEffect } from "react";
import { NodePlus, XCircle } from "react-bootstrap-icons";
import { useReactFlow } from "reactflow";

export default function SheetsComponent(props) {

    const nodes = props.nodes;
    const reactflow = useReactFlow();
    const selectedSheet = props.selectedSheet;
    const setSelectedSheet = props.setSelectedSheet;
    const sheets = props.sheets;
    const setSheets = props.setSheets;

    const handleCloseSheet = (id, label) => {
        // handleOpenSheet('main', 'main');
        setSelectedSheet(['main', 'main'])
        let n = nodes.find(e => e.id == id);
        n.data.openInfo = false;
        n.data.hasSheet = false;
        n.data.isOpenInSheet = false;
        reactflow.setNodes([...nodes]);

        setSheets((oldSheets) => { return [...oldSheets.filter(([eId]) => eId != id)]});
    }

    const handleOpenSheet = (id, label) => {
        // hide all the other nodes, show just the children of the supernodes

        // if already opened, return
        // if(label === selectedSheet[1]) return
        
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

            for(let n of nodes) {
                n.hidden =  true;
                if(n.type === 'superBlockNode') {
                    n.data.isOpenInSheet = false;
                }
            }

            for(let childId of node.children){
                nodes.find(e => e.id === childId).hidden = false;
            }

            node.data.isOpenInSheet = true;
            node.data.hasSheet = true;
        }
        // setSelectedSheet([id, label]);
        reactflow.setNodes([...nodes]);
    }

    useEffect(() => {
        handleOpenSheet(selectedSheet[0], selectedSheet[1])
    }, [selectedSheet])

    return (
        <div className='sheets'>
            {/* <Sheet key='main' label='main' handleOpenSheet={handleOpenSheet} selectedSheet={selectedSheet} /> */}
            {sheets.map((e) => <Sheet key={e[0]} id={e[0]} label={e[1]} handleOpenSheet={handleOpenSheet} handleCloseSheet={handleCloseSheet} selectedSheet={selectedSheet} setSelectedSheet={setSelectedSheet}/>)}
            {/* {superNodes.map(e => <Sheet key={e.id} node={e} label={e.data.label} handleOpenSheet={handleOpenSheet} selectedSheet={selectedSheet} />)} */}
        </div>
    );
}

function Sheet(props) {

    const setSelectedSheet = props.setSelectedSheet;
    const handleCloseSheet = props.handleCloseSheet;

    return (
        <div className={`sheet ${props.label === props.selectedSheet[1] ? 'selectedSheet' : ''}`}>
            <div style={{ width: '100%', height: '100%', paddingLeft: '1em', paddingRight: '1em' }} onClick={() => setSelectedSheet([props.id, props.label])}>
                <p>{props.label !== 'main' && <NodePlus style={{fontSize:'1em'}} />} {props.label}</p>
            </div>
            {
                props.label !== 'main' && <div style={{paddingRight: '1em'}}>
                    <XCircle style={{
                        padding: '0',
                        verticalAlign: 'middle',
                        height: '100%',
                        justifyContent: 'flex-end',
                        zIndex: '1000',
                    }} onClick={() => handleCloseSheet(props.id, props.label)} />
                    </div>
            }
        </div>

    )
}