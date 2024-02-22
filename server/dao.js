'use strict';
/* Data Access Object (DAO) module for accessing courses and exams */

const sqlite = require('sqlite3');

// open the database
const db = new sqlite.Database('pianodistudi.sqlite', (err) => {
  if(err) throw err;
});
exports.listCourses = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM corsi ';
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const courses = rows.map((e) => ({ CodiceCorso: e.CodiceCorso, Nome: e.Nome, Crediti: e.Crediti ,ActStudenti:e.ActStudenti, MaxStudenti: e.MaxStudenti, Incompatibilità: e.Incompatibilità, Propedeuticità:e.Propedeuticità}));
      resolve(courses);
    });
  });
};

exports.listStudents = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM Studenti ';
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const students = rows.map((st) => ({ Matricola: st.Matricola, Nome: st.Nome, Crediti: st.Crediti, FullTime: st.FullTime}));
      resolve(students);
    });
  });
};
exports.listStudents = (userId) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM Studenti WHERE Matricola=?';
    db.all(sql, [userId], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(rows);
    });
  });
};
exports.getCoursesOfStudent=(userId)=>{
  return new Promise((resolve,reject)=>{
    const sql='SELECT cs.CodiceCorso,cs.Nome,cs.Crediti,cs.MaxStudenti,cs.Incompatibilità,cs.Propedeuticità,cs.ActStudenti FROM corsi cs  JOIN PianoDiStudi on PianoDiStudi.CodiceCorso==cs.CodiceCorso WHERE Matricola=?';
    db.all(sql, [userId], (err, rows) => {
      if (err ) {
        reject(err);
        return;
      }
      const corsi=rows;
      resolve(corsi);
  });
});
};

exports.updateStudent = (student,userId) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE Studenti SET Crediti=?, FullTime=? WHERE Matricola = ?' ;
    db.run(sql, [student.Crediti,student.FullTime,userId], function (err) {
      if (err) {
        reject(err);
        return;
      }
      console.log("Update");
      resolve(this.lastID);
    });
  });
  
};

exports.updateCorso = (corso) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE corsi SET ActStudenti=? WHERE CodiceCorso = ?' ;
    db.run(sql, [corso.ActStudenti,corso.CodiceCorso], function (err) {
      if (err) {
        reject(err);
        return;
      }
      console.log("Update");
      resolve(this.lastID);
    });
  });
  
};
exports.svuotaCorsi=(userId)=>{
  return new Promise((resolve,reject)=>{
    const sql='DELETE FROM PianoDiStudi WHERE Matricola=?';
    db.run(sql, [userId], function (err) {  // <-- NB: function, NOT arrow function so this.lastID works
      if (err) {
        reject(err);
        return;
      }
      resolve(this.lastID);
    });
  })
}
exports.addCorso = (corsi, userId) => {
  

     return new Promise((resolve, reject) => {
    corsi.map((corso)=>{
      const sql = 'INSERT INTO PianoDiStudi(Matricola,CodiceCorso) VALUES(?,?)';
      db.all(sql, [userId.Matricola, corso.codice], function (err) {  // <-- NB: function, NOT arrow function so this.lastID works
      
   
        if (err) {
          console.log(err);
          reject(err);
          return;
        }
      
          console.log('createExam lastID: '+this.lastID);
        resolve(this.lastID);
        
        
      });




    })
  
    
  });
  };

