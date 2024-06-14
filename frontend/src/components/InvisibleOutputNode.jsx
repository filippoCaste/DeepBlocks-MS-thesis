import { Handle, Position } from "reactflow";

export function InvisibleOutputNode(props) {

    return (
        <>
            <div style={{ display: 'flex' }}>
                <div className='invisible-node'>
                    OUTPUT
                    <Handle type="target" position={Position.Left} />
                </div>
            </div>
        </>
    );

}
