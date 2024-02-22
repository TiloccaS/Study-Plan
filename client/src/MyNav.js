import { Navbar, Container, Form, FormControl, } from 'react-bootstrap'
import { BsFillBookFill, BsPersonCircle } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import React, { Component }  from 'react';

function MyNav() {
   const navigate =useNavigate();
    return (
        <Navbar className='navbar-dark bg-primary'>
            <Container fluid>
               <Navbar.Brand id="click" onClick={()=>navigate('/')}><BsFillBookFill /> Corsi</Navbar.Brand>
              
                <Navbar.Brand ><BsPersonCircle onClick={()=>navigate('/login') }/></Navbar.Brand>
            </Container>
        </Navbar>
    );
}

export default MyNav;