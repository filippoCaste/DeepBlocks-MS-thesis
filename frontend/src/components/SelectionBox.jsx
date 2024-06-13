'use strict';

import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import AlertConfirmation from "./AlertConfirmation";
import { useState } from "react";
import { XCircle } from "react-bootstrap-icons";

export default function SelectionBox({selectedNodes, createSuperblock, addMessage, handleDeleteNodes, setNodes, nodes}) {

    const [showConfirmation, setShowConfirmation] = useState(false);

    const handleCreateSuperblock = () => {
        createSuperblock(selectedNodes)
        
        // message --> superblock succesfully created
        addMessage('Superblock succesfully created', "success")
    }

    const handleDelete = (result) => {
        // ask for confirmation
        if(result === true) {
            handleDeleteNodes(selectedNodes);
            addMessage(`${selectedNodes.length} nodes succesfully deleted`, "success")
        } else if(result === false) {
            addMessage('Delete operation canceled', "danger")
        }
        setShowConfirmation(false);
    }

    const handleCancel = () => {
        setNodes(nodes.map(e => selectedNodes.includes(e) ? { ...e, data: { ...e.data, isSelected: false } } : e))
    }

    return (
        <>
            <Container>
                <div className="selection-box">
                    <p>The number of selected nodes is: {selectedNodes.length} </p>
                    <Button variant="primary" size="sm" onClick={() => handleCreateSuperblock()}>Group</Button>
                    <Button variant="danger" size="sm" onClick={() => setShowConfirmation(true)}>Delete</Button>
                    <Button variant="secondary" size="sm" style={{
                        borderRadius: '50%',
                        padding: '0'
                    }} onClick={() => handleCancel()}><XCircle style={{ fontSize: '1.5rem' }} /></Button>
                </div>
            </Container>
            {showConfirmation && <AlertConfirmation title={"Delete nodes"} message={`Are you sure you want to delete these ${selectedNodes.length} nodes?`} onConfirm={handleDelete}/>}
        </>
    );

}