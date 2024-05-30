import { Handle, Position } from "reactflow";

export function InvisibleOutputNode(props) {
    const data = props.data
    const id = props.id

    return (
        <>
            <div style={{ display: 'flex' }}>
                <div className='invisible-node'>
                    <Handle type="target" position={Position.Left} />
                </div>
            </div>
        </>
    );

}