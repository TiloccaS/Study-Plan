# Exam #1: "Piano Di Studi"
## Student: s305938 TILOCCA SALVATORE 

## React Client Application Routes

- Route `/login`: contiene il form per le credenziali dell'utente
- Route `/`: se l'utente non è loggato contiene la lista dei corsi, altrimenti contiene la lista dei corsi e il menù per modificare o creare il suo piano di studi


## API Server

- POST `/api/login`
  - request parameters:none
  - request body content: username and password
  - response body content: username, password  
 - GET `/api/courses`
   - Request parametrs:none
   - Request body content:none
   - Response body content: lista dei corsi 
- GET `/api/courses/:matricola`
  - Request parametrs:matricola
  - Request body content:none
  - Response body content: lista dei corsi dello studente loggato
- GET `/api/students`
  - Request parametrs:none
  - Request body content:none
  - Response body content: lista studenti 
- GET `/api/student`
  - request parameters:none
  - request body content: none
  - response body content: nome,crediti e fulltime   
- POST `/api/pianodistudi`
  - request parameters: corsi selezionati dallo studente
  - request body content: corsi selezionati dallo studente
  - response body content: none
- DELETE `/api/student`
  - request parameters: none
  - request body content: none
  - response body content: none
  - elimina i corsi e azzera i crediti dello studente loggato
- PUT `/api/students/:matricola`
  - Request parametrs:oggetto studente
  - Request body content:studente
  - Response body content: none
 
- ...

## Database Tables

- Table `Studenti` - contiene Matricola,Hash,salt,Nome,Crediti,FullTime
- Table `PianoDiStudi` - contiene CodiceCorso, Matricola
- table `corsi` - contiene CodiceCorso, Nome, Crediti,MaxStudenti,Incompatibilità,Propedeuticità,ActStudenti
- ...

## Main React Components

- `App` (in `App.js`): è il wraps dell'intera applicazione, all'interno ci sono le varie funzioni che servono per tutta l'applicazione, all'interno c'è una route che puo rimandare a una lista dei corsi senza essere loggati oppure può richiamare una funzione contenuta in PianoDiStudi.js che è l'home page una volta che siamo autenticati, all'interno è presente anche la route che rimanda alla funzione con il form per il login 
- `LoginComponents` (in `LoginComponents.js`): si occupa di fornire un form per il login tramite l'inserzione di username e password
- `MyMain` (in `MyMain.js`): fornisce la lista dei corsi quando non si è autenticati, uttilizza l'Accordion di bootstrap per fornire, tramite un click, la possibilità di guardare la descrizione di un corso  
- `MyNav` (in  `MyNav.js`): fornisce la Navbar di bootstrap, al suo interno è presente l'icona BsPersonCircle che offre la possibilita di fare login, il resto è puramente estetico
- `PianoDiStudi` (in `PianoDiStudi.js`): Oltre presentare la lista dei corsi tramite un Accordion offre la possibilita di creare un piano di studi(tramite un form che contiene una checkbox e un bottone per salvare) per l'utente autenticato e in caso avesse gia un piano offre la possibilita di modificarlo 

(only _main_ components, minor ones may be skipped)

## Screenshot

![image](https://user-images.githubusercontent.com/100297319/174795488-6cb47d23-d6ef-4f63-b0d8-a81810bec47f.png)

## Users Credentials

- 1, pw0 (Utente con il piano di studi FullTime)
- 2, pw1 (Utente con il piano di studi PartTime)
- 3,pw2 (Utente con il piano di studi PartTime)
- 4,pw3 (Utente con piano di studi da creare)
- 5,pw4  (Utente con piano di studi da creare)
