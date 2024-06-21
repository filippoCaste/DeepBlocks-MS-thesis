'use strict';

import { useReactFlow } from "reactflow";

export default function NodeOptions({ setOpenOptions, setRename, nodeInfo }) {

    const reactflow = useReactFlow();
    const nodeId = nodeInfo.id;

    const handleMenuClick = (type) => {
        if (type === 'select') {
            reactflow.getNode(nodeId).data.isSelected = true;
        } else if (type === 'rename') {
            setRename(true)
        } 
        // else if (type === 'delete') {
        //     let nodes = reactflow.getNodes().filter(node => node.id !== nodeId);
        //     let edges = reactflow.getEdges().filter(edge => !edge.source.includes(nodeId) && !edge.target.includes(nodeId));
        //     reactflow.setEdges(edges);
        //     reactflow.setNodes(nodes);
        // }
        setOpenOptions(false)
    }

    return (
        <div
            className="context-menu"
            style={{ position: 'absolute', zIndex: 1000 }}
        >
            <p onClick={() => handleMenuClick('select')}>Select</p>
            {(nodeInfo.data.label === 'Input Dataset (from huggingface.co)' || nodeInfo.type == 'superBlockNode') ? '' : <p onClick={() => handleMenuClick('rename')}>Rename</p>}
            {/* <p onClick={() => handleMenuClick('delete')}>Delete</p> */}

        </div>
    )
}
