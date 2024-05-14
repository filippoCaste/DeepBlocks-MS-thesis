import { Handle, Position, useReactFlow } from 'reactflow';
import { useState } from 'react';
import NodeOptions from './ContextMenu';
import { Button, Form, InputGroup } from 'react-bootstrap';

export default function CustomNode(props) {

    const data = props.data
    const id = props.id
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
            <div className={`node ${data.isSelected ? "selected" : ""}`} onMouseOver={() => setHovering(true)} onMouseLeave={() => setHovering(false)} onContextMenu={(e) => {e.preventDefault(); setOpenOptions(true)}}>
                <Handle type="target" position={Position.Left} />
                <div>
                    {rename ?
                        <InputGroup>
                            <Form.Control
                                aria-label="Recipient's username"
                                aria-describedby="basic-addon2"
                                value={inputValue}
                                onChange={(ev) => setInputValue(ev.target.value)}
                            />
                            <Button variant="secondary" id="button-addon2" onClick={() => handleRename()}>
                                Confirm
                            </Button>
                        </InputGroup>
                        : <p>{data.label || "block"}</p>}
                </div>
                <Handle type="source" position={Position.Right} id="a" />
                {(hovering || selected) && <input style={{flex: 1, marginLeft: 10}} type="checkbox" onChange={() => {setSelected(!selected); data.isSelected=!selected;}} />}

            </div>
        </>
    );
}
