import { React, useState } from 'react';
import { Container, Form, Col, Row, Accordion, Button, Alert } from 'react-bootstrap';
import { BsFillPeopleFill } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import MyNav from "./MyNav.js";
function PianoDiStudi(props) {
    let corsi = props.corsi;
    const [errorMsg, setErrorMsg] = useState(props.message);
    let cfu=props.studente.Crediti;
    const [crediti, setCrediti] = useState(cfu);
    const [studente, setStudente] = useState(props.studente);
    function checkCorso(corso) {
        let x = "ok";//x stamperà l'errore corso
        let prop="";
      
        if (corso.Propedeuticita != null) 
        {
            prop = corso.Propedeuticita.replace(" ", "");//replace perchè a volte capitava che il DB salvava il codice del corso incompatibile con uno spazio
        }
        if (props.corsiStudente.map
            ((cs) => {
                if (cs.Incompatibilita != null) {
                    if (cs.Incompatibilita.includes(corso.codice)) {
                        x = "il corso è incompatibile con uno fra quelli dello studente";
                    }
                }

            }
            ))
            if (props.corsiStudente.filter(cs => cs.codice == corso.codice).length > 0) {
                x = "Il corso è gia presente nel piano di studi";
            }
        if (props.corsiStudente.filter(cs => cs.codice == prop).length == 0 && corso.Propedeuticita != null) {
            x = `Il corso richiede la presenza del seguente corso ${corso.Propedeuticita}`;
        }
        if (studente.FullTime == 1) {
            if (crediti + corso.crediti > 80) {
                x = 'Attenzione il numero massimo di crediti insribili per piano di studi è 80'
            }
        }
        else if (studente.FullTime == 0) {
            if (crediti + corso.crediti > 40) {
                x = 'Attenzione il numero massimo di crediti insribili per piano di studi è 40'
            }
        }
        if (corso.MaxStudenti != null) {
            if (corso.ActStudenti >= corso.MaxStudenti) {
                x = `il corso ${corso.codice} ha già il numero massimo di studenti`
            }
        }
       return x;
    }

    function AddExam(corso) {
        if (props.studente.FullTime != undefined) {
            let controllo = "ok";//checkCorso(corso);
            controllo = checkCorso(corso);
            if (controllo == "ok") 
            {
                setCrediti(crediti + corso.crediti);
                props.setCorsiStudente(corsiStudente => [...corsiStudente, corso]);
            }
            else 
            {
                setErrorMsg(controllo);
            }
        }
        else
       {
            setErrorMsg("Devi prima selezionare creare un piano di studi");
        }

    }
    return (<>
       {errorMsg ? <Alert variant='danger' onClose={() => setErrorMsg('')} dismissible>{errorMsg}</Alert> : false}
       {props.messageCorrect ? <Alert variant='success' onClose={() => props.setMessageCorrect('')} dismissible>{props.messageCorrect}</Alert> : false}
        <MyNav />
        {
            props.studente.FullTime == undefined ? <CreatePianoForStudent studente={studente} setStudente={setStudente} updateStudent={props.updateStudent} /> : <SetPianoStudi getCoursesOfStudent={props.getCoursesOfStudent} eliminaPiano={props.eliminaPiano} logout={props.logout} corsi={corsi} corsiStudente={props.corsiStudente} addCorsiForsStudent={props.addCorso} studente={studente} setStudente={props.setStudente} crediti={crediti} setCrediti={setCrediti} errorMsg={errorMsg} setErrorMsg={setErrorMsg} setCorsiStudente={props.setCorsiStudente} />
            //ho due funzioni diverse una per la creazione del piano di studi e una per l'aggiunta/modifica deicorsi 
        }
        <h3>Corsi Proposti:</h3>
        {
             corsi.map((cs) => (
                <Row key={cs.codice}>

                    <Col sm={11}>
                        <Accordion  >
                            <Accordion.Item eventKey="0" >

                                <Accordion.Header  >

                                    <Container style={{ color: checkCorso(cs) != "ok" ? "red" : "" }}>
                                        <Row >
                                            <Col sm={3} >
                                                {cs.codice}
                                            </Col>
                                            <Col sm={6}>
                                                {cs.nome}
                                            </Col>

                                            <Col sm={1}>
                                                {cs.crediti}cfu
                                            </Col>
                                            <Col sm={1}>
                                                <BsFillPeopleFill />
                                                {cs.MaxStudenti != undefined ? cs.ActStudenti + "/" + cs.MaxStudenti : cs.ActStudenti
                                                }
                                            </Col>

                                        </Row>
                                    </Container>

                                </Accordion.Header>
                                <Accordion.Body>

                                    <p>
                                        {cs.Incompatibilita != undefined ? `Il corso presenta i seguenti esami incmpatibili:${cs.Incompatibilita}`
                                            : "Tutti gli esami sono compatibili a questo corso"}
                                    </p>
                                    <p>
                                        {cs.Propedeuticita != undefined ? `Il corso richidete la propedeuticità dei seguenti esami :${cs.Propedeuticita}` :
                                            "Il corso non ha nessun vincolo sulla propedeuticità"}
                                    </p>
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    </Col>
                    <Col sm={1}>
                        <Button onClick={() => AddExam(cs)} >Add</Button>
                    </Col>
                </Row>
            ))}
  </>);



}
function CreatePianoForStudent(props) {
    //const studente=props.studente;
    const [FullTime, setFullTime] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        const newStudent = { Matricola: props.studente.Matricola, Nome: props.studente.Nome, Crediti: props.studente.Crediti, FullTime: FullTime ? 1 : 0 }
        props.setStudente(newStudent);
        props.updateStudent(newStudent);
        navigate('/');
    }

    return (<>
        <h2>Creazione Piano di Studi</h2>
        <h3>Benvenuto {props.studente.Nome}</h3>
        <Form.Label>Se desideri creare un piano di studi Full Time spunta la casella, in alternativa verrà creato automaticamente Part Time:</Form.Label>
        <Form.Group className="mb-3" controlId="formBasicCheckbox">
        <Form.Check type="checkbox" value={props.studente.FullTime} onChange={ev => { setFullTime(!FullTime) }} checked={FullTime ? true : false} />
        </Form.Group>
        <Container fluid ><Row ><Col md={9}></Col><Col md="1" xs='3'><Button variant="primary" onClick={handleSubmit}>Save</Button></Col></Row><br />
        </Container>
    </>
    );
}
function SetPianoStudi(props) {
    const navigate = useNavigate();
    const [crediti,setCrediti]=useState(props.crediti);
    
    const removePiano = (event) => 
    {
        props.setCrediti(0);
        props.eliminaPiano();
    }
    const handleSubmit = (event) => {
        if (props.studente.FullTime == 1) {
            if (props.crediti < 60)
            {
                props.setErrorMsg("Nel piano di studi devono essere presenti almeno 60 crediti");
            }
            else 
            {
                props.addCorsiForsStudent(props.corsiStudente);
                navigate('/');
            }
        }
        else
         {
            if (props.crediti < 20) {
                props.setErrorMsg("Nel piano di studi devono essere presenti almeno 20 crediti");
            }
            else
             {
                props.addCorsiForsStudent(props.corsiStudente);
                navigate('/');
            }

        }
    }
    const annulla  = async (event) => 
    {    
            let crediti2=0;    
           await props.getCoursesOfStudent();
            props.corsiStudente.map((cs)=>(crediti2+=cs.crediti));
            setCrediti(crediti2);
    }
    function CheckRemove(corso) {
        let x = "ok";
        let vettore = [];
        corsi.map(cs => {
            if (cs.Propedeuticita == corso.codice) {
                x = "Non puoi eliminare questo corso, in quanto è richiesto per uno dei tuoi insegnamenti";
            }
        }
        );
        if (x == "ok") {
            corsi.map(cs => {
                if (cs.codice != corso.codice) {
                    vettore.push(cs);
                }
            })
            props.setCrediti(props.crediti - corso.crediti);
            props.setCorsiStudente(vettore);

        }
        else {
            props.setErrorMsg(x);
        }

        return x;
    }
    let corsi = props.corsiStudente;

    return (
        <div>
            <h2>Benvenuto {props.studente.Nome}</h2>

            {

                props.corsiStudente.map((cs) => (
                    <Row key={cs.codice}>
                        <Col sm={11}>

                            <Accordion key={cs.codice} >
                                <Accordion.Item eventKey="0">
                                    <Accordion.Header >
                                        <Container>
                                            <Row >
                                                <Col sm={3} >
                                                    {cs.codice}
                                                </Col>
                                                <Col sm={6}>
                                                    {cs.nome}
                                                </Col>

                                                <Col sm={1}>
                                                    {cs.crediti} cfu
                                                </Col>
                                                <Col sm={1}>
                                                    <BsFillPeopleFill />
                                                    {cs.MaxStudenti != undefined ? cs.ActStudenti + "/" + cs.MaxStudenti : cs.ActStudenti
                                                    }
                                                </Col>
                                          </Row>
                                        </Container>

                                    </Accordion.Header>
                                    <Accordion.Body>

                                        <p>
                                            {cs.Incompatibilita != null ? `Il corso presenta i seguenti esami incmpatibili:${cs.Incompatibilita}`
                                                : "Tutti gli esami sono compatibili a questo corso"}
                                        </p>
                                        <p>
                                            {cs.Propedeuticità != null ? `Il corso richiede la propedeuticità dei seguenti esami :${cs.Propedeuticità}` :
                                                "Il corso non ha nessun vincolo sulla propedeuticità"}
                                        </p>

                                 </Accordion.Body>
                                </Accordion.Item>

                            </Accordion>
                        </Col>
                        <Col>
                            <Button className='btn btn-danger' onClick={() => CheckRemove(cs)}>Delete</Button>
                        </Col>
                    </Row>


                ))
            }
            <h4>{props.crediti}/{props.studente.FullTime == 1 ? 80 : 40}</h4>
            <h6>Crediti minimi selezionabili: {props.studente.FullTime == 1 ? 60 : 20}</h6>
            <h6>Crediti massimi selezionabili: {props.studente.FullTime == 1 ? 80 : 40}</h6>
            <h6>Crediti attuali: {props.crediti}</h6>


            <Button onClick={handleSubmit}>Save</Button>
            <Button variant="outline-primary" onClick={props.logout}>Logout</Button>
            <Button className='btn btn-danger' onClick={removePiano}>Elimina Piano</Button>
            <Button variant='secondary' onClick={annulla}>Annulla</Button>


        </div>
    );

}
export default PianoDiStudi;