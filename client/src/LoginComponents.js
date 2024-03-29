import { Form, Button, Alert, Container, Row, Col } from 'react-bootstrap';
import { useState } from 'react';

function LoginForm(props) {
  const [username, setUsername] = useState('0001');
  const [password, setPassword] = useState('pw0');
  const [errorMessage, setErrorMessage] = useState('') ;
  
  const handleSubmit = (event) => {
      event.preventDefault();
      setErrorMessage('');
      const credentials = { username, password };
      
      // SOME VALIDATION, ADD MORE!!!
      let valid = true;
      if(username === '' || password === '')
          valid = false;
      
      if(valid)
      {
        props.login(credentials);
      }
      else {
        // show a better error message...
        setErrorMessage('Error(s) in the form, please fix it.')
      }
  };

  return (
      <Container>
        {props.message ? <Alert variant='danger' onClose={() => props.setMessage('')} dismissible>{props.message}</Alert> : false}
          <Row>

              <Col>
                  <h2>Login</h2>
                  <Form>
                      {errorMessage ? <Alert variant='danger'>{errorMessage}</Alert> : ''}
                      <Form.Group controlId='username'>
                          <Form.Label>Matricola</Form.Label>
                          <Form.Control type='text' value={username} onChange={ev => setUsername(ev.target.value)} />
                      </Form.Group>
                      <Form.Group controlId='password'>
                          <Form.Label>Password</Form.Label>
                          <Form.Control type='password' value={password} onChange={ev => setPassword(ev.target.value)} />
                      </Form.Group>
                      <Button type='submit' onClick={handleSubmit}>Login</Button>
                  </Form>
              </Col>
          </Row>
      </Container>
    )
}

function LogoutButton(props) {
  return(
    <Col>
      <span>User: {props.user?.name}</span>{' '}<Button variant="outline-primary" onClick={props.logout}>Logout</Button>
    </Col>
  )
}

export { LoginForm, LogoutButton }; 
