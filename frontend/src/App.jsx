import React from 'react';
import Sidebar from './components/Sidebar';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import MainContent from './components/MainContent';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


export default function App() {
  return (
    <div className='app-container' style={{ display: 'flex' }}>
      <Sidebar />
      <MainContent style={{ flex:1 }}/>
    </div>
  );
}