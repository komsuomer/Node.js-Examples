const http = require('http');
const path = require('path');
const fs = require('fs');

const server = http.createServer((req, res) => {
    var ip = req.headers['x-forwarded-for'] || 
     req.connection.remoteAddress || 
     req.socket.remoteAddress ||
     (req.connection.socket ? req.connection.socket.remoteAddress : null);

    if(req.url === '/'){
        fs.readFile(path.join(__dirname, 'index.html'), (err,data) => {
            if(err) throw err;
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            res.write('Your Ip is ' + ip);
            res.end();
        })
       
    }
    if(req.url === '/user'){
        res.write('<h1>Welcome user Omer</h1>');
        res.end();
    }
});

server.listen(8000, () => console.log('Serve is up and running'));