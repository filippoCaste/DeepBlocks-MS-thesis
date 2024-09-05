import { Handle, Position } from 'reactflow';
import { useState } from 'react';
import NodeOptions from './ContextMenu';
import Button from 'react-bootstrap/Button';

export default function CustomNode(props) {

    const data = props.data
    const id = props.id
    const [openOptions, setOpenOptions] = useState(false);
    const [rename, setRename] = useState(false);
    const [inputValue, setInputValue] = useState(data.label);

    const handleContextMenu = (e) => {
        e.preventDefault();
        setOpenOptions(true);

        const closeContextMenu = () => {
            setOpenOptions(false);
            document.removeEventListener('click', closeContextMenu);
        };
        document.addEventListener('click', closeContextMenu);
    };

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
            
            <div style={{ display: 'flex', zIndex: 1 }}>
                <div className={`node ${data.isSelected ? "selected" : ""} ${data.category}`} 
                    onContextMenu={handleContextMenu}
                    onClick={() => rename === false && handleOpenInfo()}
                    >
                    {data.label === 'Input Dataset (from huggingface.co)' ? '' : <Handle type="target" position={Position.Left} style={{height: '0.7rem', width: '0.7rem'}} />}
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
                            : <p>{data.label || "block"}</p>}
                    </div>
                    <Handle id='dataset' type="source" position={Position.Right} style={{height: '0.7rem', width: '0.7rem'}} />
                </div>
                {/* {(hovering || selected) && <input style={{ flex: 1, marginLeft: 10 }} type="checkbox" onChange={() => { setSelected(!selected); data.isSelected = !selected; }} />} */}
            </div>
        </>
    );
}
