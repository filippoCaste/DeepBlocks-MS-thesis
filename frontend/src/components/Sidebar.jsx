import Button from 'react-bootstrap/Button';
import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import Download from 'react-bootstrap-icons/dist/icons/download'
import PencilFill from 'react-bootstrap-icons/dist/icons/pencil-fill'
import PlayFill from 'react-bootstrap-icons/dist/icons/play-fill'
import ListColumns from 'react-bootstrap-icons/dist/icons/list-columns'
import BarChartFill from 'react-bootstrap-icons/dist/icons/bar-chart-fill';
import TrashFill from 'react-bootstrap-icons/dist/icons/trash-fill';
import Copy from 'react-bootstrap-icons/dist/icons/copy'
import Blocks from '../../public/data/blocks.json'
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Form from 'react-bootstrap/Form';
import AlertComponent from './AlertComponent';
import Block from '../models/Block';
import { BLOCKS_API } from '../API/blocks';


const Sidebar = (props) => {

    const [openMenu, setOpenMenu] = useState('none');
    const { nodes, edges, handleAddNode, handleDeleteNodes, handleRenameNode, handleDuplicateNode, 
            handleDownload, handleUpload, learningRate, epochs, batchSize, loss, optimizer,
            setLearningRate, setEpochs, setBatchSize, setLoss, setOptimizer } = props;

    return (
        <>
            <div className="sidebar">
                <ul className="sidebar-menu">
                    <li onClick={() => {
                            openMenu === "Network Design" ? setOpenMenu('none') : setOpenMenu('Network Design')
                        }} style={openMenu === 'Network Design' ? { backgroundColor: '#555' } : {}}>
                        <span> <PencilFill className='sidebar-icon' /> </span>
                    </li>
                    <li onClick={() => {
                            openMenu === "Network Details" ? setOpenMenu('none') : setOpenMenu('Network Details')
                        }} style={openMenu === 'Network Details' ? { backgroundColor: '#555' } : {}}>
                        <span> <ListColumns className='sidebar-icon' /> </span>
                    </li>
                    <li onClick={() => {
                            openMenu === "Training" ? setOpenMenu('none') : setOpenMenu('Training')
                        }} style={openMenu === 'Training' ? { backgroundColor: '#555' } : {}}>
                        <span> <PlayFill className='sidebar-icon' /> </span>
                    </li>
                    <li onClick={() => {
                            openMenu === "Options" ? setOpenMenu('none') : setOpenMenu('Options')
                        }} style={openMenu === 'Options' ? { backgroundColor: '#555' } : {}}>
                        <span> <Download className='sidebar-icon' /> </span>
                    </li>     
                </ul>
                <ul className="sidebar-menu" style={{ position: 'absolute', bottom:'0' }}>
                    <li onClick={() => {
                            openMenu === "Analysis" ? setOpenMenu('none') : setOpenMenu('Analysis')
                        }} style={openMenu === 'Analysis' ? { backgroundColor: '#555' } : {}}>
                        <span> <BarChartFill className='sidebar-icon' /> </span>
                    </li>
                </ul>
            </div>
            {openMenu !== 'none' && <Menu openMenu={openMenu} nodes={nodes} edges={edges} handleAddNode={handleAddNode}
                                        learningRate={learningRate} epochs={epochs} batchSize={batchSize} loss={loss} optimizer={optimizer}
                                        setLearningRate={setLearningRate} setEpochs={setEpochs} setBatchSize={setBatchSize} setLoss={setLoss} setOptimizer={setOptimizer}
                                        handleDeleteNodes={handleDeleteNodes} handleRenameNode={handleRenameNode} handleDuplicateNode={handleDuplicateNode}
                                        handleDownload={handleDownload} handleUpload={handleUpload}
                                        />}
        </>
    );
};

