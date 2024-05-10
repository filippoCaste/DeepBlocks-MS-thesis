import Button from 'react-bootstrap/Button';
import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Download from 'react-bootstrap-icons/dist/icons/download'
import Pencil from 'react-bootstrap-icons/dist/icons/pencil'
import PlayFill from 'react-bootstrap-icons/dist/icons/play-fill'
import ListColumns from 'react-bootstrap-icons/dist/icons/list-columns'


const Sidebar = (props) => {

    const [openMenu, setOpenMenu] = useState('none');
    const nodes = props.nodes;

    return (
        <>
            <div className="sidebar">
                <ul className="sidebar-menu">
                    <li style={openMenu === 'Network Design' ? { backgroundColor: '#555' } : {}}>
                        <span onClick={() => {
                            openMenu === "Network Design" ? setOpenMenu('none') : setOpenMenu('Network Design')
                        }}> <Pencil style={{ height: '1.5rem', width: 'auto' }} /> </span>
                    </li>
                    <li style={openMenu === 'Network Details' ? { backgroundColor: '#555' } : {}}>
                        <span onClick={() => {
                            openMenu === "Network Details" ? setOpenMenu('none') : setOpenMenu('Network Details')
                        }}> <ListColumns style={{ height: '1.5rem', width: 'auto' }} /> </span>
                    </li>
                    <li style={openMenu === 'Training' ? { backgroundColor: '#555' } : {}}>
                        <span onClick={() => {
                            openMenu === "Training" ? setOpenMenu('none') : setOpenMenu('Training')
                        }}> <PlayFill style={{ height: '1.5rem', width: 'auto' }} /> </span>
                    </li>
                    <li style={openMenu === 'Options' ? { backgroundColor: '#555' } : {}}>
                        <span onClick={() => {
                            openMenu === "Options" ? setOpenMenu('none') : setOpenMenu('Options')
                        }}> <Download style={{ height: '1.5rem', width: 'auto' }} /> </span>
                    </li>
                </ul>
                <ul className="sidebar-menu" style={{ position: 'absolute', bottom: 0 }}>
                    <li>
                        <span>A</span>
                    </li>
                </ul>
            </div>
            {openMenu !== 'none' && <Menu setOpenMenu={setOpenMenu} openMenu={openMenu} nodes={nodes} />}
        </>
    );
};

const Menu = (props) => {
    const openMenu = props.openMenu;

    return (
        <Container className='left-menu'>
            <h4>{openMenu}</h4>
            <div>
            {openMenu === 'Network Design' && <NetworkDesign />}
            {openMenu === 'Network Details' && <NetworkDetails nodes={props.nodes}/>}
            {openMenu === 'Training' && <Training />}
            {openMenu === 'Options' && <Options />}
            </div>
        </Container>
    )
}

const NetworkDesign = () => {
    return (
        <>

        </>
    );
}

const NetworkDetails = (props) => {
    const nodes = props.nodes;

    return (
        <>
            {nodes.map((node) => {
                return <p>{node.data.label}</p>
            })}
        </>
    );
}

const handleTrain = () => {
    console.log("You successfully trained your network")
}

const Training = () => {
    return (
        <>
            <Button className='left-menu-button' onClick={() => handleTrain()}> Train </Button>
        </>
    );
}
const handleSave = () => {
    console.log("You successfully saved smth")
}

const handleLoad = () => {
    console.log("You successfully loaded smth")
}

const handleExport = () => {
    console.log("You successfully exported smth")
}

const Options = () => {
    return (
        <>
            <Button className='left-menu-button' onClick={() => handleSave()}> Save </Button> <br />
            <Button className='left-menu-button' onClick={() => handleLoad()}> Load </Button> <br />
            <Button className='left-menu-button' onClick={() => handleExport()}> Export </Button>
        </>
    )
}
export default Sidebar;
