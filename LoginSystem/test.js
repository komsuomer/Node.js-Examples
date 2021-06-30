// async function first() {
//     await second();
//     console.log('1\n');
// }

// async function second() {
//     third();
//     let asd = new Promise(() => {
//         setTimeout(() => {
//             console.log('2\n');
//         }, 1000)
//     });
//     await asd;
// }

// function third() {
//     console.log('3\n');
// }

// // third(second(first()));

// first();


const fs = require('fs');
const dbOperation = require('./model/dbOperation');


fs.readFile('./babynamelist.txt', 'utf8' , async(err, data) => {
    if (err) {
      console.error(err);
      return
    }
    nameList = data.split('\r\n');
    for(let i=0; i<nameList.length; i++){
      nameList[i] = {'name':nameList[i], 'email':nameList[i]+'@mail.com','age':Math.floor(Math.random() * 50)+18, 'password':hashPwd.hash('1234', hashPwd.generateSalt(12))}
    }
    await dbOperation.insertMany(nameList);
  });