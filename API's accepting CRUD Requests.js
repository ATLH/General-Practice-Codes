import { createserver } from "node:http"

const db_arr = ['a', 'b', 'c', 'd'];
console.log("Array before udpate: ", db_arr);

const PORT = 3000;

let server = createServer((req, res) => {
    let url = new URL(req.url, `http://${req.headers.host}`);
    res.statusCode = 200;
    
    if(req.method === 'GET' && url.pathname === '/get'){
        let num = url.searchParams.get('position');
        
        res.writeHead(200, {'Content-Type': 'test/plain, charset=utf-8',});
        res.end(`Value = ${db_arr[num]}`);
        res.on('end', () => console.log('GET request successful'));
    }


    else if (req.method === "POST" && url.pathname === '/post'){
        res.writeHead(200, {"Content-Type": "text/plain, charset=utf-8"});
        
        let data = '';
        req.on('data', (chunk) => data += chunk);
        req.on('end', () => {
            let parsed_data = JSON.parse(data);
            if (parsed_data.token == 'user1') db_arr.push(parsed_data.value);
            console.log("Array After POST update: ", db_arr);
            res.end('Array Updated Successfully');
        });
        req.on('error', (err) => {
            console.log('Error with message: ', err.name);
            console.log('Error Message: ', err.message);
            res.end('Request Failed!\nError Incurred');
        });
    }


    else if (req.method === "PUT" && url.pathname === '/put') {
        res.writeHead(200, {'Content-Type': 'text/plain, charset=utf-8'});

        let data = '';
        req.on('data', (chunk) => data += chunk);
        req.on('end', () => {
            let parsed_data = JSON.parse(data);
            db_arr[parsed_data.position] = parsed_data.value;
            console.log("Array after PUT update: ", db_arr);
            res.end('Data Successfully Updated');
        });
        req.on('error', (err) => {
            console.log('Error with message: ', err.name);
            console.log('Error Message: ', err.message);
            res.end('Request Failed!\nError Incurred');
        });
    }

    else if (req.method === "DELETE" && url.pathname === '/delete') {
        res.writeHead(200, {'Content-Type': 'text/plain, charset=utf-8'});

        let data = '';
        req.on('data', (chunk) => data += chunk);
        req.on('end', () => {
            let parsed_data = JSON.parse(data);
            db_arr.splice(parsed_data.position, 1);
            console.log("Array after DELETE call: ", db_arr);
            res.end('Item Deleted successfully.');
        });
        req.on('error', (err) => {
            console.log('Error with message: ', err.name);
            console.log('Error Message: ', err.message);
            res.end('Request Failed!\nError Incurred');
        });
    }

    else {
        res.end('Method not supported yet!\nTry using GET, POST, PUT, or DELETE method.');
    }
});

server.listen(PORT, () => console.log('Server Listening!'));
