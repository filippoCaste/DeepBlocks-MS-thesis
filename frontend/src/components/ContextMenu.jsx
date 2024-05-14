'use strict';

import { useReactFlow } from "reactflow";

export default function NodeOptions({ setOpenOptions, setRename, setSelected, nodeId }) {

    const reactflow = useReactFlow();

    const handleMenuClick = (type) => {
        if (type === 'select') {
            console.log('select');
        } else if (type === 'rename') {
            setRename(true)
        } else if (type === 'delete') {
            let nodes = reactflow.getNodes().filter(node => node.id !== nodeId);
            reactflow.setNodes(nodes);
        }
        setOpenOptions(false)
    }

    return (
        <div
            className="context-menu"
            style={{ position: 'absolute', zIndex: 1000 }}
        >
            <p onClick={() => handleMenuClick('select')}>Select</p>
            <p onClick={() => handleMenuClick('rename')}>Rename</p>
            <p onClick={() => handleMenuClick('delete')}>Delete</p>
        </div>
    )
}
