'use strict';

import Alert from "react-bootstrap/Alert";
import { Check2, XCircleFill, ExclamationCircleFill, InfoCircleFill } from "react-bootstrap-icons";
import { useEffect } from "react";

export default function ResponseMessage(props) {
    const message = props.message;
    const variant = props.variant;
    const setShowMessage = props.setShowMessage;

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowMessage(false);
        }, 7000);

        return () => clearTimeout(timer);
    }, []);
    
    return (
        <Alert variant={variant} style={{width: 'fit-content', zIndex:'1000', top:'6em', right:'0.5em', position:'fixed'}}dismissible onClose={() => setShowMessage(false)}>
            {message}
            {variant === 'success' && <Check2 />}
            {variant === 'error' && <XCircleFill /> }
            {variant === 'warning' && <ExclamationCircleFill />}
            {variant === 'info' && <InfoCircleFill />}
        </Alert>
    );
}