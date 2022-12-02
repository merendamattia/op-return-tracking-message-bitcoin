# Write on Bitcoin's Blockchain with `OP_RETURN`
## What is `OP_RETURN`?
It is a Bitcoin transaction's field that allows you to write a string of 80 byte [(Bitcoin Wiki)](https://en.bitcoin.it/wiki/Script); in other words, you can write a sequence of 80 characters, that these will be linked forever in a Bitcoin's transaction.  
You can read the full story to this [link](https://bitcoin.stackexchange.com/questions/29554/explanation-of-what-an-op-return-transaction-looks-like).

## `OP_RETURN` in a transaction [Explained]
This is a Bitcoin's transaction: 
```json
{
   "hash":"b6abffe30b0edef88c796d0a21118046874b55c9c3b98adfb17aa6d9699e679d",
   ...
   "block_height":328455,
   "inputs":[
      { ... }
   ],
   "out":[
      { ... },
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
Let's focus on `out` section (output of the transaction), particularly on `script` section.  
We could have more `script` fields, but the value of `OP_RETURN`is that sequence of alphanumeric values preceded by characters "6a".  
In this case it is:
```
26492063616e74207365652075206275742049207374696c6c206c6f766520796f75206c696c69
```
The `OP_RETURN`'s value is in hexadecimal, so we have to translate it in "human language".  
We can use this [online tool](https://www.duplichecker.com/hex-to-text.php).  
The result of this conversion will be:
```
I cant see u but I still love you lili
```
## Run 'OP_RETURN' message tracking tool
### Installation
```
git clone https://github.com/merendamattia/op-return-tracking-message-bitcoin.git
```
### Configuration
Insert in the `hash.txt` file the transaction hashes of the messages you want to trace, each on a different line.

The algorithm ignores any line that includes characters other than alphanumeric ones.  
The `-` character placed as the first character of the line denotes the line as a comment.

### Execution
Open the `index.html` file in your browser.

### How do I write the `OP_RETURN` in a transaction?
I currently use the "imToken" mobile application, which allows you to populate the `OP_RETURN` field when sending a transaction.

