// Main Logic
// Construct a Parser to handle  input.
// Construct a CodeWriter to handle output.
// And a Main file as a driver program.
const fs = require('fs');
const {parser} = require('./parser');
let asmOut = '';
let fileName = process.argv[2];

fs.readFile(fileName,'utf-8',(err,data) => {
	if(err){
	 throw err;
	}
	data = data.split('\r\n').filter(x => x.charAt(0) != '/' && x.charAt(0) != '');
	asmOut = parser(data,fileName);
	fs.writeFile(fileName.replace('.vm','') + '.asm' , asmOut , (err) => {
	 if(err){
	  throw err;
	 }
	})
})
