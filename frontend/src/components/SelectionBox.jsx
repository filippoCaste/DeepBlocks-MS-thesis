'use strict';

import { Button, Container } from "react-bootstrap";
import { useReactFlow } from "reactflow";

export default function SelectionBox({selectedNodes, createSuperblock}) {

    const handleCreateSuperblock = () => {
        createSuperblock(selectedNodes)
        // message --> superblock succesfully created
    }

    // const handleDeleteNodes = () => {
    //     // ask for confirmation
    //     const reactflow = useReactFlow();
    //     reactflow.deleteElements(selectedNodes.map(e => e.id))
    // }

    return (
        <Container>
            <div className="selection-box">
                <p>The number of selected nodes is: {selectedNodes.length} </p> {'  '}
                <Button variant="primary" size="sm" onClick={() => handleCreateSuperblock()}>Group</Button> {'  '}
                {/* <Button variant="danger" size="sm" onClick={() => handleDeleteNodes()}>Delete</Button> */}
            </div>
        </Container>
    );

}