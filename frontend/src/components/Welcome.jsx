'use strict';
import Container from 'react-bootstrap/Container';
import PencilFill from 'react-bootstrap-icons/dist/icons/pencil-fill';
import QuestionCircle from 'react-bootstrap-icons/dist/icons/question-circle';
import Upload from 'react-bootstrap-icons/dist/icons/upload'

export default function Welcome({setOpenMenu}) {
    return <Container className='welcome'>
        <h1>Welcome to DeepBlocks!</h1>
        <p>If this is your first time with this application, you can click on the <button style={{backgroundColor: 'transparent', border: 'none', color: 'black'}} onClick={() => setOpenMenu('Help')}  ><QuestionCircle /></button> button on the left menu in order to open a quick guide.</p>
        <p>If you are looking for uploading an already existing JSON file with a DeepBlocks network, you can click on the <button style={{ backgroundColor: 'transparent', border: 'none', color: 'black' }} onClick={() => setOpenMenu('Upload')}  ><Upload /></button> button and choose your file.</p>
        <p>To add a block, click on the <button style={{ backgroundColor: 'transparent', border: 'none', color: 'black' }} onClick={() => setOpenMenu('Network Design')}  ><PencilFill /></button> icon and choose your first block!</p>
        
    </Container>
}