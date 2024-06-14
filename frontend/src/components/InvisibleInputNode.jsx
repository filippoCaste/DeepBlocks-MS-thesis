import { Handle, Position } from 'reactflow';

export default function InvisibleInputNode(props) {

    return (
        <>
            <div style={{ display: 'flex' }}>
                <div className='invisible-node'>
                    INPUT
                    <Handle type="source" position={Position.Right} id="a" />
                </div>
            </div>
        </>
    );
}
