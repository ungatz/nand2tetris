const table = require('./symbol-table');
const {addEntry,contains,getAddress} = table;
let {ramAddress} = table;
const code = require('./code');
const {dest,comp,jump} = code;

//every time we encounter A or C instruction PC++
let pc = -1;

function parser(instructions , isFirst) {
 return advance(instructions , isFirst);
}

function hasMoreCommands(instructions){
 return instructions.length > 0? true : false;
}
//now for comments

const regex = /(\/\/).+/;

function advance(instructions,isFirst){
 let current , type , binaryOut = '';
 while(hasMoreCommands(instructions)){
  current = instructions.shift().trim();
  if(isInstructionValid(current)){
   continue;
  }
  //replace comments with ''
  current = current.replace(regex,'').trim();
  type = commandType(current);
  
  switch(type){
	case 'C':
		if(!isFirst){
		 let d = dest(current);
		 let c = comp(current);
		 let j = jump(current);
		 binaryOut += '111'+c+d+j+'\r\n';
		} else {
		 pc++;
		}
		break;
	case 'A':
		if(!isFirst){
		 let token = symbol(current,type);
		 let binary;
		 if(isNaN(parseInt(token))){
		  if(contains(token)){
		   binay = int2Binary(getAddress(token));
		  } else {
		   binary = int2Binary(ramAddress);
		   addEntry(token,ramAddress++);
		  }
		  } else {
		   binary = int2Binary(token);
		  }
		  binaryOut += binary + '\r\n';
		} else {
		  pc++;
		}
		break;
	case 'L':
		if(isFirst){
		 let token = symbol(current,type);
		 addEntry(token,pc + 1);
		}
		break;

  }
 }
console.log(binaryOut);
return binaryOut;
}

function commandType(instruction){
 if(instruction.charAt(0) === '@'){
  return 'A';
 } else if (instruction.charAt(0) === '('){
  return 'L';
 } else {
  return 'C';
 }
}

//extract xxx from @xxx & (xxx) like @i ot (LOOP)
const regex1 = /^\((.+)\)$/;
function symbol(instruction,type){
 if(type === 'A'){
  return instruction.substr(1);
 } else if (type === 'L'){
  return instruction.replace(regex1,'$1'); //(LOOP) -> $1
 }
}

//int to binary
function int2Binary(num){
 let str = parseInt(num).toString(2);
 while(str.length !== 16){
  str = '0' + str;
 }
 return str;
}

//comments are invalid instructions
const regex2 = /^(\/\/)/;
function isInstructionValid(instruction){
 if(instruction == '' || regex2.test(instruction)){
  return true;
 }
 return false;
}

module.exports = parser;
