'use strict';

import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import AlertConfirmation from "./AlertConfirmation";
import { useState } from "react";

export default function SelectionBox({selectedNodes, createSuperblock, setVariant, setMessage, setShowMessage, handleDeleteNodes}) {

    const [showConfirmation, setShowConfirmation] = useState(false);

    const handleCreateSuperblock = () => {
        createSuperblock(selectedNodes)
        
        // message --> superblock succesfully created
        setVariant('success')
        setMessage('Superblock succesfully created')
        setShowMessage(true)
    }

    const handleDelete = async (result) => {
        // ask for confirmation
        if(result === true) {
            handleDeleteNodes(selectedNodes);
            setVariant('success');
            setMessage(`${selectedNodes.length} nodes succesfully deleted`);
            setShowMessage(true);
        } else if(result === false) {
            setVariant('danger');
            setMessage('Delete operation canceled');
            setShowMessage(true);
        }
        setShowConfirmation(false);
    }

    return (
        <>
            <Container>
                <div className="selection-box">
                    <p>The number of selected nodes is: {selectedNodes.length} </p>
                    <Button variant="primary" size="sm" onClick={() => handleCreateSuperblock()}>Group</Button>
                    <Button variant="danger" size="sm" onClick={() => setShowConfirmation(true)}>Delete</Button>
                </div>
            </Container>
            {showConfirmation && <AlertConfirmation title={"Delete nodes"} message={`Are you sure you want to delete these ${selectedNodes.length} nodes?`} onConfirm={handleDelete}/>}
        </>
    );

}