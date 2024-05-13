import Button from 'react-bootstrap/Button';
import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import Download from 'react-bootstrap-icons/dist/icons/download'
import Pencil from 'react-bootstrap-icons/dist/icons/pencil'
import PlayFill from 'react-bootstrap-icons/dist/icons/play-fill'
import ListColumns from 'react-bootstrap-icons/dist/icons/list-columns'

import Blocks from '../../public/data/blocks.json'
import { Dropdown, DropdownButton, Form } from 'react-bootstrap';
import AlertComponent from './AlertComponent';


const Sidebar = (props) => {

    const [openMenu, setOpenMenu] = useState('none');
    const nodes = props.nodes;

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
                    <li style={openMenu === 'Network Design' ? { backgroundColor: '#555' } : {}}>
                        <span onClick={() => {
                            openMenu === "Network Design" ? setOpenMenu('none') : setOpenMenu('Network Design')
                        }}> <Pencil style={{ height: '1.5rem', width: 'auto' }} /> </span>
                    </li>
                    <li style={openMenu === 'Network Details' ? { backgroundColor: '#555' } : {}}>
                        <span onClick={() => {
                            openMenu === "Network Details" ? setOpenMenu('none') : setOpenMenu('Network Details')
                        }}> <ListColumns style={{ height: '1.5rem', width: 'auto' }} /> </span>
                    </li>
                    <li style={openMenu === 'Training' ? { backgroundColor: '#555' } : {}}>
                        <span onClick={() => {
                            openMenu === "Training" ? setOpenMenu('none') : setOpenMenu('Training')
                        }}> <PlayFill style={{ height: '1.5rem', width: 'auto' }} /> </span>
                    </li>
                    <li style={openMenu === 'Options' ? { backgroundColor: '#555' } : {}}>
                        <span onClick={() => {
                            openMenu === "Options" ? setOpenMenu('none') : setOpenMenu('Options')
                        }}> <Download style={{ height: '1.5rem', width: 'auto' }} /> </span>
                    </li>
                </ul>
                <ul className="sidebar-menu" style={{ position: 'absolute', bottom: 0 }}>
                    <li>
                        <span>A</span>
                    </li>
                </ul>
            </div>
            {openMenu !== 'none' && <Menu openMenu={openMenu} nodes={nodes} 
                                        learningRate={learningRate} epochs={epochs} batchSize={batchSize} loss={loss} optimizer={optimizer}
                                        setLearningRate={setLearningRate} setEpochs={setEpochs} setBatchSize={setBatchSize} setLoss={setLoss} setOptimizer={setOptimizer}

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
            {openMenu === 'Network Design' && <NetworkDesign />}
            {openMenu === 'Network Details' && <NetworkDetails nodes={props.nodes}/>}
            {openMenu === 'Training' && <Training 
                                            learningRate={props.learningRate} epochs={props.epochs} batchSize={props.batchSize} loss={props.loss} optimizer={props.optimizer}
                                            setLearningRate={props.setLearningRate} setEpochs={props.setEpochs} setBatchSize={props.setBatchSize} setLoss={props.setLoss} setOptimizer={props.setOptimizer}

                                            />}
            {openMenu === 'Options' && <Options />}
            </div>
        </Container>
    )
}

const NetworkDesign = () => {
    return (
        <div style={{textAlign: 'left'}}>

            <BlockTable blocks={Blocks.blocks['Element-wise']} category="Element-wise" />

            <BlockTable blocks={Blocks.blocks.Activation} category="Activation" />

            <BlockTable blocks={Blocks.blocks.Normalization} category="Normalization" />

            <BlockTable blocks={Blocks.blocks.Regularization} category="Regularization" />

            <BlockTable blocks={Blocks.blocks.Pooling} category="Pooling" />

        </div>
    );
}

const BlockTable = ({category, blocks}) => {

    return (
        <>
            <h5 style={{textAlign: 'center'}}>{category}</h5>
            <Table striped hover size='sm' variant='dark'>
                <tbody>
                {blocks.map((block) => {
                    return (
                        <tr>
                            <td>{block.name}</td>
                            <td style={{textAlign: 'right'}}><Button>+</Button></td>
                        </tr>
                    )}
                )}
                </tbody>
            </Table>
        </>
    );
}

const NetworkDetails = (props) => {
    const nodes = props.nodes;

    return (
        <>
            {nodes.map((node, index) => {
                return <p id={node+","+index}>{node.data.label}</p>
            })}
        </>
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
                        <tr>
                            <td style={{ textAlign: 'left', width: '40%' }}>Epoch</td>
                            <td style={{ textAlign: 'right' }}>
                                <Form.Group controlId="trainForm.Epoch" style={{ border: 'none' }} onChange={ev => setEpochs(ev.target.value)}>
                                    <Form.Control value={epochs || ''} type='text' style={{ width: '50%', float: 'right' }} />
                                </Form.Group>
                            </td>
                        </tr>
                        <tr>
                            <td style={{ textAlign: 'left', width: '40%' }}>Learning Rate</td>
                            <td style={{ textAlign: 'right' }}>
                                <Form.Group controlId="trainForm.Loss" style={{ border: 'none' }} onChange={ev => setLearningRate(ev.target.value)} >
                                    <Form.Control value={learningRate || ''} type='text' style={{ width: '50%', float: 'right' }} />
                                </Form.Group>
                            </td>
                        </tr>
                        <tr>
                            <td style={{ textAlign: 'left', width: '40%' }}>Batch Size</td>
                            <td style={{ textAlign: 'right' }}>
                                <Form.Group controlId="trainForm.BatchSize" style={{ border: 'none' }} onChange={ev => setBatchSize(ev.target.value)} >
                                    <Form.Control value={batchSize || ''} type='text' style={{ width: '50%', float: 'right' }} />
                                </Form.Group>
                            </td>
                        </tr>

                        <tr>
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

                        <tr>
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
const handleSave = () => {
    console.log("You successfully saved smth")
}

const handleLoad = () => {
    console.log("You successfully loaded smth")
}

const handleExport = () => {
    console.log("You successfully exported smth")
}

const Options = () => {
    return (
        <>
            <Button className='left-menu-button mt-3' onClick={() => handleSave()}> Save </Button> <br />
            <Button className='left-menu-button' onClick={() => handleLoad()}> Load </Button> <br />
            <Button className='left-menu-button' onClick={() => handleExport()}> Export </Button>
        </>
    )
}
export default Sidebar;
