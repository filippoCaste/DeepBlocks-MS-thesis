'use strict';

import { useState } from "react";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { InfoCircle } from "react-bootstrap-icons";
import AlertComponent from "./AlertComponent";

export default function NodeInfoBar(props) {

    const node = props.nodeInfo;
    const {errNode, errNodeMsg} = props;

    const [selectedTab, setSelectedTab] = useState('Parameters');
    const [msg, setMsg] = useState(null);
    const [variant, setVariant] = useState(null);
    const [showMessage, setShowMessage] = useState(false);

    const topBarOptions = ['Parameters', 'Info']
    if (errNode && errNode.id == node.id) {
        topBarOptions.push('Error')
    }

    const handleTopBarClick = (e) => {
        if(e === 'Parameters') {
            setSelectedTab('Parameters');
        } else if(e === 'Info') {
            setSelectedTab('Info');
        } else if(e === 'Error') {
            setSelectedTab("Error")
        }
    }

    const setParameterValue = (name, value) => {
        props.setNodes(prevNodes => [...prevNodes.map(n => n.id === node.id ? {...n, parameters: n.parameters.map(e => e.name === name ? {...e, value} : e )} : n)]);
    }

    return (
        <div className="nodeInfo-bar">
            <div className="top-bar-nodeInfo">
                {topBarOptions.map(e => <p className={`${selectedTab === e ? 'tab-content selected' : 'tab-content'}`} key={e} onClick={() => handleTopBarClick(e)}>{e}</p>)}
                <p className="tab-content" onClick={() => props.handleCloseNodeInfo()} style={{
                    position: 'absolute',
                    right: '0px',
                    cursor: 'pointer',
                    fontSize: '17px',
                    fontWeight: 'bold',
                }}>X</p>
            </div>
            <div style={{ overflowY: 'auto' }}>
                {selectedTab === 'Parameters' && <ParametersTab node={node} setParameterValue={setParameterValue} />}
                {selectedTab === 'Info' && <InfoTab node={node} />}
                {selectedTab === 'Error' && <ErrorTab errNodeMsg={errNodeMsg} />}
            </div>
            {showMessage && <AlertComponent message={msg} variant={variant} setErr={setShowMessage} />}
        </div>
    )
}

function ParametersTab(props) {
    const { node } = props;
    const [datasetType, setDatasetType] = useState(node.parameters.length > 1 && node.parameters[1].name === 'dataset_type' ? node.parameters[1].value : 'null');

    const setParameterDatasetType = (value) => {
        setDatasetType(value)
        props.setParameterValue("dataset_type", value)
    }

    const special = ["torch.add", "torch.mul", "torch.div", "torch.sub", "torch.cat", "split"]

    return (
        <Container>
            <Row style={{justifyContent: 'space-between'}}>
                {node.parameters.length === 0 && special.includes(node.fn) ? <Col md={4}> 
                    <p>You can connect up to 2 blocks to this node.</p>
                </Col> 
                :
                <Col md={4}>
                    {node.parameters.filter(e => e.name !== 'layer_type' && e.name !== 'dataset_type').map(e => {
                        return <FormInput key={"node-"+node.id+"-"+e.name} node={node} name={e.name} value={e.value} description={e.description} setParameterValue={props.setParameterValue}/>
                    })}
                </Col>
                }
                <Col md={4}>
                    {node.parameters.length > 1 && node.parameters[1].name === 'dataset_type' && <Row className="mb-3" style={{ justifyContent: 'space-between' }}>
                        <Col md={7}>
                            <p>DATASET TYPE</p>
                            <Form.Group>
                                <Form.Check
                                    type='radio'
                                    id={`image-${node.id}`}
                                    label='Image'
                                    name='datasetType'
                                    value='image'
                                    checked={datasetType === 'image'}
                                    onChange={(e) => setParameterDatasetType(e.target.value)}
                                />
                                <Form.Check
                                    type='radio'
                                    id={`text-${node.id}`}
                                    label='Text'
                                    name='datasetType'
                                    value='text'
                                    checked={datasetType === 'text'}
                                    onChange={(e) => setParameterDatasetType(e.target.value)}   
                                />
                            </Form.Group>
                        </Col>
                    </Row>}
                </Col>
            </Row>
        </Container>
    )
}

function FormInput(props) {

    const { node, name, value, description, setParameterValue } = props;

    return (
        <Row className="mb-3" style={{justifyContent: 'space-between', verticalAlign: 'middle'}}>
            <Col md={1}>
                <Form.Label>{name}</Form.Label>
            </Col>
            <Col md={5}>
                <Form.Group >
                    <Form.Control
                        id={`node-${node.id}-${name}`}
                        defaultValue={value!='null' ? value : ''}
                        type={`${name==='input_file' ? 'file' : 'text'}`}
                        onChange={name==='input_file' ? (ev) => setParameterValue(name, ev.target.files[0]) : (ev) => setParameterValue(name, ev.target.value)}
                        style={{ width: '100%' }}
                    />
                </Form.Group>
            </Col>
            <Col md={1}>
                <OverlayTrigger
                    placement="top"
                    overlay={
                        <Tooltip id={`tooltip-${node.id}`}>
                            {description}
                        </Tooltip>
                    }
                >
                    <InfoCircle />
                </OverlayTrigger>
            </Col>
        </Row>
    );
}

function InfoTab(props) {
    const { node } = props;
    return (
        <Container>
            <p>{node.description} </p>
        </Container>
    )
}

function ErrorTab(props) {
    return <Container><h3>Error while forwarding the block:</h3><p>{props.errNodeMsg}</p></Container>
}
