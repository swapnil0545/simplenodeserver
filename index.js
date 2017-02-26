const http = require('http');
const url = require('url');
const path = require('path');
const fs= require('fs');
const hostname = '127.0.0.1';
const port = 3000;

//Array of mime Types
var mimeTypes = {
    "html" : "text/html",
    "jpeg" : "image/jpeg",
    "jpg" : "image/jpeg",
    "png" : "image/png",
    "js" : "text/javascript",
    "css" : "text/css"
}

//Create Server
const server = http.createServer((req, res) => {
    var uri= url.parse(req.url).pathname;
    var fileName = path.join(process.cwd(),unescape(uri));
    console.log('Loading '+uri);
    var stats;

    try{
        stats= fs.lstatSync(fileName);
    }catch(e){
        res.writeHead(404,{'Content-Type' : 'text/plain'});
        res.write('404 Not found\n');
        res.end();
        return;
    }
    
    //check if file/directory
    if(stats.isFile()){
        var mimeType = mimeTypes[path.extname(fileName).split(".").reverse()[0]];
        res.statusCode = 200;
        res.setHeader('Content-Type', mimeType);
        var filestream = fs.createReadStream(fileName);
        filestream.pipe(res);
    }else if(stats.isDirectory()){
        res.writeHead(302,{
            'Location' : 'index.html'
        });
        res.end();
    }else {
        res.writeHead(500, {'Content-Type' : 'text/plain'});
        res.write('500 Internal Server Error\n');
        res.end();
    }

});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});