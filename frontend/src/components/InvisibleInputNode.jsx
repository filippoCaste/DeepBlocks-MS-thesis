import { Handle, Position } from 'reactflow';

export default function InvisibleInputNode(props) {

    const data = props.data
    const id = props.id

    return (
        <>
            <div style={{ display: 'flex' }}>
                <div className='invisible-node'>
                    <Handle type="source" position={Position.Right} id="a" />
                </div>
            </div>
        </>
    );
}
