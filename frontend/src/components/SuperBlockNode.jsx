import { Handle, Position } from 'reactflow';
import { useState } from 'react';
import NodeOptions from './ContextMenu';
import Button from 'react-bootstrap/Button';

export default function SuperBlockNode(props) {

    const data = props.data;
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
        data.hasSheet = false;
    }

    return (
        <> 
            {openOptions && <NodeOptions setOpenOptions={setOpenOptions} setRename={setRename} nodeInfo={props} />}
            
            <div className={`node ${data.isSelected ? "selected" : ""}`} 
                onContextMenu={handleContextMenu}
                onClick={() => rename===false && handleOpenInfo()}
                style={{
                    background: 'linear-gradient(217deg, rgba(255,0,0,.8), rgba(255,0,0,0) 70.71%), linear-gradient(127deg, rgba(0,255,0,.8), rgba(0,255,0,0) 70.71%), linear-gradient(336deg, rgba(0,0,255,.8), rgba(0,0,255,0) 70.71%)', color: 'black' }}
                >
                <Handle type="target" position={Position.Left} style={{ height: '0.7rem', width: '0.7rem' }} />
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
                <Handle type="source" position={Position.Right} id="a" style={{ height: '0.7rem', width: '0.7rem' }} />
                {/* {(hovering || selected) && <input style={{ flex: 1, marginLeft: 10 }} type="checkbox" onChange={() => { setSelected(!selected); data.isSelected = !selected; }} />} */}

            </div>
        </>
    );
}

