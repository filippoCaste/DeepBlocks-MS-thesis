import Button from 'react-bootstrap/Button';
import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import Download from 'react-bootstrap-icons/dist/icons/download'
import Upload from 'react-bootstrap-icons/dist/icons/upload'
import PencilFill from 'react-bootstrap-icons/dist/icons/pencil-fill'
import Sliders from 'react-bootstrap-icons/dist/icons/sliders'
import List from 'react-bootstrap-icons/dist/icons/list'
import Diagram3Fill from 'react-bootstrap-icons/dist/icons/diagram-3-fill';
import TrashFill from 'react-bootstrap-icons/dist/icons/trash-fill';
import Copy from 'react-bootstrap-icons/dist/icons/copy'
import Blocks from '../../public/data/blocks.json'
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Form from 'react-bootstrap/Form';
import AlertComponent from './AlertComponent';
import Block from '../models/Block';
import { BLOCKS_API } from '../API/blocks';
import PlusLg from 'react-bootstrap-icons/dist/icons/plus-lg';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';

import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import InfoCircle from 'react-bootstrap-icons/dist/icons/info-circle';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

const Sidebar = (props) => {

    const [openMenu, setOpenMenu] = useState('none');
    const { nodes, edges, handleAddNode, handleDeleteNodes, handleRenameNode, handleDuplicateNode, 
            handleDownload, handleUpload, learningRate, epochs, batchSize, loss, optimizer, addMessage,
            setLearningRate, setEpochs, setBatchSize, setLoss, setOptimizer, metrics, setMetrics, isTraining } = props;

    // const viewportWidth = window.innerWidth;
    const zoomLevel = window.screen.width / window.innerWidth;
    if (openMenu !== 'none') {
        document.getElementById('reactflow-div').style.width = `${80 / zoomLevel}vw`;
    } else if (document.getElementById('reactflow-div') != null) {
        document.getElementById('reactflow-div').style.width = `${96.4 / zoomLevel}vw`;;
    }

    return (
        <>
            <div className="sidebar">
                <ul className="sidebar-menu">
                    <li onClick={() => {
                            openMenu === "Network Design" ? setOpenMenu('none') : setOpenMenu('Network Design')
                        }} className={`${openMenu === 'Network Design' ? 'selected' : ''}`}>
                        <span>
                            <OverlayTrigger
                                placement="right"
                                overlay={
                                    <Tooltip id={`tooltip-editNetwork`}>
                                        Add blocks
                                    </Tooltip>
                                }> 
                                <PencilFill className='sidebar-icon' /> 
                            </OverlayTrigger>
                        </span>
                    </li>
                    <li onClick={() => {
                            openMenu === "Network Details" ? setOpenMenu('none') : setOpenMenu('Network Details')
                        }} className={`${openMenu === 'Network Details' ? 'selected' : ''}`}>
                        <span>
                            <OverlayTrigger
                                placement="right"
                                overlay={
                                    <Tooltip id={`tooltip-listNodesNetwork`}>
                                        Nodes in the current sheet
                                    </Tooltip>
                                }> 
                                    <List className='sidebar-icon' /> 
                            </OverlayTrigger>            
                        </span>
                    </li>
                    <li onClick={() => {
                            openMenu === "Training" ? setOpenMenu('none') : setOpenMenu('Training')
                        }} className={`${openMenu === 'Training' ? 'selected' : ''}`}>
                        <span>
                            <OverlayTrigger
                                placement="right"
                                overlay={
                                    <Tooltip id={`tooltip-parametersNetwork`}>
                                        Set parameters: learning rate, epochs, batch size, loss and optimizer
                                    </Tooltip>
                                }> 
                                    <Sliders className='sidebar-icon' /> 
                            </OverlayTrigger>            
                        </span>
                    </li>
                    <li onClick={() => {
                            openMenu === "Options" ? setOpenMenu('none') : setOpenMenu('Options')
                        }} className={`${openMenu === 'Options' ?  'selected' : '' }`}>
                        <span>
                            <OverlayTrigger
                                placement="right"
                                overlay={
                                    <Tooltip id={`tooltip-downloadNetwork`}>
                                        Download your model
                                    </Tooltip>
                                }>
                                    <Download className='sidebar-icon' /> 
                            </OverlayTrigger>            
                        </span>
                    </li>
                    <li onClick={() => {
                        openMenu === "Upload" ? setOpenMenu('none') : setOpenMenu('Upload')
                    }} className={`${openMenu === 'Upload' ? 'selected' : ''}`}>
                        <span>
                            <OverlayTrigger
                                placement="right"
                                overlay={
                                    <Tooltip id={`tooltip-uploadNetwork`}>
                                        Upload a model
                                    </Tooltip>
                                }> 
                                    <Upload className='sidebar-icon' /> 
                            </OverlayTrigger>            
                        </span>
                    </li>
                </ul>
                <hr />
                <ul className="sidebar-menu">
                    <li onClick={() => {
                            openMenu === "Analysis" ? setOpenMenu('none') : setOpenMenu('Analysis')
                        }} className={`${openMenu === 'Analysis' ? 'selected' : ''}`}>
                                                <span>
                            <OverlayTrigger
                                placement="right"
                                overlay={
                                    <Tooltip id={`tooltip-editNetwork`}>
                                        Training results
                                    </Tooltip>
                                }> 
                                    <Diagram3Fill className='sidebar-icon' /> 
                            </OverlayTrigger>            
                        </span>
                    </li>
                </ul>
            </div>
            {openMenu !== 'none' && openMenu !== 'Analysis' && <Menu openMenu={openMenu} nodes={nodes} edges={edges} handleAddNode={handleAddNode}
                                        learningRate={learningRate} epochs={epochs} batchSize={batchSize} loss={loss} optimizer={optimizer}
                                        setLearningRate={setLearningRate} setEpochs={setEpochs} setBatchSize={setBatchSize} setLoss={setLoss} setOptimizer={setOptimizer}
                                        handleDeleteNodes={handleDeleteNodes} handleRenameNode={handleRenameNode} handleDuplicateNode={handleDuplicateNode}
                                        handleDownload={handleDownload} handleUpload={handleUpload} setMetrics={setMetrics} addMessage={addMessage}
                                        />}

            {openMenu === 'Analysis' && <Analysis metrics={metrics} isTraining={isTraining}
                     parameters={[{ "key": "Learning Rate", "value": learningRate}, { "key": "Epochs", "value": epochs}, { "key": "Batch size", "value": batchSize}, { "key": "Loss Function", "value": loss}, { "key": "Optimizer", "value": optimizer}]}
                    />}
        </>
    );
};

