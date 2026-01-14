import { createWriteStream, createReadStream } from "node:fs"
import { fileURLToPath } from "node:url"
import { join, dirname } from "node:path"

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const file_dir = join(__dirname, "public", "lorem.txt");

const read_stream = createReadStream(file_dir);
let file_open = false;

read_stream.on("data", (chunk) => console.log(`Received ${chunk.length} bytes of data.`));

read_stream.on("close", () => {
    console.log("File Closed.");
    file_open = false;
});

read_stream.on("end", () => console.log("Finished reading all data."));
read_stream.on("ready", () => console.log('File is ready to load'));

read_stream.on("open", (fd) => {
    console.log(`file opened with id ${fd}.`);
    file_open = true;
});

read_stream.on("data", (chunk) => {
    if (chunk.length > 0) {
        read_stream.pause();
        console.log("Stream paused.");
        setTimeout(() => {
            if (file_open) {
                read_stream.resume();
                console.log("Stream resumed");
            }
        }, 1000);
    };
});