const Menu = (props) => {
    const openMenu = props.openMenu;

    return (
        <Container className='left-menu'>
            <h4 style={{fontWeight: 'bold'}}>{openMenu}</h4>
            <div>
            {openMenu === 'Network Design' && <NetworkDesign handleAddNode={props.handleAddNode} />}
            {openMenu === 'Network Details' && <NetworkDetails nodes={props.nodes} handleDeleteNodes={props.handleDeleteNodes} handleRenameNode={props.handleRenameNode}
                                                    handleDuplicateNode={props.handleDuplicateNode}
                                                    />}
            {openMenu === 'Training' && <Training 
                                            learningRate={props.learningRate} epochs={props.epochs} batchSize={props.batchSize} loss={props.loss} optimizer={props.optimizer}
                                            setLearningRate={props.setLearningRate} setEpochs={props.setEpochs} setBatchSize={props.setBatchSize} setLoss={props.setLoss} setOptimizer={props.setOptimizer}
                                            nodes={props.nodes} edges={props.edges}
                                            />}
            {openMenu === 'Options' && <Options 
                                            learningRate={props.learningRate} epochs={props.epochs} batchSize={props.batchSize} loss={props.loss} optimizer={props.optimizer}
                                            handleDownload={props.handleDownload} handleUpload={props.handleUpload}
                                            />}
            </div>
        </Container>
    )
}

const handleAddBlock = ({block, handleAddNode}) => {
    let b = new Block('customNode', { x: 10, y: 50 }, { label: block.name }, block.parameters, block.function);
    handleAddNode(b)
}

const NetworkDesign = ({handleAddNode}) => {

    return (
        <div style={{textAlign: 'left'}}>

            <BlockTable key="tableInput" blocks={Blocks.blocks.Input} category="Input" handleAddNode={handleAddNode} />

            <BlockTable key="tableElementWise" blocks={Blocks.blocks['Element-wise']} category="Element-wise" 
                handleAddNode={handleAddNode} />

            <BlockTable key="tableActivation" blocks={Blocks.blocks.Activation} category="Activation" 
                handleAddNode={handleAddNode}/>

            <BlockTable key="tableNormalization" blocks={Blocks.blocks.Normalization} category="Normalization" 
                handleAddNode={handleAddNode}/>

            <BlockTable key="tableRegularization" blocks={Blocks.blocks.Regularization} category="Regularization" 
                handleAddNode={handleAddNode}/>

            <BlockTable key="tablePooling" blocks={Blocks.blocks.Pooling} category="Pooling" 
                handleAddNode={handleAddNode}/>

        </div>
    );
}

const BlockTable = ({category, blocks, handleAddNode}) => {

    return (
        <>
            <h5 style={{textAlign: 'center'}}>{category}</h5>
            <Table key={"table-"+category} striped hover size='sm' variant='dark'>
                <tbody>
                {blocks.map((block, index) => {
                    return (
                        <tr key={block.id + "-" + index}>
                            <td>{block.name}</td>
                            <td style={{ textAlign: 'right' }}><Button onClick={() => {handleAddBlock({block, handleAddNode})}}>+</Button></td>
                        </tr>
                    )}
                )}
                </tbody>
            </Table>
        </>
    );
}

const NetworkDetails = (props) => {
    const { nodes, handleDeleteNodes, handleRenameNode, handleDuplicateNode } = props;
    return (
        <Table striped variant='dark' hover>
            <thead>
                <tr>
                    <th>Name</th>
                    <th style={{ textAlign: 'center' }}>Actions</th>
                </tr>
            </thead>
            <tbody style={{ textAlign: 'left' }}>
                {nodes.filter((n) => n.hidden===false).map((node, index) => {
                    return <BlockDetailsAndActions key={node+"-"+index} node={node} index={index} 
                                handleDeleteNodes={handleDeleteNodes} handleRenameNode={handleRenameNode} handleDuplicateNode={handleDuplicateNode}
                            />
                })}
            </tbody>
        </Table>
    );
}

