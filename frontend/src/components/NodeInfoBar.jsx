'use strict';

import { useState } from "react";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

export default function NodeInfoBar(props) {

    const [selectedTab, setSelectedTab] = useState('Parameters');

    const node = props.nodeInfo;

    const topBarOptions = ['Parameters', 'Info']

    const handleTopBarClick = (e) => {
        if(e === 'Parameters') {
            setSelectedTab('Parameters');

        } else if(e === 'Info') {
            setSelectedTab('Info');

        }
    }

    const setParameterValue = (name, value) => {
        node.parameters.filter(e => e.name === name)[0].value = value
    }

    return (
        <div className="nodeInfo-bar">
            <div className="top-bar">
                {topBarOptions.map(e => <p className={`${selectedTab === e ? 'tab-content selected' : 'tab-content'}`} key={e} onClick={() => handleTopBarClick(e)}>{e}</p>)}
                <p className="tab-content" onClick={() => props.handleCloseNodeInfo()} style={{
                    position: 'absolute',
                    right: '0px',
                    cursor: 'pointer',
                    fontSize: '17px',
                    fontWeight: 'bold',
                }}>X</p>
            </div>
            <div>
                {selectedTab === 'Parameters' && <ParametersTab node={node} setParameterValue={setParameterValue} />}
                {selectedTab === 'Info' && <InfoTab node={node} />}
            </div>
        </div>
    )
}

function ParametersTab(props) {
    const { node } = props;

    return (
        <Container>

            {node.parameters.map(e => {
                return <FormInput key={"node-"+node.id+"-"+e.name} name={e.name} value={e.value} description={e.description} setParameterValue={props.setParameterValue}/>
            })}

        </Container>
    )
}

function FormInput(props) {

    const { name, value, description, setParameterValue } = props;



    return (
        <Row className="mb-3">
            <Col md={3}>
                <Form.Label>{name}</Form.Label>
            </Col>
            <Col md={1}>
                <Form.Group >
                    <Form.Control
                        defaultValue={value!='null' ? value : ''}
                        type="text"
                        onChange={(ev) => setParameterValue(name, ev.target.value)}
                        style={{ width: '100%' }}
                    />
                </Form.Group>
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