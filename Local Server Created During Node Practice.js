import http from "node:http"
import { createReadStream, createWriteStream } from "node:fs"
import { dirname, join, normalize } from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const out_dir = join(__dirname, "out");
const out_file = join(out_dir, "test.json");

const PORT = 3000;

const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const req_local_path = normalize(decodeURI(req.url)).substring(1);
    res.statusCode = 200;
    

    if (req.method === "GET" && req_local_path === out_file) { 

        const read_stream = createReadStream(out_file);

        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");

        read_stream.pipe(res);

        read_stream.on("finish", () => {"Data Fully Passed"});
        read_stream.on("error", (err) => {
            console.log("Error In Reading: ", err.name);
            console.log("Error Messsage: ", err.message);
        })
    }

    else if (req.method === "POST" && req_local_path.startsWith(__dirname)) {
        const normalized_path = "c" + req_local_path.substring(1);
        

        let directory_created = false;

        try {
            // mkdir(dirname(normalized_path), {recursive:true});

            const post_write_stream = createWriteStream(normalized_path);
            req.pipe(post_write_stream);

            post_write_stream.on("end", () => {
                res.setHeader("Content-Type", "text/plain; charset=utf8");
                res.write("Data Receival Successful");
                res.end();
            });
            post_write_stream.on("error", (err) => {
                console.log("\nError With POST: ", err.code);
                console.log("Error Message: ", err.message, "\n");

                res.statusCode = 500;
                res.setHeader("Content-Type", "text/plain; charset=utf8");
                res.write("Unexpected Error Incurred At Server!");
                res.end();
            });  

        } catch (err) {}

             
    }

    else {
        console.log("Method Not Working");
    }
});

server.listen(PORT, () => console.log(`Server Listening For Requests at http://localhost:${PORT}`));