const Menu = (props) => {
    const openMenu = props.openMenu;

    return (
        <Container className='left-menu'>
            <h4 style={{fontWeight: 'bold'}}>{openMenu}</h4>
            <hr />
            <div>
            {openMenu === 'Network Design' && <NetworkDesign handleAddNode={props.handleAddNode} />}
            {openMenu === 'Network Details' && <NetworkDetails nodes={props.nodes} handleDeleteNodes={props.handleDeleteNodes} handleRenameNode={props.handleRenameNode}
                                                    handleDuplicateNode={props.handleDuplicateNode}
                                                    />}
            {openMenu === 'Training' && <Training 
                                            learningRate={props.learningRate} epochs={props.epochs} batchSize={props.batchSize} loss={props.loss} optimizer={props.optimizer}
                                            setLearningRate={props.setLearningRate} setEpochs={props.setEpochs} setBatchSize={props.setBatchSize} setLoss={props.setLoss} setOptimizer={props.setOptimizer}
                                            nodes={props.nodes} edges={props.edges} setMetrics={props.setMetrics} addMessage={props.addMessage}
                                            />}
            {openMenu === 'Options' && <Options
                                            learningRate={props.learningRate} epochs={props.epochs} batchSize={props.batchSize} loss={props.loss} optimizer={props.optimizer}
                                            handleDownload={props.handleDownload} 
                                            />}

            {openMenu === 'Upload' && <Uploads handleUpload={props.handleUpload} />}
            </div>
        </Container>
    )
}

