import { Handle, Position } from 'reactflow';
import { useState } from 'react';
import NodeOptions from './ContextMenu';
import { Button, Form, InputGroup } from 'react-bootstrap';

export default function SuperBlockNode(props) {

    const data = props.data;
    const id = props.id;
    const type = props.type;
    const [openOptions, setOpenOptions] = useState(false);
    const [selected, setSelected] = useState(false);
    const [rename, setRename] = useState(false);
    const [inputValue, setInputValue] = useState(data.label);
    const [hovering, setHovering] = useState(false);


    const handleRename = () => {
        data.label = inputValue;
        setRename(false)
    }

    return (
        <> {openOptions && <NodeOptions setOpenOptions={setOpenOptions} setRename={setRename} setSelected={setSelected} nodeInfo={props} />}
            <div className={`node ${data.isSelected ? "selected" : ""}`} onMouseOver={() => setHovering(true)} onMouseLeave={() => setHovering(false)} onContextMenu={(e) => { e.preventDefault(); setOpenOptions(true)}}
                style={{ backgroundImage: 'linear-gradient(red,yellow,green)', color: 'black' }}>
                <Handle type="target" position={Position.Left} />
                <div>
                    {rename ? 
                        <InputGroup>
                            <Form.Control
                                aria-describedby="basic-addon2"
                                value={inputValue}
                                onChange={(ev) => setInputValue(ev.target.value)}
                            />
                            <Button variant="secondary" id="button-addon2" onClick={() => handleRename()}>
                                Confirm
                            </Button>
                        </InputGroup>
                        : <p>{data.label || "sb"}</p>}
                </div>
                <Handle type="source" position={Position.Right} id="a" />
                {(hovering || selected) && <input style={{ flex: 1, marginLeft: 10 }} type="checkbox" onChange={() => { setSelected(!selected); data.isSelected = !selected; }} />}

            </div>
        </>
    );
}

