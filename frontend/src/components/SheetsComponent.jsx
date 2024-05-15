'use strict';

import { Container } from "react-bootstrap";
import { useReactFlow } from "reactflow";

export default function SheetsComponent(props) {

    const nodes = props.nodes;
    const superNodes = props.nodes.filter(e=> e.type==='superBlockNode');
    const edges = props.edges;
    const reactflow = useReactFlow();

    const openSheet = (label, node) => {
        // hide all the other nodes, show just the children of the supernodes
        let childIds = []
        if(label === 'main') {
            for(let node of nodes) {
                node.hidden = false;
                if(node.type === 'superBlockNode') {
                    childIds = [...childIds, ...node.children]
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

        reactflow.setNodes(nodes);
    }

    return (
        <div className='sheets'>
            <Sheet key='main' label='main' openSheet={openSheet} />
            {superNodes.map(e => <Sheet key={e.id} node={e} label={e.data.label} openSheet={openSheet} />)}
        </div>
    );
}

function Sheet(props) {

    const openSheet = props.openSheet;

    return (
        <Container className="sheet" onClick={() => openSheet(props.label, props.node)}>
            <p>{props.label}</p>
        </Container>
    )
}