import './App.css';
import { BrowserRouter as Router, Routes, Route, Outlet,useNavigate ,Navigate } from 'react-router-dom';
import { useState } from 'react';
import { Container,Form,Row,Col,Button,Alert } from 'react-bootstrap';
import MyNav from "./MyNav.js";
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component }  from 'react';
import PianoDiStudi from './PianoDiStudi';
import MyMain from './MyMain';
import API from './API.js'
import { useEffect } from 'react';
import {LoginForm,LogoutButton} from './LoginComponents'

function App() {
  return (
    <Router>
      <App2/>
    </Router>
   
  );
}

function App2(){
  
  
  const [Corsi,setCorsi]=useState([]);
  const [CorsiStudente,setCorsiStudente]=useState([]);
  const [loggedIn,setLoggedIn]=useState(false);
  const [studente,setStudente]=useState({});
  const [studenti,setStudenti]=useState({});
  const [message, setMessage] = useState('');

  const [messageCorrect,setMessageCorrect]=useState('');
  const [dirty,setDirty]=useState(true);
  let navigate = useNavigate();
  //aggiorno lo studente
  function updateStudent(studente){

    setStudente(studente);
      API.updateStudent(studente)
      .then(()=>{setDirty(true);
      navigate("/");})
      .catch(err=>setMessage('Database error while update student'));
  }
  const doLogin=(credentials)=>{
    API.logIn(credentials)
    .then(user=>{
      setLoggedIn(true);
      let studentetmp={Matricola:user.Matricola,
        Nome:user.Nome, Crediti:user.Crediti, FullTime:user.FullTime==null?undefined:user.FullTime}
        setStudente(studentetmp);    
        API.getAllCoursesForStudent(studente.Matricola).then(corsi=>{setCorsiStudente(corsi);}).catch(err=>setMessage("errore corsi studente"));
        navigate('/');
        setMessage('');


    })
    .catch(err=>setMessage(err));
  }
  function SortArray(x, y){
    if (x.nome < y.nome) {return -1;}
    if (x.nome > y.nome) {return 1;}
    return 0;
}

  useEffect(()=>{

    if(dirty){
    API.getAllCourses().
    then((corsi)=>{
      corsi=corsi.sort(SortArray);
      setCorsi(corsi);
     setDirty(false);
     setMessage('');

      
    }).
    catch(err=>setMessage('Database error while retrieving corsi'));}
    },[dirty]);
    

  /*  useEffect(()=>{
      if (Corsi.length && dirty) {
        API.getAllStudents()
          .then((students) => {
            setStudenti(students);
            setDirty(false);
          })
          .catch(err=>setMessage('Database error while retrieving students'))}

    },[Corsi.length,dirty])*/
    
    useEffect(()=>{
      if (dirty && loggedIn) {
        API.getAllCoursesForStudent(studente.Matricola)
          .then((corsi) => {
            setCorsiStudente(corsi);
            setDirty(false);
          })
          .catch(err=>setMessage('Database error while retrieving courses of student'))}

    },[dirty])

  async function getCoursesOfStudent(){
    await API.getAllCoursesForStudent(studente.Matricola)
    .then((corsi) => {
      setCorsiStudente(corsi);
     // setDirty(true);
    })
    .catch(err=>setMessage('Database error while retrieving courses of student'))}
   
    function eliminaPiano(){
      setCorsiStudente([]);

      API.eliminaPiano().then(()=>{
        let studentetmp={Matricola:studente.Matricola,
          Nome:studente.Nome, Crediti:0, FullTime:null}
          setStudente(studentetmp);    
          setDirty(true);
          navigate('/');  
          setMessageCorrect('Il piano di studi è stato eliminato correttamente');
      }).catch(err=>setMessage('Database error while deleting courses'));
    }
    function addCorsoForStudent(corsi){
      setCorsiStudente(corsi);
      API.addCorsoForStudent(corsi)
      .then(()=>{
        setDirty(true);
        let crediti=0;
        corsi.map((cs)=>crediti+=cs.Crediti);
      let studentetmp={Matricola:studente.Matricola,
      Nome:studente.Nome, Crediti:crediti, FullTime:studente.FullTime}
      setStudente(studentetmp);
      setMessageCorrect('Il piano di studi è stato salvato correttamente');

      })
      .catch(err=>setMessage('Database error while saving plan '));
    }
    const doLogOut = async () => {
      await API.logOut();
      setLoggedIn(false);
      setStudente({});
    }
  
  return (
      <Routes>
      <Route path="/" element={loggedIn?<PianoDiStudi getCoursesOfStudent={getCoursesOfStudent} eliminaPiano={eliminaPiano}logout={doLogOut} updateStudent={updateStudent} corsi={Corsi} setCorsi={setCorsi} studente={studente} setStudente={setStudente}corsiStudente={CorsiStudente} setCorsiStudente={setCorsiStudente}addCorso={addCorsoForStudent} messageCorrect={messageCorrect} setMessageCorrect={setMessageCorrect} message={message} setMessage={setMessage} />:<ListaCorsi message={message} setMessage={setMessage} corsi={Corsi} />} />
      <Route path='/login' element={<LoginForm login={doLogin} message={message} setMessage={setMessage}/>}/>
      </Routes>
  );
}
function ListaCorsi(props){
  return(
    <>
    {
      props.message? <><h4><font color="FF0000">Errore comunicazione con il server</font></h4>
      <h6> Qualcosa è andato storto con la comunicazione con il server</h6>
      </>
      :
      <>
      <MyNav/>

      <MyMain corsi={props.corsi}/>
      <Container fluid>
        <Outlet/>
      </Container>
      </>
    }
   </>
  );
}
export default App;
