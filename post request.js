import { request as http_request } from "node:http"
import { createReadStream, createWriteStream } from "node:fs"
import { mkdir } from "node:fs/promises"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = 3000;

const post_dir = join(__dirname, "out", "test.json");
const post_dir_url = pathToFileURL(post_dir);

const read_dir = join(__dirname, "package.json");

const post_data = JSON.stringify({
  "name": "esm-server",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node src/server.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "type": "module"
});

const post_options = {
    hostname: "localhost",
    path: post_dir_url.pathname,
    port: PORT,
    method: "POST",
    headers: {
        "Content-Type": "application/json; charset=utf8",
        "Content-Length": 500
    }
};

// localhost/upload

function postRequest() {
    let response_status_code = 200;
    const post_req = http_request(post_options, (res) => {
        response_status_code = res.statusCode;

        if (res.statusCode === 200) {
            let data = '';
            res.on("data", chunk => data += chunk);
            res.on("end", () => console.log("Response From Server: ", data));
        }
        else {
            let message = '';
            res.on("data", chunk => message += chunk);
            res.on("end", () => console.log("Unexpected Issue On Server Side.\nError Message: ", message));
            return;
        }
    });

    post_req.on("end", () => {
        console.log("Request Successfully Ended");
        post_req.end();
    });
    post_req.on("close", () => console.log("Connection Closed."));
    post_req.on("error", (err) => {
        console.log("Connection Error: ", err.code);
        console.log("Error Message: ", err.message || "Null");
    });


    if (response_status_code === 200) {
        const read_stream = createReadStream(read_dir);

        read_stream.on("data", (chunk) => {
            post_req.write(chunk);
        });
        read_stream.on("end", () => {
            console.log("Data transfer finished.");
            post_req.end();
        });
        read_stream.on("error", (err) => {
            console.log("Error With Request: ", err.name);
            console.log("Error Message: ", err.message);
        });
    }
    else {
        post_req.end();
    }
}

postRequest();
