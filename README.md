# Scrivere sulla Blockchain di Bitcoin tramite `OP_RETURN`
## Che cos'è l' `OP_RETURN`?
È un campo di una transazione Bitcoin che permette la scrittura di 40 byte, cioè di 40 caratteri alfanumerici a piacere, che verranno legati per sempre alla transazione. Approfondimento storia a questo [link](https://bitcoin.stackexchange.com/questions/29554/explanation-of-what-an-op-return-transaction-looks-like).

## `OP_RETURN` in una transazione [Spiegazione]
Questo è una transazione Bitcoin:
```json
{
   "hash":"b6abffe30b0edef88c796d0a21118046874b55c9c3b98adfb17aa6d9699e679d",
   ...
   "block_height":328455,
   "inputs":[
      {
         ...
      }
   ],
   "out":[
      {
         ...
      },
      {
         "type":0,
         "spent":false,
         "value":0,
         "n":2,
         "tx_index":5538187677742287,
         "script":"6a26492063616e74207365652075206275742049207374696c6c206c6f766520796f75206c696c69"
      }
   ]
}
```
Concentriamoci nella sezione `out` (output della transazione), in particolare nella sezione `script`.  
Possiamo avere più campi `script`, ma il valore dell' `OP_RETURN` è quella sequenza di valori alfanumerici preceduti dai caratteri "6a".  
Nel nostro caso è:
```
26492063616e74207365652075206275742049207374696c6c206c6f766520796f75206c696c69
```
Il valore dell' `OP_RETURN` è in esadecimale, quindi per leggerlo dobbiamo convertirlo in "linguaggio umano". Si può usare questo [tool online](https://www.duplichecker.com/hex-to-text.php).  
Il risultato della conversione sarà:
```
I cant see u but I still love you lili
```

## Funzionamento tool tracking messaggi `OP_RETURN`
### Installazione
```
npm clone "this repository"
```
### Configurazione
Inserire nel file `hash.txt` gli hash delle transazioni dei messaggi che si vogliono tracciare, ognuno in una riga diversa.  
L'algoritmo ignora quasiasi riga che include caratteri diversi da quelli alfanumerici.
### Esecuzione
Aprire il file `index.html` nel proprio browser.