const BlockDetailsAndActions = (props)  => {

    const [isRename, setIsRename] = useState(false);
    const [newName, setNewName] = useState(props.node.data.label);

    const handleDelete = () => {
        props.handleDeleteNodes([props.node]);
    }

    const handleRename = () => {
        props.handleRenameNode(props.node, newName);
        setIsRename(false);
    }

    const handleDuplicateNode = () => {
        props.handleDuplicateNode(props.node)
    }

    return (
        <tr>
            <td style={{
                fontWeight: `${props.node.type === 'superBlockNode' ? 'bold' : ''}`, 
                maxWidth: '9.5em', 
                width: 'fit-content',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                height: '3.3em'
                }}
                >
                <div style={{overflowX: 'auto', whiteSpace: 'nowrap', maxWidth: '100%', height:'100%'}}>
                    {isRename ?  
                        <Form.Control type='text' value={newName} onChange={(ev) => { setNewName(ev.target.value) }} />
                    : props.node.data.label}
                </div>
            </td>
            <td style={{ textAlign: 'right', whiteSpace: 'nowrap', overflowX: 'auto' }}>
                { isRename ?
                    <Button onClick={() => handleRename()}> OK </Button>
                : <>
                    <Button onClick={() => handleDuplicateNode()}> <Copy /> </Button> {' '}
                    <Button onClick={() => setIsRename(true)}> <PencilFill /> </Button> {' '}
                    <Button variant='danger' onClick={() => handleDelete()}> <TrashFill /> </Button>
                  </>
                }
            </td>
        </tr>
    );

}

const Training = ({ nodes, edges, epochs, learningRate, batchSize, loss, optimizer, setEpochs, setLearningRate, setBatchSize, setLoss, setOptimizer }) => {

    const [err, setErr] = useState(false);
    const [errMsg, setErrMsg] = useState('');

    const handleTrain = (params, { setErr, setErrMsg }) => {
        // controls parameters are all set and of the right type
        if (params.learningRate !== 0 && params.epochs !== 0 && params.batchSize !== 0 && params.loss !== '' && params.optimizer !== '') {
            if (isNaN(params.epochs) || isNaN(params.batchSize) || isNaN(params.learningRate)) {
                let errMsg = `Error in the parameters:
                ${isNaN(params.learningRate) ? 'Learning rate' : ''}
                ${isNaN(params.epochs) ? ', Epochs' : ''}
                ${isNaN(params.batchSize) ? ', Batch size' : ''}
                must be numeric.`
                    ;
                setErrMsg(errMsg)
                setErr(true)
            } else {
                // prepare for sending the input file(s)
                let fileList = nodes.filter(n=> n.type==='customNode' && n.parameters[0].name === 'input_file').map(n => {
                    return n.parameters[0].value;
                })

                const paramObj = [
                    {"key": "learningRate", "value": params.learningRate},
                    {"key": "epochs", "value": params.epochs},
                    {"key": "batchSize", "value": params.batchSize},
                    {"key": "loss", "value": params.loss},
                    {"key": "optimizer", "value": params.optimizer}
                ]
                console.log("You successfully trained your network with this parameters: ", paramObj)
                BLOCKS_API.postInputFiles(fileList).then((data) => {
                    BLOCKS_API.postNetwork(nodes, edges, paramObj).then((data) => {

                    })
                }).catch((err) => {
                    console.log(err)
                })
            }
        } else {
            setErrMsg("Please fill all the parameters")
            setErr(true)
        }
    }

    const handleReset = ({ setEpochs, setLearningRate, setBatchSize, setLoss, setOptimizer }) => {
        setEpochs(0);
        setLearningRate(0);
        setBatchSize(0);
        setLoss('');
        setOptimizer('');
    }


    return (
        <>
            <Form className='mt-3'>
                <Table striped variant={'dark'}>
                    <tbody>
                        <tr key="trainEpoch">
                            <td style={{ textAlign: 'left', width: '40%' }}>Epoch</td>
                            <td style={{ textAlign: 'right' }}>
                                <Form.Control value={epochs || ''} type='text' style={{ width: '50%', float: 'right' }} onChange={ev => setEpochs(ev.target.value)} />
                            </td>
                        </tr>
                        <tr key="trainLearningRate">
                            <td style={{ textAlign: 'left', width: '40%' }}>Learning Rate</td>
                            <td style={{ textAlign: 'right' }}>
                                <Form.Control value={learningRate || ''} type='text' style={{ width: '50%', float: 'right' }} onChange={ev => setLearningRate(ev.target.value)} />
                            </td>
                        </tr>
                        <tr key="trainBatchSize">
                            <td style={{ textAlign: 'left', width: '40%' }}>Batch Size</td>
                            <td style={{ textAlign: 'right' }}>
                                <Form.Control value={batchSize || ''} type='text' style={{ width: '50%', float: 'right' }} onChange={ev => setBatchSize(ev.target.value)} />
                            </td>
                        </tr>

                        <tr key="trainLoss">
                            <td style={{ textAlign: 'left', width: '40%' }}>Loss Function</td>
                            <td style={{ textAlign: 'right' }}>
                                <DropdownButton
                                    variant="outline-secondary"
                                    title={loss || "Select"}
                                    id="trainForm.LossFunction"
                                    onSelect={sel => setLoss(sel)}
                                >
                                    <Dropdown.Item eventKey="CE">CE</Dropdown.Item>
                                    <Dropdown.Item eventKey="SME">SME</Dropdown.Item>
                                </DropdownButton>
                            </td>
                        </tr>

                        <tr key="trainOptimizer">
                            <td style={{ textAlign: 'left', width: '40%' }}>Optimizer</td>
                            <td style={{ textAlign: 'right' }}>
                                <DropdownButton
                                    variant="outline-secondary"
                                    title={optimizer || "Select"}
                                    id="trainForm.Optimizer"
                                    onSelect={sel => {setOptimizer(sel)}}
                                >
                                    <Dropdown.Item eventKey="SGD">SGD</Dropdown.Item>
                                    <Dropdown.Item eventKey="Adam">Adam</Dropdown.Item>
                                </DropdownButton>
                            </td>
                        </tr>

                    </tbody>
                </Table>
            </Form >

            <Button className='left-menu-button' onClick={() => handleTrain({ epochs, learningRate, batchSize, loss, optimizer }, { setErr, setErrMsg })}> Train </Button>
            <Button className='left-menu-button' onClick={() => handleReset({ setEpochs, setLearningRate, setBatchSize, setLoss, setOptimizer })}> Reset </Button>

            {err && <AlertComponent variant="danger" message={errMsg} setErr={setErr} />}
        </>
    );
}

