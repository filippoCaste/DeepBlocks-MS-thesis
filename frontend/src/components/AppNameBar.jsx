'use strict';

import Button from "react-bootstrap/Button";
import Pencil from 'react-bootstrap-icons/dist/icons/pencil'
import { useState } from "react";
import { Form } from "react-bootstrap";


export default function AppNameBar(props) {
    const {appName, setAppName} = props;
    const [isRename, setIsRename] = useState(false)
    const [newName, setNewName] = useState(appName)

    const handleAppRename = () => {
        setIsRename(false)
        setAppName(newName)
    }

    return <div className="app-name-bar">
        
        {isRename ? 
            <Form.Control style={{outline: 'none', width:'auto', backgroundColor:'transparent', fontSize: '18px', color:'white', border:'none', borderRadius:'0',borderBottom: '1px solid white'}} type='text' value={newName} onChange={(ev) => {setNewName(ev.target.value)}}></Form.Control>  
            
            : <h3>{appName}</h3> 
        }
        
        {isRename ?  <Button variant='secondary' onClick={() => handleAppRename()}>
                OK
        </Button>
               
            : <Button variant='secondary' onClick={() => setIsRename(true)}> <Pencil /> </Button> 
        
        }

    </div>
}