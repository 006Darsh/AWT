const http = require("http");

const hostname = "127.0.0.1";
const port = 3000;
//Difference between put and post AND put and delete AND URI and URL


const handler = (req, res) => {
    if (req.url === '/api' && req.method === 'GET') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Welcome to world of async Programming')
    } else {
        
    }
}