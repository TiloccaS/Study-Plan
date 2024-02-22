const APIURL = new URL('http://localhost:3001/api/');  // Do not forget '/' at the end
async function getAllCourses(){
    const response=await fetch('http://localhost:3001/api/courses');
    const CorsiJson=await response.json();
    if(response.ok){
        return CorsiJson.map((e) => ({ codice: e.CodiceCorso, nome: e.Nome, crediti: e.Crediti , ActStudenti:e.ActStudenti,MaxStudenti: e.MaxStudenti, Incompatibilita: e.Incompatibilità, Propedeuticita:e.Propedeuticità})) 
    }
    else{
        throw CorsiJson;
    }
    }
    
    
      
    async function getAllStudents() {
      // call: GET /api/exams
      const response = await fetch(new URL('students', APIURL), {credentials: 'include'});
      const studentsJson = await response.json();
      if (response.ok) {
        return studentsJson.map((st) => ({ Matricola: st.Matricola, Nome: st.Nome, Crediti: st.Crediti, FullTime: st.FullTime }));
      } else {
        throw studentsJson;  // an object with the error coming from the server
      }
    }
    async function getStudent() {
      const response = await fetch(new URL('student', APIURL), {credentials: 'include'});
      const studentsJson = await response.json();
      if (response.ok) {
        let studente={Matricola:studentsJson.Matricola,Nome:studentsJson.Nome,Crediti:studentsJson.Crediti,FullTime:studentsJson.FullTime==null?undefined:studentsJson.FullTime}
        return studente;
            } else {
        throw studentsJson;  // an object with the error coming from the server
      }
    }
    async function getAllCoursesForStudent(matricola){
      const response=await fetch(`http://localhost:3001/api/courses/${matricola}`,{credentials:'include'});
      const CorsiJson=await response.json();
      if(response.ok){
          return CorsiJson.map((e) => ({ codice: e.CodiceCorso, nome: e.Nome, crediti: e.Crediti , ActStudenti:e.ActStudenti,MaxStudenti: e.MaxStudenti, Incompatibilita: e.Incompatibilità, Propedeuticita:e.Propedeuticità})) 
      }
      else{
          throw CorsiJson;
      }
    
      }
    async function eliminaPiano(){
      return new Promise((resolve, reject) => {
        fetch(new URL('student' , APIURL), {
          method: 'DELETE',
          credentials: 'include'
        }).then((response) => {
          if (response.ok) {
            resolve(null);
          } else {
            response.json()
              .then((message) => { reject(message); }) // error message in the response body
              .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
          }
        }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
      });
    }
    async function updateStudent(student) {
      return new Promise((resolve, reject) => {
        
        fetch(new URL('students/' + student.Matricola, APIURL), {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
                    
          body: JSON.stringify({ Matricola: student.Matricola, Nome: student.Nome, Crediti: student.Crediti, FullTime: student.FullTime}),
        }).then((response) => {
          if (response.ok) {
            resolve(null);
          } else {
            // analyze the cause of error
            response.json()
              .then((obj) => { reject(obj); }) // error message in the response body
              .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
          }
        }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
      });
    }
 async function logIn(credentials) {
    let response = await fetch(new URL('sessions', APIURL), {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    if (response.ok) {
      const user = await response.json();
      return user;
    } else {
      const errDetail = await response.json();
      throw errDetail.message;
    }
  }
  async function logOut() {
    await fetch(new URL('sessions/current', APIURL), { method: 'DELETE', credentials: 'include' });
  }
 async function addCorsoForStudent(corsi) {
    return new Promise((resolve, reject) => {
      
      fetch(new URL('pianodistudi', APIURL), {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(corsi),
      }).then((response) => {
        if (response.ok) {
          resolve(null);
        } else {
          // analyze the cause of error
          response.json()
            .then((message) => { reject(message); }) // error message in the response body
            .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
        }
      }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
    });
  }

const API={getAllCourses,logIn,logOut,getAllStudents,updateStudent,addCorsoForStudent,getStudent,getAllCoursesForStudent,eliminaPiano};
export default API;