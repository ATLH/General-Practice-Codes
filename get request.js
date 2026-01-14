import { request as http_request } from "node:http"
import { dirname, join } from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const req_file_path = join(__dirname, "out", "test.json");
const req_file_url = pathToFileURL(req_file_path);

const PORT = 3000;


const get_options = {
    hostname: 'localhost',
    port: PORT,
    path: req_file_url.pathname,
    method: "GET",
    headers: {
        "Content-Type": "application/json"
    }
}

function json_get(res) {
    let data = "";
    res.on("data", (chunk) => data += chunk);

    res.on("end", () => {
        try {
            const json = JSON.parse(data);
            console.log("Parsed json: ", json);
        } catch (err) {
            console.log("Error At End: ", err.name);
            console.log("Error Message: ", err.message);
        }
    });

    res.on("error", (err) => {
        console.log("Error With Response: ", err.name);
        console.log("Error Message: ", err.message);
    });
}

const get_req = http_request(get_options, (res) => {
    json_get(res);
});

get_req.on("end", () => console.log("Request Fulfilled"));

get_req.on("error", (err) => {
    console.log("Error With Request: ", err.name);
    console.log("Error Message: ", err.message);
})

get_req.end();

