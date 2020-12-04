const table = require('./symbol-table');
const fs = require('fs');
const parser = require('./parser');

let fileName = process.argv[2];

fs.readFile(fileName,'utf-8',(err,data) => {
	if(err){
	 throw err;
	}
	//instructions per new line
	data = data.split('\r\n');
	//resolve symbols
	parser([...data],true);
	//parse instructions
	const binaryOut = parser(data);
	console.log(binaryOut);
	fileName = fileName.split('.')[0];
	fs.writeFile(fileName + '.hack' , binaryOut , (err) => {
	 if(err){
	  throw err;
	 }
	})
})
