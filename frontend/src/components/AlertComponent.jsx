'use strict';

import Alert from "react-bootstrap/Alert";

export default function AlertComponent({variant, message, setErr}) {

    return (
        <Alert variant={variant} dismissible onClose={() => setErr(false)}>
            {message}
        </Alert>
    );
}