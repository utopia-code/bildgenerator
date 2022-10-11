
"use strict";
window.onload = () => {

    let bild1 = document.querySelector ( '#bild1' );
    let bild2 = document.querySelector ( '#bild2' );
    let bild3 = document.querySelector ( '#bild3' );
    let bild0 = document.querySelector ( '#bild0' );

    let cbg = document.querySelector ( '#canvasBG' );
    let cfg = document.querySelector ( '#canvasFG' );

    let ctxbg = cbg.getContext('2d');
    let ctxfg = cfg.getContext('2d');

    //----------------
    //----------------
    //----------------
    // Bilder generator --------------------------------------------

    //ctxfg
    let generator = document.getElementById('generator');
    let oben = document.getElementById('oben');
    let mitte = document.getElementById('mitte');
    let unten = document.getElementById('unten');

    generator.onclick = function(evt) {
        leeren();
        neuesBild();
     } 
    
    neuesBild();

    function neuesBild(){
        let zufall1 = Math.floor ( Math.random() * 5 );
        let zufall2 = Math.floor ( Math.random() * 5 );
        let zufall3 = Math.floor ( Math.random() * 5 );
        ctxfg.drawImage ( bild1, 0, zufall1 * 300, 900, 300,0,0,900,300);
        ctxfg.drawImage ( bild2, 0, zufall2 * 300, 900, 300,0,300,900,300);
        ctxfg.drawImage ( bild3, 0, zufall3 * 300, 900, 300,0,600,900,300);
    }
    
    function leeren(){
        ctxfg.clearRect(0,0,cfg.width,cfg.height);
        ctxbg.clearRect(0,0,cbg.width,cbg.height);
    }
    
    // ein Teil leeren -------------------------------------
    
    oben.onclick = function(evt){
        ctxfg.clearRect(0,0,900,300);
        ctxbg.clearRect(0,0,900,300);
        zeichnenOben();
    }
    
    mitte.onclick = function(evt){
        ctxfg.clearRect(0,300,900,300);
        ctxbg.clearRect(0,300,900,300);
        zeichnenMitte();
    }
    
    unten.onclick = function(evt){
        ctxfg.clearRect(0,600,900,300);
        ctxbg.clearRect(0,600,900,300);
        zeichnenUnten();
    }
    
    function zeichnenOben(){
        ctxfg.drawImage ( bild0,0,0,900,300);
    }
    
    function zeichnenMitte(){
        ctxfg.drawImage ( bild0,0,300,900,300);
    }
    
    function zeichnenUnten(){
        ctxfg.drawImage ( bild0,0,600,900,300);
    }
    
    //----------------
    //----------------
    //----------------
    // Paint ----------------------------------------------------

    let farben = document.getElementById('farben');
    let color = '#000000';
    farben.value = color;
    let groesseLinien = document.getElementById('groesseLinien');
    let sizeLinien = 1;
    groesseLinien.value = sizeLinien;
    let loeschen = document.getElementById('loeschen');
    
    let selectPinsel = document.getElementById('selectPinsel');
    let pinsel = document.getElementById('pinsel');
    pinsel.checked = "checked";
    let linien = true;
    let pinsel2 = document.getElementById('pinsel2');
    let linien2 = false;
    let pinsel3 = document.getElementById('pinsel3');
    let linien3 = false;

    let zeichnen = false;
    let punkte = [];
    ctxbg.lineJoin = "round";
    ctxbg.lineCap = "round";
    
    // Mouse Bewegung ---------------------------------------------
    
    cbg.onmousedown = evt => {
        zeichnen = true;
        let move = mousePosition(cbg,evt);
        punkte.push(move);
    };

    cbg.onmousemove = evt => {
        
        if(linien){
            pinselEins(evt);
            linien2 = false;
            linien3 = false;
        }
        if(linien2) {
            pinselZwei(evt);
            linien = false;
            linien3 = false;
        }
        if(linien3) {
            pinselDrei(evt);
            linien = false;
            linien2 = false;
        }
    };

    cbg.onmouseup = evt => {
        zeichnen = false;
        punkte.length = 0;
    };

    cbg.onmouseout = evt => {
        zeichnen = false;
        punkte.length = 0;
    };
    
    // Mouse position -----------------------------------------------
    
    function mousePosition(cbg,evt){
        let cbgBoundingBox = cbg.getBoundingClientRect();
        return{
            x: evt.pageX - cbgBoundingBox.left, 
            y: evt.pageY - cbgBoundingBox.top
        };
    }
    
    // Pinsel 1 - Linie erweichen ---------------------------------
    
    function mittelPunkte (p1,p2) {
        return {
            x: p1.x + (p2.x - p1.x) / 2,
            y: p1.y + (p2.y - p1.y) / 2
        };
    }
    
    function pinselEins (evt){
        if (!zeichnen) return;
        
        let move = mousePosition(cbg,evt);
        punkte.push(move);

        let p1 = punkte[0];
        let p2 = punkte[1];

        ctxbg.beginPath();
        ctxbg.moveTo(p1.x, p1.y);
        ctxbg.lineTo(p1.x, p1.y);

        for (let i = 1; i < punkte.length; i++ ){
            let zwischenPunkte = mittelPunkte(p1, p2);
            ctxbg.quadraticCurveTo(p1.x, p1.y, zwischenPunkte.x, zwischenPunkte.y);
            p1 = punkte[i];
            p2 = punkte[i + 1];
        }
        ctxbg.stroke();
    }
    
     // Pinsel 2 - Linie mit Schatten ---------------------------------
    
    function pinselZwei(evt){
        if (!zeichnen) return;

        let move = mousePosition(cbg,evt);
        punkte.push(move);
        
        ctxbg.lineWidth = 1;
        ctxbg.beginPath();
        ctxbg.moveTo(punkte[punkte.length - 2].x, punkte[punkte.length - 2].y);
        ctxbg.lineTo(punkte[punkte.length - 1].x, punkte[punkte.length - 1].y);
        ctxbg.stroke();

        for (let i = 0; i < punkte.length; i++) {
            let dx = punkte[i].x - punkte[punkte.length-1].x;
            let dy = punkte[i].y - punkte[punkte.length-1].y;
            let d = dx * dx + dy * dy;

            if (d < 1000) {
                
                ctxbg.beginPath();
                
                ctxbg.moveTo( 
                    punkte[punkte.length-1].x + (dx * 0.2), 
                    punkte[punkte.length-1].y + (dy * 0.2)
                );
                ctxbg.lineTo( punkte[i].x - (dx * 0.2), punkte[i].y - (dy * 0.2));
                ctxbg.stroke();
            }
        }
    }
    
     // Pinsel 3 - Spray ---------------------------------
    
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    function pinselDrei(evt){
        let move = mousePosition(cbg,evt);
        
        let density = 50;
        if (!zeichnen) return;
            for (let i = density; i--; ) {
                let radius = 20;
                let offsetX = getRandomInt(-radius, radius);
                let offsetY = getRandomInt(-radius, radius);
                
                ctxbg.fillRect(move.x + offsetX, move.y + offsetY, 1, 1);
            }
    }
    
    loeschen.onclick = function(evt) {
        ctxbg.clearRect(0,0,cbg.width,cbg.height);
        
        color = 'rgb(0,0,0)';
        farben.value = color;
        ctxbg.strokeStyle = color;
        sizeLinien = 1;
        groesseLinien.value = sizeLinien;
        ctxbg.lineWidth = sizeLinien;
        linien = true;
        linien2 = false;
        linien3 = false;
        pinsel.checked = "checked";
    }
    
    farben.oninput = function() {
        color = this.value;
        ctxbg.strokeStyle = color;
        ctxbg.fillStyle = color;
    }
    
    groesseLinien.oninput = function() {
        sizeLinien = this.value;
        ctxbg.lineWidth = sizeLinien;
    }
    
    pinsel.onclick = function(evt){
        linien = true;
        linien2 = false;
        linien3 = false;
        pinselEins(evt);
    }
    
    pinsel2.onclick = function(evt){
        linien2 = true;
        linien = false;
        linien3 = false;
        pinselZwei(evt);
    }
    pinsel3.onclick = function(evt){
        linien3 = true;
        linien = false;
        linien2 = false;
        pinselDrei(evt);
    }
    
    //----------------
    //----------------
    //----------------
    // Bild speichern -------------------
    

    let ausgabe = document.getElementById('ausgabe');
    let bildSpeichern = document.getElementById('bildSpeichern');

    const speichern = data => {
        ausgabe.innerHTML = '';
        let neu = document.createElement('img');
        neu.src = data;
        ausgabe.appendChild (neu);
    }

    bildSpeichern.onclick = evt => {

        let xhr = new XMLHttpRequest();

        xhr.open ('POST', '/bilderSpeichern', true);

        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.onload = () => {
            console.log ( xhr.responseText );
            bildLaden();
        }
        
        // speichern Eben cfg mit Eben cbg --------------------
        
        ctxbg.drawImage(cfg,0,0);
        let url = cbg.toDataURL();
        console.log ( url );
        
        xhr.send (JSON.stringify ( {url: url} ));
    }

    const bildLaden = () => {
        let xhr = new XMLHttpRequest();
        xhr.open ('GET', '/bilderLaden', true);
        xhr.onload = () => {
            
            let neu = xhr.responseText;
            //console.log ( neu );
            speichern(neu);
        }
        xhr.send();
    }
    
    const init = () => {
        bildLaden();
    }
    init();
}
           
            