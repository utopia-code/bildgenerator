'use strict';
const express = require ('express');
const fs = require ('fs');
const url = require ('url');
let bodyParser = require ('body-parser');
const mysql = require ('mysql');

let server = express();

server.use ( (req, res, next)  => {
    let query = url.parse (req.url, true);
    let logInhalt = new Date().toLocaleString() + ': ' + query.pathname + '\n';
    fs.appendFile( 'log_express.txt', logInhalt, err => {
       if (err) console.log (err); 
    });
    next();
});

server.use ( express.static ( 'public') );

server.use ( bodyParser.json({
    limit: '50mb', 
    extended: true
}) );

let conn = mysql.createConnection ({
    host: 'localhost',
    user: 'generator',
    database: 'generator',
    password: 'abc',
});

server.post ('/bilderSpeichern', (req, res) => {
    //console.log ( req.body.url );
     let abfrage = 'INSERT INTO bildgenerator (bildstring) VALUES ("' + req.body.url + '")';
     
     conn.query(abfrage, (err, antwort) => {
        if (err) {
            console.log (err);
            res.send ('Fehler beim Speichern der Daten');
        } else {
            console.log (antwort);
            res.send ( 'Bilddaten erfolgreich gespeichert' );
        }
     });
});

server.get('/bilderLaden', (req, res) => {
    
    ladeBilder().then(
        data => res.send (data),
        data => res.send (data)
    );
    data => res.send (data);
});



const ladeBilder = () => {
    
    return new Promise ((resolve, reject) => {
       let abfrage = 'SELECT * from bildgenerator ORDER BY idpicture DESC LIMIT 1';
        
        conn.query (abfrage, (err, antwort) => {
            if (err) {
                console.log ('Fehler beim Laden der Daten');
                reject ('Fehler beim Laden der Daten');
            } else{
                let bild = antwort[0].bildstring;
                resolve(bild);
            }
        });
    });
}

server.listen (8080, () => console.log ('Läuft bei mir.'));