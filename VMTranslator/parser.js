// Open a file which we need to parse.
// hasMoreCommands() File -> Boolean
// advance() Insstruction -> Next Instruction
// commandType() Instruction -> Instruction Type
// arg1 , arg2


const {writeArithmetic, writePushPop} = require('./codeWriter')

function parser(commands, fileName) {
    let output = ''
    while (hasMoreCommands(commands)) {
        let command = commands.shift();
        output += advance(command, fileName);
    }

    return output
}

function advance(command, fileName) {
    let output
    let type = commandType(command)

    switch (type) {
        case 'c_push':
        case 'c_pop':
            output = writePushPop(command, type, fileName)
            break
        case 'c_arith':
            output = writeArithmetic(command)
            break
    }

    return output
}

function hasMoreCommands(commands) {
    return commands.length > 0? true : false
}

const rePush = /^(push)/
const rePop = /^(pop)/

function commandType(command) {
    if (rePush.test(command)) {
        return 'c_push'
    } else if (rePop.test(command)) {
        return 'c_pop'
    } else {
        return 'c_arith'
    }
}


module.exports = {
    parser
}