const handleAddBlock = ({block, handleAddNode}) => {
    let b = new Block('customNode', { x: 200, y: 200 }, { label: block.name }, block.parameters, block.function);
    b.position = { x: 200+b.id*7, y: 200+b.id*7 };
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
                            <td style={{ verticalAlign: 'middle' }}>{block.name}</td>
                            <td style={{ textAlign: 'right' }}><Button onClick={() => {handleAddBlock({block, handleAddNode})}}> <PlusLg /></Button></td>
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
                {nodes.filter((n) => n.hidden===false && !n.type.includes('invisible')).map((node, index) => {
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
                height: 'auto',
                verticalAlign: 'middle',
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
                    <Button size='sm' onClick={() => handleDuplicateNode()}> <Copy /> </Button> {' '}
                    <Button size='sm' onClick={() => setIsRename(true)}> <PencilFill /> </Button> {' '}
                    <Button size='sm' variant='danger' onClick={() => handleDelete()}> <TrashFill /> </Button>
                  </>
                }
            </td>
        </tr>
    );

}

const Training = ({ nodes, edges, epochs, learningRate, batchSize, loss, optimizer, setEpochs, setLearningRate, setBatchSize, setLoss, setOptimizer, setMetrics, addMessage }) => {

    const [err, setErr] = useState(false);
    const [errMsg, setErrMsg] = useState('');

    // const handleTrain = (params, { setErr, setErrMsg }) => {
    //     // controls parameters are all set and of the right type
    //     if (params.learningRate !== 0 && params.epochs !== 0 && params.batchSize !== 0 && params.loss !== '' && params.optimizer !== '') {
    //         if (isNaN(params.epochs) || isNaN(params.batchSize) || isNaN(params.learningRate)) {
    //             let errMsg = `Error in the parameters:
    //             ${isNaN(params.learningRate) ? 'Learning rate' : ''}
    //             ${isNaN(params.epochs) ? ', Epochs' : ''}
    //             ${isNaN(params.batchSize) ? ', Batch size' : ''}
    //             must be numeric.`
    //                 ;
    //             setErrMsg(errMsg)
    //             setErr(true)
    //         } else {
    //             // prepare for sending the input file(s)
    //             let fileList = nodes.filter(n=> n.type==='customNode' && n.parameters[0].name === 'input_file').map(n => {
    //                 return n.parameters[0].value;
    //             })

    //             const paramObj = [
    //                 {"key": "learningRate", "value": params.learningRate},
    //                 {"key": "epochs", "value": params.epochs},
    //                 {"key": "batchSize", "value": params.batchSize},
    //                 {"key": "loss", "value": params.loss},
    //                 {"key": "optimizer", "value": params.optimizer}
    //             ]
    //             console.log("You successfully trained your network with this parameters: ", paramObj)
    //             BLOCKS_API.postInputFiles(fileList).then((data) => {
    //                 BLOCKS_API.postNetwork(nodes, edges, paramObj).then((data) => {
    //                     console.log(data)
    //                     setMetrics(data.metrics)
    //                     addMessage("Training completed", "success")
    //                 }).catch((err) => {
    //                     // console.log(err)
    //                     addMessage("Error while training: " + err, "danger")
    //                 })
    //             }).catch((err) => {
    //                 // console.log(err)
    //                 addMessage("Error while training: " + err, "danger")
    //             })
    //         }
    //     } else {
    //         setErrMsg("Please fill all the parameters")
    //         setErr(true)
    //     }
    // }

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
                                    <Dropdown.Item eventKey="MSE">MSE</Dropdown.Item>
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

            {/* <Button className='left-menu-button' onClick={() => handleTrain({ epochs, learningRate, batchSize, loss, optimizer }, { setErr, setErrMsg })}> Train </Button> */}
            <Button className='left-menu-button' onClick={() => handleReset({ setEpochs, setLearningRate, setBatchSize, setLoss, setOptimizer })}> Reset </Button>

            {err && <AlertComponent variant="danger" message={errMsg} setErr={setErr} />}
        </>
    );
}

const Options = (props) => {
    const {learningRate, epochs, batchSize, loss, optimizer} = props
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

            {error && <AlertComponent variant="danger" message={errMsg} setErr={setErr} />}

            <p style={{ fontStyle: 'italic', marginTop: '10px' }}> <InfoCircle /> To upload this network on DeepBlocks again, remember that you must use a JSON file.</p>

        </div>
    )
}

const Uploads = (props) => {
    const [loadFile, setLoadFile] = useState(null);
    const [error, setErr] = useState(false);
    const [errMsg, setErrMsg] = useState(""); 

    const handleUpload = () => {

        if (loadFile === null || loadFile.type !== 'application/json') {
            setErr(true);
            setErrMsg("Please select a .json file");
        } else {
            props.handleUpload(loadFile);
        }
    }

    return (
        <div>
            <h5>Import from existing file</h5>
            <p style={{ fontStyle: 'italic' }}>Supported format: .json</p>
            <Form.Control type='file' id='file-json' accept=".json" onChange={(e) => setLoadFile(e.target.files[0])} />
            <Button className='left-menu-button mt-3' onClick={() => handleUpload()}> Upload </Button>

            {error && <AlertComponent variant="danger" message={errMsg} setErr={setErr} />}

        </div>
    )

}

