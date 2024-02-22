'use strict';
/* Data Access Object (DAO) module for accessing users */

const sqlite = require('sqlite3');
const crypto = require('crypto');

// open the database
const db = new sqlite.Database('pianodistudi.sqlite', (err) => {
    if(err) throw err;
  });

exports.getUserById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM Studenti WHERE Matricola == ?';
      db.get(sql, [id], (err, row) => {
        if (err) 
          reject(err);
        else if (row === undefined)
          resolve({error: 'User not found.'});
        else {
          const studente = {Matricola: row.Matricola, Nome: row.Nome, Crediti: row.Crediti,FullTime:row.FullTime}
          console.log(studente);
          resolve(studente);
        }
    });
  });
};
exports.getUser = (matricola, password) => {
    console.log(password);

    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM Studenti WHERE Matricola == ?';
      db.get(sql, [matricola], (err, row) => {
        if (err) { reject(err); }
        else if (row === undefined) { resolve(false); }
        else {
          const studente = {Matricola: row.Matricola, Nome: row.Nome, Crediti: row.Crediti, FullTime:row.FullTime};
          
          
          const salt = row.salt;
          crypto.scrypt(password, salt, 32, (err, hashedPassword) => {
            if (err) reject(err);

            const passwordHex = Buffer.from(row.Hash, 'hex');

            if(!crypto.timingSafeEqual(passwordHex, hashedPassword))
            resolve(false);
            else {
            resolve(studente)}; 
          });
        }
      });
    });
  };
  