const Options = (props) => {
    const {learningRate, epochs, batchSize, loss, optimizer} = props
    const [loadFile, setLoadFile] = useState(null);
    const [error, setErr] = useState(false);
    const [errMsg, setErrMsg] = useState(""); 
    const [selectedFileType, setSelectedFileType] = useState('');

    const handleRadioChange = (event) => {
        setSelectedFileType(event.target.value);
    };

    const handleDownload = () => {
        const parameters = [
            { "key": "learningRate", "value": learningRate },
            { "key": "epochs", "value": epochs },
            { "key": "batchSize", "value": batchSize },
            { "key": "loss", "value": loss },
            { "key": "optimizer", "value": optimizer }
        ];
        props.handleDownload(parameters, selectedFileType);
    }

    const handleUpload = () => {

        if(loadFile===null || loadFile.type !== 'application/json') {
            setErr(true);
            setErrMsg("Please select a .json file");
        } else {
            props.handleUpload(loadFile);
        }
    }

    return (
        <div>
            <h5>Download as</h5>

            <p>
                <input
                    type="radio"
                    id="json"
                    name="fileType"
                    value="json"
                    checked={selectedFileType === 'json'}
                    onChange={handleRadioChange}
                /> {' '}
                JSON
            </p>

            <p>
                <input
                    type="radio"
                    id="onnx"
                    name="fileType"
                    value="onnx"
                    checked={selectedFileType === 'onnx'}
                    onChange={handleRadioChange}
                /> {' '}
                ONNX
            </p>

            <p>
                <input
                    type="radio"
                    id="pth"
                    name="fileType"
                    value="pth"
                    checked={selectedFileType === 'pth'}
                    onChange={handleRadioChange}
                /> {' '}
                PyTorch
            </p>

            <Button className='left-menu-button mt-3' onClick={() => handleDownload()}> Download </Button> <br />
            <hr />
            <h5>Import from existing file</h5>
            <Form.Control type='file' id='file-json' accept=".json" onChange={(e) => setLoadFile(e.target.files[0])} />
            <Button className='left-menu-button mt-2' onClick={() => handleUpload()}> Upload </Button>

            {error && <AlertComponent variant="danger" message={errMsg} setErr={setErr} />}

        </div>
    )
}
export default Sidebar;