const Analysis = (props) => {
    const {metrics, parameters, isTraining} = props;

    return (
        <div className='analysis-container'>
            <Container>
                <Row className='mt-3'>
                    <h3 className='text-center'>Analysis</h3>
                    <hr />
                </Row>
                <Row>
                    <Container className="text-center my-5">
                        {isTraining && <div className="d-flex flex-column align-items-center">
                                            <Spinner animation="border" role="status" variant="secondary" style={{ width: '5rem', height: '5rem' }}>
                                                <span className="visually-hidden">Loading...</span>
                                            </Spinner>
                                            <p className="mt-3">Executing network, please wait...</p>
                                        </div>
                        }
                        {metrics.length > 0 ? <Results metrics={metrics} parameters={parameters} /> : <>
                                <p>No results to show:</p>
                                <p> Add an <em>Input node</em> and set up the parameters (click on the <Sliders /> tab in the left menu) in order to start training your network</p>
                            </>}
                    </Container>
                </Row>
            </Container>
        </div>
    )
}

const Results = (props) => {
    const {metrics, parameters} = props;

    return (
         <Col>
            <Row>
                <Col md="6" className="mx-auto">
                    <h3>Training Results</h3>
                    <br />
                    <Table striped hover variant='dark'>
                        <tbody>
                            {metrics[metrics.length-1].map((metric) => (
                                <tr key={metric.name}>
                                    <th>{metric.name.toUpperCase()}</th>
                                    <td>{metric.value[metric.value.length-1]}</td>   
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>
            <br />
            <Row>
                <Col md="6" className="mx-auto">
                    <h3>Parameters</h3>
                    <br />
                    <Table striped hover variant='dark'>
                        <tbody>
                            {parameters.map((parameter) => (
                                <tr key={parameter.key}>
                                    <th>{parameter.key}</th>
                                    <td>{parameter.value}</td>   
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>
            <br /> <br />
            <h3>Visualization</h3>
            <br />
            <Plots metrics={metrics} />
        </Col>
    );
}

const Plots = (props) => {
    const { metrics } = props;

    // Function to generate a color for each session
    const generateColor = (index) => {
        const colors = [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 206, 86, 1)'
        ];
        return colors[index % colors.length];
    };

    const epochs = Array.from({ length: metrics[0][0].value.length }, (_, i) => i + 1);

    const createDatasets = (metricName) => {
        return metrics.map((session, index) => {
            const metricData = session.find(item => item.name === metricName).value;
            return {
                label: `Session ${index + 1}`,
                data: metricData,
                fill: false,
                backgroundColor: generateColor(index),
                borderColor: generateColor(index),
                borderWidth: 1
            };
        });
    };

    const precisionRecallData = {
        labels: ['Precision', 'Recall'],
        datasets: metrics.map((session, index) => {
            const precision = session.find(item => item.name === 'precision').value[0];
            const recall = session.find(item => item.name === 'recall').value[0];
            return {
                label: `Session ${index + 1}`,
                data: [precision, recall],
                backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)'],
                borderColor: generateColor(index),
                borderWidth: 1
            };
        })
    };

    const lossEpochData = {
        labels: epochs,
        datasets: createDatasets('loss')
    };

    const accuracyEpochData = {
        labels: epochs,
        datasets: createDatasets('accuracy')
    };

    const options = {
        interaction: {
            mode: 'index',
            intersect: false,
        },
        plugins: {
            tooltip: {
                mode: 'nearest',
                intersect: false,
            }
        },
        scales: {
            x: {
                beginAtZero: true
            },
            y: {
                beginAtZero: true
            }
        }
    };

    return (
        <>
            <Col md="8" className="mx-auto">
                <h4>Precision / Recall</h4>
                <Line data={precisionRecallData} options={options} />
            </Col>
            <br />
            <Col md="8" className="mx-auto">
                <h4>Loss vs Epochs</h4>
                <Line data={lossEpochData} options={options} />
            </Col>
            <br />
            <Col md="8" className="mx-auto">
                <h4>Accuracy vs Epochs</h4>
                <Line data={accuracyEpochData} options={options} />
            </Col>
        </>
    );
}
export default Sidebar;
