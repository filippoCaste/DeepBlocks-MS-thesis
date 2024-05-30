import { Handle, Position } from 'reactflow';
import { useState } from 'react';
import NodeOptions from './ContextMenu';
import Button from 'react-bootstrap/Button';

export default function SuperBlockNode(props) {

    const data = props.data;
    const id = props.id;
    const type = props.type;
    const [openOptions, setOpenOptions] = useState(false);
    const [rename, setRename] = useState(false);
    const [inputValue, setInputValue] = useState(data.label);


    const handleRename = () => {
        data.label = inputValue;
        setRename(false)
    }

    const handleOpenInfo = () => {
        data.openInfo = true;
    }

    return (
        <> 
            {openOptions && <NodeOptions setOpenOptions={setOpenOptions} setRename={setRename} nodeInfo={props} />}
            
            <div className={`node ${data.isSelected ? "selected" : ""}`} 
                // onMouseOver={() => setHovering(true)} 
                // onMouseLeave={() => setHovering(false)} 
                onContextMenu={(e) => { e.preventDefault(); setOpenOptions(true)}}
                onClick={() => handleOpenInfo()}
                style={{ backgroundImage: 'linear-gradient(red,yellow,green)', color: 'black' }}
                >
                <Handle type="target" position={Position.Left} />
                <div>
                    {rename ? 
                        <span>
                            <input
                                value={inputValue}
                                onChange={(ev) => setInputValue(ev.target.value)}
                            />
                            <Button variant="secondary" size='sm' id="button-addon2" onClick={() => handleRename()}>
                                OK
                            </Button>
                        </span>
                        : <p>{data.label || "sb"}</p>}
                </div>
                <Handle type="source" position={Position.Right} id="a" />
                {/* {(hovering || selected) && <input style={{ flex: 1, marginLeft: 10 }} type="checkbox" onChange={() => { setSelected(!selected); data.isSelected = !selected; }} />} */}

            </div>
        </>
    );
}

