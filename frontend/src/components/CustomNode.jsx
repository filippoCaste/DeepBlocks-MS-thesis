import { Handle, Position } from 'reactflow';
import { useState } from 'react';

export default function CustomNode({ data }) {

    const [openOptions, setOpenOptions] = useState(false);
    
    return (
        <> {openOptions && <NodeOptions />}
            <div onContextMenu={(e) => {e.preventDefault(); setOpenOptions(true)}}>
                <Handle type="target" position={Position.Left} />
                <div className="node">
                    <label htmlFor="text">{data.label || "noName"}</label>
                </div>
                <Handle type="source" position={Position.Right} id="a" />
            </div>
        </>
    );
}

function NodeOptions() {
    return (
        <ul>
            <li>Select</li>
            <li>Delete</li>
            <li>Rename</li>
        </ul>
    )
}