'use strict';

import { useState } from "react";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

export default function NodeInfoBar(props) {

    const node = props.nodeInfo;

    const [selectedTab, setSelectedTab] = useState('Parameters');
    const [layerType, setLayerType] = useState(null);

    const topBarOptions = ['Parameters', 'Info']

    const handleTopBarClick = (e) => {
        if(e === 'Parameters') {
            setSelectedTab('Parameters');

        } else if(e === 'Info') {
            setSelectedTab('Info');
        }
    }

    const setParameterValue = (name, value) => {
        console.log(name, value)
        if(name === 'layer_type') {
            setLayerType(value);
        }
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
                {selectedTab === 'Parameters' && <ParametersTab node={node} setParameterValue={setParameterValue} layerType={layerType} />}
                {selectedTab === 'Info' && <InfoTab node={node} />}
            </div>
        </div>
    )
}

function ParametersTab(props) {
    const { node, layerType } = props;

    return (
        <Container>
            <Row style={{justifyContent: 'space-between'}}>
                <Col md={4}>
                    {node.parameters.filter(e => e.name !== 'layer_type').map(e => {
                        return <FormInput key={"node-"+node.id+"-"+e.name} name={e.name} value={e.value} description={e.description} setParameterValue={props.setParameterValue}/>
                    })}
                </Col>
                <Col md={4}>
                    <Row className="mb-3" style={{ justifyContent: 'space-between' }}>
                        <Col md={7}>
                            <p>LAYER TYPE</p>
                            <Form.Group onChange={(e) => props.setParameterValue("layer_type", e.target.value)}>
                                <Form.Check
                                    type={'radio'}
                                    name='layerType'
                                    value="2dconv"
                                    label={"2D Convolution"}
                                    id={`2dconv-${node.id}`}
                                />

                                <Form.Check
                                    type={'radio'}
                                    value="fc"
                                    name='layerType'
                                    label={"Fully Connected"}
                                    id={`fc-${node.id}`}
                                />

                                <Form.Check
                                    type={'radio'}
                                    value={null}
                                    name='layerType'
                                    label={"None"}
                                    id={`none-${node.id}`}
                                />
                            </Form.Group>

                            {layerType === '2dconv' && <div className="mt-3"> <FormInput key={"node-" + node.id + "-kernel_size"} name="kernel_size" value={null} description="Size of the convolving kernel" setParameterValue={props.setParameterValue} /> </div>}

                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    )
}

function FormInput(props) {

    const { name, value, description, setParameterValue } = props;

    return (
        <Row className="mb-3" style={{justifyContent: 'space-between', verticalAlign: 'middle'}}>
            <Col md={1}>
                <Form.Label>{name}</Form.Label>
            </Col>
            {/* <Col md={`${name==='input_file' ? 4 : 3}`}> */}
            <Col md={4}>
                <Form.Group >
                    <Form.Control
                        defaultValue={value!='null' ? value : ''}
                        type={`${name==='input_file' ? 'file' : 'text'}`}
                        onChange={name==='input_file' ? (ev) => setParameterValue(name, ev.target.files[0]) : (ev) => setParameterValue(name, ev.target.value)}
                        style={{ width: '100%' }}
                    />
                </Form.Group>
            </Col>
            {/* <Col md={3}>
                <Form.Label>{description}</Form.Label>
            </Col> */}
        </Row>
    );
}

function InfoTab(props) {
    const { node } = props;
    return (
        <p> This node is a {node.type} </p>
    )
}