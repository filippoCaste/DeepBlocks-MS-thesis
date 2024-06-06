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

    const [selectedTab, setSelectedTab] = useState('Parameters');
    const [msg, setMsg] = useState(null);
    const [variant, setVariant] = useState(null);
    const [showMessage, setShowMessage] = useState(false);

    const topBarOptions = ['Parameters', 'Info']

    const handleTopBarClick = (e) => {
        if(e === 'Parameters') {
            setSelectedTab('Parameters');

        } else if(e === 'Info') {
            setSelectedTab('Info');
        }
    }

    const setParameterValue = (name, value) => {
        // if(name === 'dataset_type' && (value !== 'image' || value !== 'text')) {
        //     setMsg("Dataset type must be 'image' or 'text'")
        //     setVariant("danger")
        //     setShowMessage(true)
        //     return ;
        // }
        node.parameters.filter(e => e.name === name)[0].value = value
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
            </div>
            {showMessage && <AlertComponent message={msg} variant={variant} setErr={setShowMessage} />}
        </div>
    )
}

function ParametersTab(props) {
    const { node } = props;
    const [layerType, setLayerType] = useState(node.parameters[0].name === 'layer_type' ? node.parameters[0].value : 'null');
    const [datasetType, setDatasetType] = useState(node.parameters[0].name === 'dataset_type' ? node.parameters[0].value : 'null');

    const setParameterLayerType = (value) => {
        setLayerType(value)
        props.setParameterValue("layer_type", value)
    }

    const setParameterDatasetType = (value) => {
        setDatasetType(value)
        props.setParameterValue("dataset_type", value)
    }

    return (
        <Container>
            <Row style={{justifyContent: 'space-between'}}>
                <Col md={4}>
                    {node.parameters.filter(e => e.name !== 'layer_type' && e.name !== 'dataset_type').map(e => {
                        return <FormInput key={"node-"+node.id+"-"+e.name} node={node} name={e.name} value={e.value} description={e.description} setParameterValue={props.setParameterValue}/>
                    })}
                </Col>
                <Col md={4}>
                    {node.parameters[0].name === 'layer_type' && <Row className="mb-3" style={{ justifyContent: 'space-between' }}>
                            <Col md={7}>
                                <p>LAYER TYPE</p>
                                <Form.Group>
                                    <Form.Check
                                        type='radio'
                                        id={`2dconv-${node.id}`}
                                        label='2D Convolution'
                                        name='layerType'
                                        value='2dconv'
                                        checked={layerType === '2dconv'}
                                        onChange={(e) => setParameterLayerType(e.target.value)}
                                    />

                                    <Form.Check
                                        type='radio'
                                        id={`fc-${node.id}`}
                                        label='Fully Connected'
                                        name='layerType'
                                        value='fc'
                                        checked={layerType === 'fc'}
                                        onChange={(e) => setParameterLayerType(e.target.value)}
                                    />

                                    <Form.Check
                                        type='radio'
                                        id={`none-${node.id}`}
                                        label='None'
                                        name='layerType'
                                        value={'null'}
                                        checked={layerType !== 'fc' && layerType !== '2dconv'}
                                        onChange={(e) => setParameterLayerType(null)}
                                    />
                                </Form.Group>
                                {layerType === '2dconv' && <div className="mt-3"> <FormInput key={"node-" + node.id + "-kernel_size"} node={node} name="kernel_size" value={null} description="Size of the convolving kernel" setParameterValue={props.setParameterValue} /> </div>}
        
                            </Col>
                        </Row>
                    }


                    {node.parameters[2].name === 'dataset_type' && <Row className="mb-3" style={{ justifyContent: 'space-between' }}>
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
                                    onChange={(e) => setDatasetType(e.target.value)}
                                />
                                <Form.Check
                                    type='radio'
                                    id={`text-${node.id}`}
                                    label='Text'
                                    name='datasetType'
                                    value='text'
                                    checked={datasetType === 'text'}
                                    onChange={(e) => setDatasetType(e.target.value)}   
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
            {/* <Col md={`${name==='input_file' ? 4 : 3}`}> */}
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
        <p> This node is a {node.type} </p>
    )
}