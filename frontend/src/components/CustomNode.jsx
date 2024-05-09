import { Handle, Position } from 'reactflow';


export default function CustomNode({ data }) {

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