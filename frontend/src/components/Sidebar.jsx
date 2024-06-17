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
                        <span> <PencilFill className='sidebar-icon' /> </span>
                    </li>
                    <li onClick={() => {
                            openMenu === "Network Details" ? setOpenMenu('none') : setOpenMenu('Network Details')
                        }} className={`${openMenu === 'Network Details' ? 'selected' : ''}`}>
                        <span> <List className='sidebar-icon' /> </span>
                    </li>
                    <li onClick={() => {
                            openMenu === "Training" ? setOpenMenu('none') : setOpenMenu('Training')
                        }} className={`${openMenu === 'Training' ? 'selected' : ''}`}>
                        <span> <Sliders className='sidebar-icon' /> </span>
                    </li>
                    <li onClick={() => {
                            openMenu === "Options" ? setOpenMenu('none') : setOpenMenu('Options')
                        }} className={`${openMenu === 'Options' ?  'selected' : '' }`}>
                        <span> <Download className='sidebar-icon' /> </span>
                    </li>
                    <li onClick={() => {
                        openMenu === "Upload" ? setOpenMenu('none') : setOpenMenu('Upload')
                    }} className={`${openMenu === 'Upload' ? 'selected' : ''}`}>
                        <span> <Upload className='sidebar-icon' /> </span>
                    </li>
                </ul>
                <hr />
                <ul className="sidebar-menu">
                    <li onClick={() => {
                            openMenu === "Analysis" ? setOpenMenu('none') : setOpenMenu('Analysis')
                        }} className={`${openMenu === 'Analysis' ? 'selected' : ''}`}>
                        <span> <Diagram3Fill className='sidebar-icon' /> </span>
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
                        console.log(data)
                        setMetrics(data.metrics)
                        addMessage("Training completed", "success")
                    }).catch((err) => {
                        // console.log(err)
                        addMessage("Error while training: " + err, "danger")
                    })
                }).catch((err) => {
                    // console.log(err)
                    addMessage("Error while training: " + err, "danger")
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
    // let metrics = [
    //     { "name": "loss", "value": [10.088768235851737, 4.932463331492365, 3.4670406011071586, 2.7300461371231173, 2.266199111913991, 1.8351842953604652, 1.6822232899396705, 1.4262728034201386, 1.3206678631344978, 1.235159848119565, 1.0630198826637325, 1.0362076695294394, 0.962142662765602, 0.927034489338314, 0.9082388981912212, 0.8158781058099188, 0.7906178209964223, 0.7586982334718996, 0.720835176617624, 0.7112367367980783, 0.6698448468221016, 0.6291567731550118, 0.611838281254697, 0.5894221199863745, 0.5735875618042353, 0.5582632129443392, 0.5246518890656352, 0.5086991575470858, 0.4965234529518678, 0.4845016760104345, 0.46068040668275865, 0.4477717151282443, 0.4399052754080579, 0.4218625700293924, 0.41561610161274114, 0.40540738151204286, 0.3938279635980837, 0.38657282535646556, 0.37628362434427415, 0.3714460456783205, 0.35767978775598235, 0.34682773129260376, 0.3392789829639966, 0.3325365095269155, 0.3251097842678981, 0.3199622077437282, 0.3155598423940505, 0.30877498052778135, 0.30287789668829354, 0.2973623525917684, 0.29294094963621594, 0.28860094511218754, 0.2816287929300965, 0.2762027289302411, 0.27339083555608584, 0.2679859908830959, 0.2625496620115351, 0.2579672141690159, 0.25347219198796306, 0.24919488286814152, 0.2443805685255386, 0.24027237748091482, 0.23586327779205928, 0.23229301366325506, 0.22851526374965867, 0.22429574093930984, 0.2208591091498944, 0.21773457232848115, 0.21470839163467413, 0.21133590533736796, 0.2084238320138534, 0.20541340212513124, 0.2024510893065081, 0.19989795069897528, 0.19719385698669088, 0.19443647242687934, 0.19189985796919308, 0.18954403080559777, 0.18701463272036362, 0.1847711531488161, 0.18265698225820997, 0.18057303281547378, 0.17859444034807618, 0.17670196146259418, 0.17481927945210907, 0.17292884074088843, 0.17112871527002917, 0.1694536782621465, 0.16772546203227783, 0.1660689701247971, 0.16438632752352214, 0.1627589785914379, 0.1612033568097399, 0.15973154238833793, 0.15817363979679763, 0.15665530929876867] },
    //     { "name": "accuracy", "value": [0.20910610468250794, 0.22041742992624508, 0.23308525519482428, 0.24571234009517884, 0.26016769871618467, 0.27368209918245565, 0.289372037432861, 0.3035068361446422, 0.3172876518552582, 0.3328726351548283, 0.3466047558698044, 0.3602616121211505, 0.3754787095253884, 0.3901522070732555, 0.4059995581057777, 0.42030887664905326, 0.4351260998744197, 0.4491499118955925, 0.4643191208196027, 0.4791570285389671, 0.4937751501979607, 0.5093906554529167, 0.5246335654844963, 0.5400546111266894, 0.554907518157049, 0.5703685860800133, 0.5854748266741896, 0.6006320527757132, 0.6153188038228583, 0.6307936978093317, 0.6458607851807937, 0.6615088306014422, 0.6768193136359285, 0.691678661286925, 0.7074813052971227, 0.722243930411678, 0.7373971778471817, 0.7527112059259876, 0.7672278261098052, 0.7824761034111165, 0.7975973918890935, 0.8125419810341635, 0.8274201762887585, 0.8421071507209336, 0.8573046536101792, 0.872028850769486, 0.8868964084179868, 0.9016179363247836, 0.916369785267344, 0.9308814585868721, 0.9453738443251847, 0.9600137595958017, 0.9745650400707835, 0.9887124298720154, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1] },
    //     { "name": "precision", "value": [0.20486961457379684, 0.2191380749671843, 0.2317749622202541, 0.24473827401102278, 0.260218425936268, 0.2745851680070655, 0.2906845904953586, 0.30397417426240156, 0.3190101513707425, 0.3335576655677955, 0.3463877467260533, 0.3626939864073397, 0.37567028877578235, 0.39149965709215134, 0.40527842834277355, 0.42075218312382345, 0.4344290543188613, 0.449974712132672, 0.46442994428748176, 0.48001344648243166, 0.4938426317863536, 0.5093582706618721, 0.5237689630507625, 0.5394459740477283, 0.5546424697237023, 0.5698637040259712, 0.5855630132134406, 0.600332566697893, 0.615217860263855, 0.6309081862464957, 0.6461501295666687, 0.6605192109607726, 0.6766591661657727, 0.6920730011371587, 0.7071932654209703, 0.7227272824407751, 0.7372816248220275, 0.7522121570794437, 0.7674299676937272, 0.782012236678792, 0.7968797962214411, 0.8124359294465824, 0.8273497082376245, 0.8424847587133564, 0.857684159860188, 0.8725151738417382, 0.8875969298026478, 0.9022402579862036, 0.9170441965929327, 0.9321586277325488, 0.9468150407467058, 0.9613996091873623, 0.9761713172655128, 0.9901582872883885, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1] },
    //     { "name": "recall", "value": [0.20161715622677717, 0.21411384727419756, 0.2310499968311835, 0.24437384445342628, 0.25927364693296583, 0.2743889330455091, 0.28900733076720464, 0.3031582935992994, 0.3187422875666092, 0.33324105171771597, 0.34881822828100305, 0.3625161213053702, 0.3773403355248817, 0.3908984287503824, 0.4054954861979864, 0.421215922679265, 0.43520188966560485, 0.4497172588888282, 0.46430391188230615, 0.4797474658020582, 0.4942273991421589, 0.5096229795264873, 0.5238943917614692, 0.5395205930911214, 0.553793236016212, 0.5698116285039454, 0.5855624082941262, 0.6004195684768787, 0.615231378936278, 0.6311505396480844, 0.6461562091858281, 0.6603726882226674, 0.675664813181783, 0.6910760102038696, 0.706207176285679, 0.7224536840567044, 0.7370955894622196, 0.7518802026848484, 0.7675207129323393, 0.7814332162745324, 0.7964486195315484, 0.8117564051051943, 0.8271735401141515, 0.8423191582313874, 0.8566302486967982, 0.8724948580514134, 0.8873258417991631, 0.901855704031421, 0.9169872469115887, 0.9312727631251588, 0.9459681283981876, 0.9606117355115866, 0.9747655861315584, 0.989141064578603, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1] },
    //     { "name": "f1_score", "value": [0.10705997487559218, 0.12048279489694678, 0.135973571260244, 0.1498253244125151, 0.16467792336813073, 0.17987578419733794, 0.1943626751575466, 0.20864358204855608, 0.22419505201990296, 0.23867696404871977, 0.2532249518087977, 0.2679276322401437, 0.28251009116324726, 0.29701170589855793, 0.3113763268310842, 0.3266857043720166, 0.3411415334141465, 0.35543320550577396, 0.3699652905030488, 0.38482701322033496, 0.399529070091804, 0.4140762514844335, 0.4293256518309356, 0.4436721101861186, 0.45829586664621834, 0.4730410973632478, 0.4875102750651489, 0.5024755035192225, 0.5171166212368984, 0.5321180250845404, 0.5472815255200957, 0.5622479158852976, 0.5772856062285954, 0.5920619720119335, 0.6073356341626504, 0.6223447220453684, 0.6373321003838967, 0.6526101349736826, 0.6674686790807828, 0.6825221097559825, 0.6974054189268755, 0.7120627450228748, 0.7270116485889242, 0.742120567624124, 0.7570326282529476, 0.7720207220989242, 0.786771517054374, 0.8013707450576511, 0.8162810250712764, 0.8309673801235112, 0.846095146464368, 0.8608196355173062, 0.8757031363054794, 0.8908314304060685, 0.9055310290162064, 0.9205427710212916, 0.9351823269818026, 0.9498181073002797, 0.9645355808966507, 0.979606962137147, 0.9940903928085678, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1] }
    // ];
    // const {parameters} = props;

    return (
        <div className='analysis-container'>
            <Container>
                <Row className='mt-3'>
                    <h3>Analysis</h3>
                </Row>
                <Row>
                    {metrics.length > 0 && <Results metrics={metrics} parameters={parameters} /> }
                    <Container className="text-center my-5">
                        {isTraining && <div className="d-flex flex-column align-items-center">
                                            <Spinner animation="border" role="status" variant="secondary" style={{ width: '5rem', height: '5rem' }}>
                                                <span className="visually-hidden">Loading...</span>
                                            </Spinner>
                                            <p className="mt-3">Executing network, please wait...</p>
                                        </div>
                        }
                            
                                <p>No results to show:</p>
                                <p> Add an <em>Input node</em> and set up the parameters (click on the <Sliders /> tab in the left menu) in order to start training your network</p>
                            
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
            <h3>Training Results</h3>
            <Table striped hover variant='dark'>
                <tbody>
                    {metrics.map((metric) => (
                        <tr key={metric.name}>
                            <th>{metric.name.toUpperCase()}</th>
                            <td>{metric.value[metric.value.length-1]}</td>   
                        </tr>
                    ))}
                </tbody>
            </Table>

            <h3>Parameters</h3>
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
            

            <h3>Visualization</h3>
            <Plots metrics={metrics} />
        </Col>
    );
}

const Plots = (props) => {
    const {metrics} = props;
    const metricsPaired = {};
    metrics.forEach(item => {
        metricsPaired[item.name] = item.value;
    });

    const epochs = Array.from({ length: metricsPaired.loss.length }, (_, i) => i + 1);

    const precisionRecallData = {
        labels: ['Precision', 'Recall'],
        datasets: [{
            label: 'Precision / Recall',
            data: [metricsPaired.precision[0], metricsPaired.recall[0]],
            backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)'],
            borderColor: ['rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)'],
            borderWidth: 1
        }]
    };

    const lossEpochData = {
        labels: epochs,
        datasets: [{
            label: 'Loss vs Epochs',
            data: metricsPaired.loss,
            fill: false,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
        }]
    };

    const accuracyEpochData = {
        labels: epochs,
        datasets: [{
            label: 'Accuracy vs Epochs',
            data: metricsPaired.accuracy,
            fill: false,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
        }]
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
        }
    };

    return (
        <div>
            <div className='plot'>
                <h4>Precision / Recall</h4>
                <Line data={precisionRecallData} options={options} />
            </div>
            <div className='plot'>
                <h4>Loss vs Epochs</h4>
                <Line data={lossEpochData} options={options} />
            </div>
            <div className='plot' >
                <h4>Accuracy vs Epochs</h4>
                <Line data={accuracyEpochData} options={options} />
            </div>
        </div>
    );
}

export default Sidebar;
