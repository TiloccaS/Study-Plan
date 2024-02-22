'use strict';
const cors=require('cors');
const express = require('express');
const morgan = require('morgan'); // logging middleware
const {check, validationResult} = require('express-validator'); // validation middleware
const dao = require('./dao.js'); // module for accessing the DB
const passport = require('passport'); // auth middleware
const LocalStrategy = require('passport-local').Strategy; // username and password for login
const session = require('express-session'); // enable sessions
const userDao = require('./userdao'); 
// init express
passport.use(new LocalStrategy(
  function(username, password, done) {
    userDao.getUser(username, password).then((user) => {
      if (!user)
      {
        return done(null, false, { message: 'Incorrect username and/or password.' });
      } 
      return done(null, user);
    })
  }
));


// serialize and de-serialize the user (user object <-> session)
// we serialize the user id and we store it in the session: the session is very small in this way
//mettiamo quello che è da mettere nel cookie
passport.serializeUser((user, done) => {
  done(null, user.Matricola);
});

// starting from the data in the session, we extract the current (logged-in) user
passport.deserializeUser((id, done) => {
  userDao.getUserById(id)
    .then(user => {
      done(null, user); // this will be available in req.user
    }).catch(err => {
      done(err, null);
    });
});
const app = express();
const port = 3001;
// set-up the middlewares
app.use(morgan('dev'));//è un middleware che serve per fare il logging
app.use(express.json());

//tu attraverso il codice caricato sul web non puoi mandare le richieste a un altro server, lo puoi fare ma devi aggiungeere
//questo corsOption 
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};
app.use(cors(corsOptions));
const isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated())
    return next();
  
  return res.status(401).json({ error: 'not authenticated'});
}
// set up the session
app.use(session({
  // by default, Passport uses a MemoryStore to keep track of the sessions
  secret: 'a secret sentence not to share with anybody and anywhere, used to sign the session ID cookie',
  resave: false,
  saveUninitialized: false 
}));

// then, init passport
app.use(passport.initialize());
app.use(passport.session());


/*** APIs ***/


// GET /api/courses anche se non è autenticato 
app.get('/api/courses', async (req, res) => {
  try {
    const corsi = await dao.listCourses();
    //res.json(exams);
    res.json(corsi);
  } catch(err) {
    res.status(500).json({error: `Database error while retrieving corsi`}).end();
  }
});
app.get('/api/courses/:matricola',isLoggedIn, async (req, res) => {
  try {
    const corsi = await dao.getCoursesOfStudent(req.user.Matricola);
    res.json(corsi);
  } catch(err) {
    res.status(500).json({error: `Database error while retrieving corsi for ${req.user.Matricola}`}).end();
  }
});

app.get('/api/students', async (req, res) => {
  try {
    const studenti = await dao.listStudents();
    res.json(studenti);
  } catch(err) {
    res.status(500).json({error: `Database error while retrieving students`}).end();
  }
});
app.get('/api/student', async (req, res) => {
  try {
    const studente = await dao.getStudente(req.user.Matricola);
    res.json(studente);
  } catch(err) {
    res.status(500).json({error: `Database error while retrieving students`}).end();
  }
});
app.put('/api/students/:Matricola', isLoggedIn,[], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({errors: errors.array()});
  }

  const student = req.body;

  // you can also check here if the code passed in the URL matches with the code in req.body
  try {
    await dao.updateStudent(student,req.user.Matricola);
    res.status(200).end();
  } catch(err) {
    res.status(503).json({error: `Errore nel database durante l'update della matricola ${req.params.Matricola}.`});
  }

});

//creo la sessione
app.post('/api/sessions', function(req, res, next) {
  
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);
      if (!user) {
        // display wrong login messages
        return res.status(401).json(info);
      }
      // success, perform the login
      req.login(user, (err) => {
        if (err){        
          return next(err);
        }
        
        
        return res.json(req.user);
      });
  })(req, res, next);
});
app.delete('/api/sessions/current', (req, res) => {
  req.logout( ()=> { res.end(); } );
});

