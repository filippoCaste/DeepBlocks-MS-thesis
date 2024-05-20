import Button from 'react-bootstrap/Button';
import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import Download from 'react-bootstrap-icons/dist/icons/download'
import PencilFill from 'react-bootstrap-icons/dist/icons/pencil-fill'
import PlayFill from 'react-bootstrap-icons/dist/icons/play-fill'
import ListColumns from 'react-bootstrap-icons/dist/icons/list-columns'
import BarChartFill from 'react-bootstrap-icons/dist/icons/bar-chart-fill';

import Blocks from '../../public/data/blocks.json'
import { Dropdown, DropdownButton, Form } from 'react-bootstrap';
import AlertComponent from './AlertComponent';
import Block from '../models/Block';


const Sidebar = (props) => {

    const [openMenu, setOpenMenu] = useState('none');
    const { nodes, handleAddNode, handleDeleteNodes, handleRenameNode, handleDuplicateNode, handleSave } = props;

    // training parameters
    const [learningRate, setLearningRate] = useState(0);
    const [epochs, setEpochs] = useState(0);
    const [batchSize, setBatchSize] = useState(0);
    const [loss, setLoss] = useState('');
    const [optimizer, setOptimizer] = useState('');
    // --------------------------------------------------


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
            {openMenu !== 'none' && <Menu openMenu={openMenu} nodes={nodes} handleAddNode={handleAddNode}
                                        learningRate={learningRate} epochs={epochs} batchSize={batchSize} loss={loss} optimizer={optimizer}
                                        setLearningRate={setLearningRate} setEpochs={setEpochs} setBatchSize={setBatchSize} setLoss={setLoss} setOptimizer={setOptimizer}
                                        handleDeleteNodes={handleDeleteNodes} handleRenameNode={handleRenameNode} handleDuplicateNode={handleDuplicateNode}
                                        handleSave={handleSave}
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

                                            />}
            {openMenu === 'Options' && <Options handleSave={props.handleSave} />}
            </div>
        </Container>
    )
}

const handleAddBlock = ({block, handleAddNode}) => {
    let b = new Block('customNode', { x: 10, y: 50 }, { label: block.name }, block.parameters);
    handleAddNode(b)
}

const NetworkDesign = ({handleAddNode}) => {

    return (
        <div style={{textAlign: 'left'}}>

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
                {blocks.map((block) => {
                    return (
                        <tr key={block.id}>
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
                {nodes.map((node, index) => {
                    return <BlockDetailsAndActions key={node+"-"+index} node={node} index={index} 
                                handleDeleteNodes={handleDeleteNodes} handleRenameNode={handleRenameNode} handleDuplicateNode={handleDuplicateNode}
                            />
                })}
            </tbody>
        </Table>
    );
}

const BlockDetailsAndActions = (props)  => {

    const handleDelete = () => {
        props.handleDeleteNodes([props.node]);
    }

    const handleRename = () => {
        props.handleRenameNode(props.node, newName);
    }

    const handleDuplicateNode = () => {
        setIsRename(false)
        props.handleDuplicateNode(props.node)
    }

    const [isRename, setIsRename] = useState(false);
    const [newName, setNewName] = useState(props.node.data.label);

    return (
        <tr>
            <td>
                {isRename ?  
                    <Form.Control style={{  }} type='text' value={newName} onChange={(ev) => { setNewName(ev.target.value) }} />
                : props.node.data.label}
                
            </td>
            <td style={{ textAlign: 'right' }}>
                { isRename ?
                    <Button onClick={() => handleRename()}> OK </Button>
                : <>
                    <Button onClick={() => handleDuplicateNode()}>c</Button>
                    <Button onClick={() => setIsRename(true)}>r</Button>
                    <Button variant='danger' onClick={() => handleDelete()}>d</Button>
                  </>
                }
            </td>
        </tr>
    );

}

const handleTrain = (params, { setErr, setErrMsg }) => {
    // controls parameters are all set and of the right type
    if(params.learningRate !== 0 && params.epochs !== 0 && params.batchSize !== 0 && params.loss !== '' && params.optimizer !== '') {
        if(isNaN(params.epochs) || isNaN(params.batchSize) || isNaN(params.learningRate)) {
            let errMsg = `Error in the parameters:
                ${isNaN(params.learningRate) ? 'Learning rate' : ''}
                ${isNaN(params.epochs) ? ', Epochs' : ''}
                ${isNaN(params.batchSize) ? ', Batch size' : ''}
                must be numeric.`
            ;
            setErrMsg(errMsg)
            setErr(true)
        } else {
            console.log("You successfully trained your network with this parameters: ", params)
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

const Training = ({ epochs, learningRate, batchSize, loss, optimizer, setEpochs, setLearningRate, setBatchSize, setLoss, setOptimizer }) => {

    const [err, setErr] = useState(false);
    const [errMsg, setErrMsg] = useState('');

    return (
        <>
            <Form className='mt-3'>
                <Table striped variant={'dark'}>
                    <tbody>
                        <tr key="trainEpoch">
                            <td style={{ textAlign: 'left', width: '40%' }}>Epoch</td>
                            <td style={{ textAlign: 'right' }}>
                                <Form.Group controlId="trainForm.Epoch" style={{ border: 'none' }} onChange={ev => setEpochs(ev.target.value)}>
                                    <Form.Control value={epochs || ''} type='text' style={{ width: '50%', float: 'right' }} />
                                </Form.Group>
                            </td>
                        </tr>
                        <tr key="trainLearningRate">
                            <td style={{ textAlign: 'left', width: '40%' }}>Learning Rate</td>
                            <td style={{ textAlign: 'right' }}>
                                <Form.Group controlId="trainForm.Loss" style={{ border: 'none' }} onChange={ev => setLearningRate(ev.target.value)} >
                                    <Form.Control value={learningRate || ''} type='text' style={{ width: '50%', float: 'right' }} />
                                </Form.Group>
                            </td>
                        </tr>
                        <tr key="trainBatchSize">
                            <td style={{ textAlign: 'left', width: '40%' }}>Batch Size</td>
                            <td style={{ textAlign: 'right' }}>
                                <Form.Group controlId="trainForm.BatchSize" style={{ border: 'none' }} onChange={ev => setBatchSize(ev.target.value)} >
                                    <Form.Control value={batchSize || ''} type='text' style={{ width: '50%', float: 'right' }} />
                                </Form.Group>
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

    const handleSave = () => {
        props.handleSave();
    }

    const handleLoad = () => {
        console.log("You successfully loaded smth")
    }

    const handleExport = () => {
        console.log("You successfully exported smth")
    }

    return (
        <>
            <Button className='left-menu-button mt-3' onClick={() => handleSave()}> Save </Button> <br />
            <Button className='left-menu-button' onClick={() => handleLoad()}> Load </Button> <br />
            <Button className='left-menu-button' onClick={() => handleExport()}> Export </Button>
        </>
    )
}
export default Sidebar;
