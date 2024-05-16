'use strict';

import { useState } from "react";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

export default function NodeInfoBar(props) {

    const [selectedTab, setSelectedTab] = useState('Parameters');
    const [inputDimension, setInputDimension] = useState(0);
    const [outputDimension, setOutputDimension] = useState(0);

    const node = props.nodeInfo;

    const topBarOptions = ['Parameters', 'Info']

    const handleTopBarClick = (e) => {
        if(e === 'Parameters') {
            setSelectedTab('Parameters');

        } else if(e === 'Info') {
            setSelectedTab('Info');

        }
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
                {selectedTab === 'Parameters' && <ParametersTab inputDimension={inputDimension} outputDimension={outputDimension}
                                                     setInputDimension={setInputDimension} setOutputDimension={setOutputDimension} />}
                {selectedTab === 'Info' && <InfoTab inputDimension={inputDimension} outputDimension={outputDimension}
                                                     setInputDimension={setInputDimension} setOutputDimension={setOutputDimension}
                                                     node={node} />}
            </div>
        </div>
    )
}

function ParametersTab(props) {
    const { inputDimension, setInputDimension, outputDimension, setOutputDimension } = props
    return (
        <Container>

            <Row className="mb-3">
                <Col md={3}>
                    <Form.Label>Input dimension</Form.Label>
                </Col>
                <Col md={1}>
                    <Form.Control
                        value={inputDimension || ''}
                        type="text"
                        onChange={(ev) => setInputDimension(ev.target.value)}
                        style={{ width: '100%' }}
                    />
                </Col>
            </Row>
            <Row className="mb-3">
                <Col md={3}>
                    <Form.Label>Output dimension</Form.Label>
                </Col>
                <Col md={1}>
                    <Form.Control
                        value={outputDimension || ''}
                        type="text"
                        onChange={(ev) => setOutputDimension(ev.target.value)}
                        style={{ width: '100%' }}
                    />
                </Col>
            </Row>

        </Container>
    )
}

function InfoTab(props) {
    const { node } = props;
    return (
        <p> This node is a {node.type} </p>
    )
}