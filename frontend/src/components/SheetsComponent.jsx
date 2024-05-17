'use strict';

import Container from "react-bootstrap/Container";
import { useReactFlow } from "reactflow";

export default function SheetsComponent(props) {

    const nodes = props.nodes;
    const superNodes = props.nodes.filter(e=> e.type==='superBlockNode');
    const edges = props.edges;
    const reactflow = useReactFlow();
    const selectedSheet = props.selectedSheet;
    const setSelectedSheet = props.setSelectedSheet;

    const handleOpenSheet = (label, node) => {
        // hide all the other nodes, show just the children of the supernodes
        
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
            for(let node of nodes) {
                node.hidden =  true;
            }

            for(let childId of node.children){
                nodes.find(e => e.id === childId).hidden = false;
            }
        }
        if(label!=='main') node.data.isOpenInSheet = true;
        setSelectedSheet(label)
        reactflow.setNodes(nodes);
    }

    return (
        <div className='sheets'>
            <Sheet key='main' label='main' handleOpenSheet={handleOpenSheet} selectedSheet={selectedSheet} />
            {superNodes.map(e => <Sheet key={e.id} node={e} label={e.data.label} handleOpenSheet={handleOpenSheet} selectedSheet={selectedSheet} />)}
        </div>
    );
}

function Sheet(props) {

    const handleOpenSheet = props.handleOpenSheet;

    return (
        <Container className={`sheet ${props.label === props.selectedSheet ? 'selectedSheet' : ''}`} onClick={() => handleOpenSheet(props.label, props.node)}>
            <p>{props.label}</p>
        </Container>
    )
}