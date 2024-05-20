'use strict';

import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button"

export default function AlertConfirmation(props) {
    const { title, message, onConfirm } = props;
    return (
        <Alert className='confirmation-alert' variant="primary" dismissible onClose={() => onConfirm(false)}>
            <Alert.Heading>{title}</Alert.Heading>
            <p>
                {message}
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="danger" onClick={() => onConfirm(true)}>Confirm</Button>
                <Button variant="secondary" onClick={() => onConfirm(false)}>Cancel</Button>
            </div>
        </Alert>
    );
}