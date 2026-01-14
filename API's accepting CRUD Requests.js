import http from "node:http"

const db_arr = ['a', 'b', 'c', 'd'];

let server = http.createServer((req, res) => {
    let url = new URL(req.url, `http://${req.headers.host}`);
    res.statusCode = 200;
    console.log(url);
    
    if(req.method === 'GET'){
        let num = url.searchParams.get('seq_num');
        
        res.writeHead(200, {'Content-Type': 'test/plain, charset=utf-8',})
        res.end(`Value = ${db_arr[num]}`);
    };
});

server.listen(3000, () => console.log('Server Listening!'));
