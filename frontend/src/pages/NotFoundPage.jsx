'use strict';
import React from 'react';
import { Link } from 'react-router-dom'; 
import { Container, Row, Col } from 'react-bootstrap';
import { ArrowRight, ExclamationCircleFill } from 'react-bootstrap-icons'; 

export default function NotFoundPage() {
    return (
        <Container fluid className="d-flex align-items-center justify-content-center vh-100 vw-100" style={{flex: 1}}>
            <Row>
                <Col className="text-center">
                    <ExclamationCircleFill size={80} color="warning" className="mb-4" />
                    <h1 className="display-4">Oops! Page Not Found</h1>
                    <p className="lead">
                        The page you are looking for doesn't seem to exist. Don't worry, we
                        can help you get back on track!
                    </p>
                    <Link to="/" className="btn btn-primary mt-3">
                        Go Home <ArrowRight className="ms-2" />
                    </Link>
                </Col>
            </Row>
        </Container>
    );
};
