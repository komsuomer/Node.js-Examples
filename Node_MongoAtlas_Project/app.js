import fs from 'fs';
import express from 'express';
import axios from 'axios';
import bodyParser from 'body-Parser';

import * as db from './db.mjs';
import { getDates } from './date_array.mjs';

const port = 8000

var currencyData = {};
var currencyArray = [];

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.set('views', './templates/views')
app.use(express.static('./public'));

app.get("/", (req, res) => {

  //res.send(db.findDoc(new Date('2020-02-02').));
  res.render("index"); // index refers to index.ejs
});

app.get('/getRange', (req, res) => {
  const { dateStart, dateEnd, currency } = req.query;

  var names
  (typeof currency == 'string')? names = [currency] : names = currency;

  db.findDocDateRange(new Date(dateStart), new Date(dateEnd)).then((result) => {
    console.log(result.length);
    res.render('success', {
      currencyList: result,
      nameList: names
    });
  });

})

app.post("/login", (req, res) => {
  const { name, password } = req.body;

  if (name === "admin" && password === "admin") {
    res.render("success", {
      username: name,
    });
  } else {
    res.render("failure");
  }
});


app.get("/repos", async (req, res) => {
  const username = req.query.username || "saidFurkan";
  try {
    const result = await axios.get(
      `https://api.github.com/users/${username}/repos`
    );
    const repos = result.data.map((repo) => ({
      name: repo.name,
      url: repo.html_url,
      description: repo.description,
    }));
    res.render("repos", {
      repos
    });
  } catch (error) {
    console.log(error);
    res.status(400).send("Error while getting list of repositories");
  }
});


app.listen(process.env.PORT || port, () => {
  console.log(`Server Works !!! At port ${process.env.PORT || port}`);
});






const readFile = (fileName, currencyName) => {
  fs.readFile(fileName, { encoding: 'utf8' }, function (err, data) {
    if (err) {
      throw (err);
    }
    else {
      data = data.split('\n');

      for (let i = 1; i < data.length; i++) {
        data[i] = data[i].split(',');
        let date = data[i][0];
        if (data[i][4] == 'null') {
          continue;
        }
        if (!currencyData[date]) {
          currencyData[date] = {}
        }
        currencyData[date][currencyName] = parseFloat(parseFloat(data[i][4]).toFixed(3));
      }
      return;
    }
  });
}


function setDB() {
  readFile('./data/BTC-USD.csv', 'BTC_USD');
  readFile('./data/EUR-USD.csv', 'EUR_USD');
  readFile('./data/TRY-USD.csv', 'TRY_USD');
  readFile('./data/USDX.csv', 'USDX');

  setTimeout(() => {
    var dateArray = getDates(new Date('1971-01-04'), new Date('2021-03-18'));

    for (let obj of dateArray) {
      currencyArray.push({
        date: new Date(obj),
        currencies: currencyData[obj]
      });
    }

    db.insertArray().catch(console.dir);

  }, 5000);
}


// setDB();

//db.findDoc(new Date('2020-02-02'));

// insertArray();

// findDoc(new Date('2020-02-02'));

// findDocDateRange(new Date('2020-02-02'), new Date('2020-03-02'));


// export {findDoc}

// export function asd(){
//   console.log('qwertyuiop');
// }

// exports.findDoc = findDoc;
