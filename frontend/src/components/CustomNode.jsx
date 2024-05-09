import { useCallback } from 'react';
import { Handle, Position } from 'reactflow';

const handleStyle = { left: 10 };

export default function CustomNode({ data }) {
    const onChange = useCallback((evt) => {
        console.log(evt.target.value);
    }, []);

    return (
        <>
            <Handle type="target" position={Position.Left} />
            <div className="node">
                <label htmlFor="text">{data.name || "noName"}</label>
            </div>
            <Handle type="source" position={Position.Right} id="a" />
        </>
    );
}