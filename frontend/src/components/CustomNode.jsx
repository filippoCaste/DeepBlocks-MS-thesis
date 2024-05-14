import { Handle, Position } from 'reactflow';
import { useState } from 'react';
import NodeOptions from './ContextMenu';
import { Form, InputGroup } from 'react-bootstrap';

export default function CustomNode(props) {

    const data = props.data
    const id = props.id
    const [openOptions, setOpenOptions] = useState(false);
    const [selected, setSelected] = useState(false);
    const [rename, setRename] = useState(false)
    const [inputValue, setInputValue] = useState(data.label)

    const handleRename = () => {
        data.label = inputValue;
        setRename(false)
    }
    
    return (
        <> {openOptions && <NodeOptions setOpenOptions={setOpenOptions} setRename={setRename} setSelected={setSelected} nodeId={id} />}
            <div onContextMenu={(e) => {e.preventDefault(); setOpenOptions(true)}}>
                <Handle type="target" position={Position.Left} />
                <div className="node">
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
            </div>
        </>
    );
}