app.get('/api/sessions/current', (req, res) => {  if(req.isAuthenticated()) {
    res.status(200).json(req.user);}
  else{
    res.status(401).json({error: 'Unauthenticated user!'});}
})
app.post('/api/pianodistudi', isLoggedIn, [], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {

    return res.status(422).json({errors: errors.array()});
  }

  const corsi=req.body;

  try {
  
    let x=unwrapcheckCorso(corsi,req.user);

    if(x!="ok"){
      res.status(503).json({error: `Database error during the creation Piano di studi of ${req.user.Matricola}.`});
    }
    else{
      let corsiStudente=await dao.getCoursesOfStudent(req.user.Matricola);
      
        for (let corso of corsiStudente){
          let setCorso={CodiceCorso:corso.CodiceCorso, ActStudenti:corso.ActStudenti-1}
          await dao.updateCorso(setCorso);
  
        }
      
        if (corsiStudente.length>0)  {
        await dao.svuotaCorsi(req.user.Matricola);
      }
      
      await dao.addCorso(corsi, req.user);

      let corsiStudente2=await dao.getCoursesOfStudent(req.user.Matricola);
        for (let corso of corsiStudente2){
          let setCorso={CodiceCorso:corso.CodiceCorso, ActStudenti:corso.ActStudenti+1}
          await dao.updateCorso(setCorso);

        }
        let crediti=0;
        corsi.map((cs)=>crediti+=cs.crediti);
        
        let setStudente={Crediti:crediti,FullTime:req.user.FullTime}
        await dao.updateStudent(setStudente,req.user.Matricola)
        
      
      }

      
        
      res.status(201).end();
  
    }
      catch(err) {
    res.status(503).json({error: `Database error during the creation Piano di studi of ${req.user.Matricola}.`});
  }

});
function unwrapcheckCorso(corsi,studente){
  let crediti=0;

  corsi.map((cs)=>crediti+=cs.crediti);
  if(studente.FullTime==1 && (crediti< 60 || crediti>80)){
    return "Lo studente Full Time deve avere crediti compresi fra 40 e  80"
  }
  else if(studente.FullTime==0 && (crediti< 20 || crediti>40)){
    return "Lo studente Part Time deve avere crediti compresi fra 20 e  40"
  }
  else{
    let x="ok";
    let incompatibilita=[];
    let copiaArray=corsi;
    corsi.map((cs)=>{if(cs.Incompatibilita!=null){
      let vett=cs.Incompatibilita.replace('\r',"").split("\n");
      
      vett.map((v)=>incompatibilita.push(v));
    }});
  
    corsi.map((cs)=>{if(incompatibilita.indexOf(cs.codice)!=-1){

      x=`${cs.codice} è incompatibile con un esame del piano di studi`
    }});
    corsi.map((cs)=>{
      if(copiaArray.indexOf(cs.codice)!=-1)
      {
        x=`${cs.codice} è gia presente nel piano di studi`
      }
    })
    let propedeuticità=[];
    let codiciCorso=[];
    corsi.map((cs)=>{
      codiciCorso.push(cs.codice);
    })
    corsi.map((cs)=>{
      if(cs.Propedeuticita!=null){
        propedeuticità.push(cs.Propedeuticita.replace(" ",""));
      }
    });
    propedeuticità.map((pr)=>{
      if(codiciCorso.indexOf(pr)==-1){
        x=`Nel piano di studi deve essere presente il seguente esame ${pr}`
      }
    })
    corsi.map((cs)=>{
      if (cs.MaxStudenti!=null){
        if(cs.ActStudenti>cs.MaxStudenti){
          x=`il corso ${cs.codice} ha gia il numero massimo di studenti`
        } 
      }
    })
    return x;

  }

  }
  app.delete('/api/student', isLoggedIn, async (req, res) => {
    try {
      let corsiStudente=await dao.getCoursesOfStudent(req.user.Matricola);
      for (let corso of corsiStudente){
        let setCorso={CodiceCorso:corso.CodiceCorso, ActStudenti:corso.ActStudenti-1}
        await dao.updateCorso(setCorso);
      }
      await dao.svuotaCorsi(req.user.Matricola);
      let studentetmp={ Crediti:0, FullTime:null}
        await dao.updateStudent(studentetmp,req.user.Matricola);
      res.status(204).end();
    } catch(err) {
      res.status(503).json({ error: `Database error during the deletion of exam ${req.user.Matricola}.`});
    }
  });
  



            app.listen(port, () =>
console.log(`Server listening on port ${port}`)) ;