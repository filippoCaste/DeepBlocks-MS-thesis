'use strict';

import Alert from "react-bootstrap/Alert";
import { Check2, XCircleFill, ExclamationCircleFill, InfoCircleFill, Link45deg } from "react-bootstrap-icons";
import { useEffect } from "react";

export default function ResponseMessage(props) {
    let message = String(props.message);
    const variant = props.variant;
    const setShowMessage = props.setShowMessage;
    let link = null;
    let suggestion = null;
    
    if(variant === 'danger') {
        if(message.split('<a href=').length > 1) {
            let split_msg = message.split('<a href=')
            message = split_msg[0].replace("\"", " ");
            link = split_msg[1].split(' />')[0];
        }

        if (message.split('Suggestion:').length > 1) {
            let split_msg = message.split('Suggestion:');
            message = split_msg[0];
            suggestion = split_msg[1];
        }
    }


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
            {' '}
            {message} <br />
            {suggestion && variant === 'danger' && (
                <>
                    <br />
                    Suggestion: <br />
                    {suggestion}
                </>
            )}
            {link && variant === 'danger' && (
                <>
                    <br /> <br />
                    StackOverflow response: <br />
                    <a href={link} target="_blank"> <Link45deg /> Check on StackOverflow</a>  
                </>
            )}
        </Alert>
    );
}