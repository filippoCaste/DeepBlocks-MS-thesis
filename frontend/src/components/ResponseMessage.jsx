'use strict';

import Alert from "react-bootstrap/Alert";
import { Check2, XCircleFill, ExclamationCircleFill, InfoCircleFill } from "react-bootstrap-icons";

export default function ResponseMessage(props) {
    const message = props.message;
    const variant = props.variant;
    const setShowMessage = props.setShowMesssage;
    
    return (
        <div className="response-message-container">
            <Alert variant={variant} style={{width: 'fit-content', zIndex:'1000', left:'0.5em', top:'0.5em'}}dismissible onClose={() => setShowMessage(false)}>
                {message}
                {variant === 'success' && <Check2 />}
                {variant === 'error' && <XCircleFill /> }
                {variant === 'warning' && <ExclamationCircleFill />}
                {variant === 'info' && <InfoCircleFill />}
            </Alert>
        </div>
    );
}