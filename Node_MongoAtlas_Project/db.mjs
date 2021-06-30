import db from 'mongodb';

let user = 'admin';
let password = 'uXa62Ld970WDOrfS';
let clusterURL = 'cluster0.zelsw.mongodb.net';
const uri = `mongodb+srv://${user}:${password}@${clusterURL}/?retryWrites=true&writeConcern=majority`;



export async function findDoc(date) {
  const client = new db.MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  try {
    await client.connect();

    const database = client.db('test');
    const collection = database.collection('table');
    
    return await collection.findOne({"date":date});
    
  }catch (error){
    console.log(error);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

export async function findDocDateRange(date1,date2) {
  const client = new db.MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  try {
    await client.connect();

    const database = client.db('test');
    const collection = database.collection('table');
    
    return (await collection.find({ "date": { "$gte": date1, "$lte": date2 } }).toArray());
    
  }catch (error){
    console.log(error);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

export async function insertArray() {
  const client = new db.MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  try {
    await client.connect();

    const database = client.db('test');
    const collection = database.collection('table');

    // await collection.deleteMany({});

    // await collection.insertMany(currencyArray);
    
    return await collection.find().toArray();
    
  }catch (error){
    console.log(error);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}




//run().catch(console.dir);


// for(let i=0; i<50; i++){
    //   const query = { date: new Date(currencyArray[i]['date']) };

    //   const update = { $set: { date: currencyArray[i]['date'], currencies: currencyArray[i]['currencies']}};
    //   const options = { upsert: true };
    //   await collection.updateOne(query, update, options);
    // }




    // var docs = [{value:0},{value:1}];
    // const option = {order:true};

    // var result = await table.insertMany(docs,option);
    // console.log(result);

    // console.log( await table.find().sort({'value':1}).toArray());

    // var result = await table.find().toArray();
    // console.log(result);
