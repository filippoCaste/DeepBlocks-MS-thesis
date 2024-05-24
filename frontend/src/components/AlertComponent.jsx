'use strict';

import Alert from "react-bootstrap/Alert";

export default function AlertComponent({variant, message, setErr}) {

    return (
        <Alert className="mt-3" variant={variant} dismissible onClose={() => setErr(false)}>
            {message}
        </Alert>
    );
}