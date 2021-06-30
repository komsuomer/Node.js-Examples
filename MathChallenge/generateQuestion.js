const operations = ['+','-'];

exports.getNewQuestion = () => {
    let a = Math.floor(Math.random()*99)+1;
    let b = Math.floor(Math.random()*99)+1;
    let operation = operations[Math.floor(Math.random()*2)];
    let question = `${a} ${operation} ${b}`;
    return {'question':question, 'result':eval(question)};
};