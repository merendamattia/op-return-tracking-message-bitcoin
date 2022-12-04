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

// Crea un nuovo file e lo scarica
// text: contenuto file
// name: nome file
function saveFile(text, name) {
    //text = "We're no strangers to love${endl}You know the rules and so do I${endl}A full commitment's what I'm thinking of${endl}You wouldn't get this from any other guy${endl}I just wanna tell you how I'm feeling${endl}Gotta make you understand${endl}${endl}CHORUS${endl}Never gonna give you up,${endl}Never gonna let you down${endl}Never gonna run around and desert you${endl}Never gonna make you cry,${endl}Never gonna say goodbye${endl}Never gonna tell a lie and hurt you${endl}${endl}We've known each other for so long${endl}Your heart's been aching but you're too shy to say it${endl}Inside we both know what's been going on${endl}We know the game and we're gonna play it${endl}And if you ask me how I'm feeling${endl}Don't tell me you're too blind to see (CHORUS)${endl}${endl}CHORUSCHORUS${endl}(Ooh give you up)${endl}(Ooh give you up)${endl}(Ooh) never gonna give, never gonna give${endl}(give you up)${endl}(Ooh) never gonna give, never gonna give${endl}(give you up)${endl}${endl}We've known each other for so long${endl}Your heart's been aching but you're too shy to say it${endl}Inside we both know what's been going on${endl}We know the game and we're gonna play it (TO FRONT)${endl}${endl}";
    text = "TX hash: " + name + "\n" + text;
    name = name + ".txt";

    text = text.replaceAll("${apice}", "'");
    text = text.replaceAll("${endl}", "\n");
    
    
    const file = new File([text], name, {
        type: 'text/plain',
    });
    
    const link = document.createElement('a')
    const url = URL.createObjectURL(file)
  
    link.href = url
    link.download = file.name
    document.body.appendChild(link)
    link.click()
  
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
}

// Crea e popola una tabella contenente i dati di una transazione
function makeTable(y){
    if(y.search("error") == -1){
        var confirmedBlock = sessionStorage.getItem("latestBlock") - getBlock(y) + 1;
        sessionStorage.setItem("confirmedBlock", confirmedBlock);
        console.log("confirmedBlock:", confirmedBlock);

        var table = "<table><tr>";
        table += ("<td class='w40'>${hex_to_hash}</td>");
        table += ("<td class='w10'>${confirmedBlock}</td>");
        table += ("<td class='w8'>${getBlock}</td>");
        table += ("<td class='w17'>${getTimestamp}</td>");
        table += ("<td class='w15'><a target=\"_blank\" href=\"https://blockchain.info/rawtx/${getHash}\">${getMinHash}..</a></td>");
        table += ("<td class='w10'><a href=\"\" onClick=\"saveFile('${hex_to_hash}', '${getHash}')\"><i class='material-icons' style='color:black;'>&#xe2c4;</i></a></td>");
        table += "</tr></table>";

        // Sostituisce i caratteri speciali con caratteri temporanei che verranno risostituiti successivamente
        var hex_to_hash = hex_to_text(y).replaceAll("\n", "${endl}").replaceAll("'", "${apice}");
        hex_to_hash = hex_to_hash.replaceAll(/[^0-9A-Za-z <>*+"':,.!$&()-=@{}[\]-]/g, '');

        table = table.replaceAll("${hex_to_hash}", hex_to_hash);
        table = table.replaceAll("${confirmedBlock}", confirmedBlock);
        table = table.replaceAll("${getBlock}", getBlock(y));
        table = table.replaceAll("${getTimestamp}", getTimestamp(y));
        table = table.replaceAll("${getHash}", getHash(y));
        table = table.replaceAll("${getMinHash}", getMinHash(getHash(y)));
        table = table.replaceAll("${getTimestamp}", getTimestamp(y));

        return table;
    }
    else {
        var error_log = "<br>Hash non trovato nella blockchain!\nHash cercato: " + sessionStorage.getItem("hashByUser") + "\n";
            
        console.log(error_log);
        writeError(error_log);

        checkError();
    }
    return "";
}

// Preleva i vari hash dal file di testo, crea e popola una tabella con i relativi dati per ognuno di loro
function fetch_multiple_hash(hash){
    for(var i = 0; i < hash.length; i++){
        
        var temp = hash[i].substr(0,1);

        if(temp.match(/[0-9]/i) || temp.match(/[a-z]/i)) {
            let file = explorer + hash[i];

            fetch (file)
            .then(x => x.json())
            .then(y => document.getElementById("demo").innerHTML += makeTable(JSON.stringify(y)));
        }
        else {
            if(temp != "-" && temp != ""){
                
                var error_log = "<br>Riga non compatibile!\nNumero riga nel file: " + (i + 1) + "\nContenuto riga: " + hash[i] + "\n";
            
                console.log(error_log);
                writeError(error_log);
                
                checkError();
            }
            
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

// Funzione che controlla se si verificano errori
function checkError(){
    setTimeout(verifyNegativeBlock, 2000);
}

// Scrive il tipo di errore a video
function writeError(string){
    document.getElementById("error").innerHTML += string;
}

// Se viene ritornato un valore negativo, viene aggiornata la pagina
function verifyNegativeBlock(){
    if(sessionStorage.getItem("confirmedBlock") < 0)
        location.reload();
}

// Main
function main(){
    getLatestBlock();
    fetch (hash_txt)
    .then(x => x.text())
    .then(y => fetch_multiple_hash(y.split(/\r?\n/)));
}

let explorer = "https://blockchain.info/rawtx/";
let cors = "?cors=true";

let hash_txt = "./txt/hash.txt";
//let hash_txt = "../tracking/txt/hash.txt"; // Serve per quando viene caricato online

getLatestBlock();

console.log("Latest block number:", sessionStorage.getItem("latestBlock"));

main();

checkError();
