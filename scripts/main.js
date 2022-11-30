// Inserisce nella veriabile di sessione latestBlock il numero dell'ultimo blocco prodotto
function getLatestBlock(){
    fetch ("https://chain.api.btc.com/v3/block/latest")
    //fetch ("https://blockchain.info/latestblock") //Problema CORS
    .then(x => x.json())
    .then(y => JSON.stringify(y))
    .then(y => sessionStorage.setItem("latestBlock", parseInt(y.substring(y.indexOf("height\":") + 8, y.indexOf(",", y.indexOf("height\":") + 9)))));
}

// Ritorna l'OP_RETURN messaggio in esadecimale
function getOP_RETURN(y){
    var inizio = y.indexOf("script\":\"6a") + 11;
    var fine = y.indexOf("\"", inizio + 1);
    
    return y.substring(inizio, fine);
}

// Ritorna l'hash della transazione
function getHash(y){
    var inizio = y.indexOf("hash\":\"") + 7;
    var fine = y.indexOf("\"", inizio + 1);
    
    return y.substring(inizio, fine);
}

// Ritorna i primi 10 caratteri dell'hash
function getMinHash(hash){
    return hash.substring(0, 10);
}

// Ritorna il blocco in cui è inserita la transazione
function getBlock(y){
    var inizio = y.indexOf("block_height\":") + 14;
    var fine = y.indexOf(",", inizio + 1);
    return y.substring(inizio, fine);
}

// Ritorna il timestamp di quando è stata eseguita la transazione
function getTimestamp(y){
    var inizio = y.indexOf("\"time\":") + 7;
    var fine = y.indexOf(",", inizio + 1);

    var myDate = new Date( y.substring(inizio, fine) * 1000 );
    
    return myDate.toLocaleString();
    //return myDate.toGMTString();
}

// Crea e popola una tabella contenente i dati di una transazione
function makeTable(y){
    if(y.search("error") == -1){
        var table = "<table><tr>";
        table += ("<td>" + hex_to_text(y) + "</td>");
        table += ("<td>" + (sessionStorage.getItem("latestBlock") - getBlock(y) + 1) + "</td>");
        table += ("<td>" + getBlock(y) + "</td>");
        table += ("<td>" + getTimestamp(y) + "</td>");
        table += ("<td>" + "<a target=\"_blank\" href=\"https://blockchain.info/rawtx/" + getHash(y) + "\">" + getMinHash(getHash(y)) + "..</a>" + "</td>");
        table += "</tr></table>";
        return table;
    }
    else {
        console.log("Hash non trovato nella blockchain!", "Hash cercato: " + sessionStorage.getItem("hashByUser"));
        error = true;
        checkError();
    }
    return "";
    
}

// Preleva i vari hash dal file di testo, crea e popola una tabella con i relativi dati per ognuno di loro
function fetch_multiple_hash(hash){
    for(var i = 0; i < hash.length; i++){
        
        var temp = hash[i].substr(0,1);

        if(!isNaN(temp) || temp.match(/[a-z]/i)) {
            let file = explorer + hash[i];

            fetch (file)
            .then(x => x.json())
            .then(y => document.getElementById("demo").innerHTML += makeTable(JSON.stringify(y)));
        }
        else {
            console.log("Riga non compatibile!", "\nNumero riga nel file: " + (i + 1), "\nContenuto riga: " + hash[i]);
            error = true;
            checkError();
        }
    }
}

// Crea e popola una tabella con i dati dato un hash
function fetch_single_hash(hash){
    let file = explorer + hash + cors;

    fetch (file)
    .then(x => x.json())
    .then(y => document.getElementById("demo").innerHTML += makeTable(JSON.stringify(y)));
}

// Trasforma il una stringa da esadecimale a ascii
function hex_to_ascii(str1){
	var hex  = str1.toString();
	var str = '';
	for (var n = 0; n < hex.length; n += 2) 
		str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
	return str;
}

// Trasforma il messaggio OP_RETURN da esadecimale a testo
function hex_to_text(y){
    var hex = getOP_RETURN(y);
    var temp = hex_to_ascii(hex).replace(/[^0-9A-Za-z ,.!$&()-=@{}[]-]/g, '');
    temp = temp.substring(1);
    return temp;
}

// Fa la ricerca su un solo hash inserito da utente
function searchHash(){
    var hash = document.getElementById('hashUser').value;
    sessionStorage.setItem("hashByUser", hash);
    fetch_single_hash(hash);
}

// Main
function main(){
    error = false;
    getLatestBlock();
    fetch (hash_txt)
    .then(x => x.text())
    .then(y => fetch_multiple_hash(y.split(/\r?\n/)));
}

function checkError(){
    if(error == true)
        document.getElementById("error").innerHTML = "Sono presenti degli errori, visualizzare la console per maggiori informazioni.";
    error = false;
}

let explorer = "https://blockchain.info/rawtx/";
let cors = "?cors=true";
var error;

let hash_txt = "../txt/hash.txt";
//let hash_txt = "../op-return/txt/hash.txt"; // Serve per quando viene caricato online

getLatestBlock();

console.log("Latest block number:", sessionStorage.getItem("latestBlock"));

main();

checkError();