'use strict';
import ReactFlow, { Controls, Background } from 'reactflow';

import 'reactflow/dist/style.css';


const initialNodes = [
    { id: '1', position: { x: 10, y: 0 }, data: { label: '1' } },
    { id: '2', position: { x: 10, y: 100 }, data: { label: '2' } },
];
const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];

export default function MainContent() {

    return(
        <div style={{ height: '100vh', width: '105.5rem'}}>
            <ReactFlow 
                nodes={initialNodes} 
                edges={initialEdges} 
                fitView                
            >
                <Controls position='bottom-right' />
                <Background />
            </ReactFlow>
        </div>
    )
}