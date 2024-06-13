'use strict';

import Alert from "react-bootstrap/Alert";
import { Check2, XCircleFill, ExclamationCircleFill, InfoCircleFill } from "react-bootstrap-icons";
import { useEffect } from "react";

export default function ResponseMessage(props) {
    const message = props.message;
    const variant = props.variant;
    const setShowMessage = props.setShowMessage;

    useEffect(() => {
        if(variant !== 'danger') {
            const timer = setTimeout(() => {
                setShowMessage(false);
            }, 7000);
            
            return () => clearTimeout(timer);
        }
    }, []);
    
    return (
        <Alert variant={variant} style={{width: 'fit-content', maxWidth: '350px', marginBottom: '1em'}}dismissible onClose={() => setShowMessage(false)}>
            {variant === 'success' && <Check2 />}
            {variant === 'danger' && <XCircleFill /> }
            {variant === 'warning' && <ExclamationCircleFill />}
            {variant === 'info' && <InfoCircleFill />}
            
            {message}
        </Alert>
    );
}