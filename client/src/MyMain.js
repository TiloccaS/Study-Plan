import React from 'react';
import { useState } from 'react';
import { Container,Col,Row } from 'react-bootstrap';
import {Button,Collapse,Accordion} from 'react-bootstrap';
import {render} from 'react-dom';
import { BsFillPeopleFill } from 'react-icons/bs';

function MyMain(props) {
    let corsi = props.corsi;
    return (
   
                    
                        corsi.map((cs) => ( 

                            <Accordion key={cs.codice} > 
                             <Accordion.Item eventKey="0">

                            <Accordion.Header>
                            
                                <Container>      
                                    <Row key={cs.codice+cs.nome} >                          
                                <Col sm={3} >
                                    {cs.codice}
                                </Col>
                                <Col sm={7}>
                                  {cs.nome}
                                </Col>

                                <Col sm={1}>
                                    {cs.crediti} cfu
                                </Col>
                                <Col sm={1}>
                                <BsFillPeopleFill/>
                                  {cs.MaxStudenti!=undefined?cs.ActStudenti+"/"+cs.MaxStudenti:cs.ActStudenti                                 
                                  }
                                </Col>
                                </Row>
                                </Container>

                                </Accordion.Header>

                                <Accordion.Body>
                                 
                                    <p>
                                     {cs.Incompatibilita!=undefined? `Il corso presenta i seguenti esami incmpatibili:${cs.Incompatibilita}`
                                    :"Tutti gli esami sono compatibili a questo corso"}
                                    </p>
                                    <p>
                                        {cs.Propedeuticita!=undefined?`Il corso richiede la propedeuticità dei seguenti esami :${cs.Propedeuticita}`:
                                        "Il corso non ha nessun vincolo sulla propedeuticità" }
                                    </p>

                            

                     
                    </Accordion.Body>
                    </Accordion.Item>

                     </Accordion>

                        ))
               
    
    );
}/*

function ShowAll(props) {
    const [open, setOpen] = useState(false);

    return (
        <>
         
   
  <Accordion.Item eventKey="1">
    <Accordion.Header>Accordion Item #2</Accordion.Header>
    <Accordion.Body>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
      veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
      commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
      velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
      cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
      est laborum.
    </Accordion.Body>
  </Accordion.Item>
</Accordion>
        </>
    );


    render(<ShowAll />);
}*/
export default MyMain;