const { MongoClient } = require('mongodb');

let user = process.env.DB_USERNAME;
let password = process.env.DB_PASSWORD;
let clusterURL = process.env.DB_CLUSTER_URL;
const uri = `mongodb+srv://${user}:${password}@${clusterURL}/?retryWrites=true&writeConcern=majority`;

const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


let _db;

const mongoDBConnection = async () => {
    try {
        if (client.isConnected()) {
            _db = client.db('LoginSystem');
            console.log('client already connected');
        } else {
            console.log('connecting to db');
            await client.connect();
            _db = client.db('LoginSystem');
            // await _db.collection('users').remove();
        }
    } catch (error) {
        console.log('DB ERROR : ' + error);
    }
};




const listUser = async (limit=10, skip=0) => {
    await mongoDBConnection();

    var result = await _db.collection('users').find().sort({'age':1}).limit(limit).skip(skip).toArray();
    console.log('ListUser => result length : ' + result.length);
    return result;
}

const getUser = async (email) => {
    await mongoDBConnection();
    let user = await _db.collection('users').findOne({'email':email});
    console.log('Get User => E-mail : ' + email);
    return user;
}

const getAdmin = async () => {
    await mongoDBConnection();
    let admin = await _db.collection('users').findOne({'userName':'admin'});
    console.log('Get Admin => Admin : ' + admin);
    return user;
}

const insertUser = async (user) => {
    await mongoDBConnection();
    let result = await _db.collection('users').findOne({'email':user.email});
    if(result){
        throw new Error('This email already using');
    }
    await _db.collection('users').insertOne(user);
    console.log('InsertUser => userName : ' + user.userName );
    return;
}

const removeUser = async (email) => {
    await mongoDBConnection();
    let deleteResult = (await _db.collection('users').remove({'email':email}))['result'];
    console.log('DELETE => ' + email + ' / Deleted : ' + deleteResult['n'] + ' record(s)');
    if(deleteResult['n'] == 0){
        return false;
    }
    return true;
}


// const insertMany = async (list) => {
//     await mongoDBConnection();
//     console.log(list.length);
//     await _db.collection('users').remove({});
//     await _db.collection('users').insertMany(list);
// }


// await client.close();

module.exports = {
    listUser,
    insertUser,
    getUser,
    getAdmin,
    removeUser
    //insertMany
}




// <% if (message) { %>
//     <p><%= message %> </p>
// <% } else { %>
//     <p>Welcome to registery page</p>
// <% } %>