//process.stdout.write(Math.random().toString());
// console.log(Math.random());

// function X(){
//     console.log(arguments);
// }

// X(1,5,8);

//(function(exports, require, module, __filename, __dirname){
//Module code actually lives in here
console.log(`FileName -> ${__filename}`);
//})

const getUserInfo = require('./sayName');

getUserInfo.sayName();
getUserInfo.sayAdress();

process.on('beforeExit', (code) => {
    console.log(process.env.OS);
    console.log(process.memoryUsage());
    console.log('Process beforeExit event with code: ', code);
});