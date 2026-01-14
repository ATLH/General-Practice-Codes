import http from "node:http"

function maxPriceCalculator(arr_of_obj){
    let max_price = 0;
    let max_priced_id = 0;
    for (const val of arr_of_obj){
        if (val.data?.price != undefined && val.data?.price > max_price) {
            max_price = val.data.price;
            max_priced_id = val.id;
        }
    }

    console.log("Item ID with maixmum price = ", max_priced_id);
    console.log("The Price: ", max_price);

    return;
}





let get_user_id = 5;

const get_options = {
    hostname: 'api.restful-api.dev',
    path: `/objects/5`,
    port: 80,
    method: "GET",
    headers: {
        "Content-Type": "application/json",
    }
}

function get_request(){
    const req = http.request(get_options, (res) => {
        let data = "";
        res.on("data", (chunk) => data += chunk);
        res.on("end", () => console.log(JSON.parse(data)));
        res.on("error", (err) => console.log(`Error Name: ${err.name} \nError Message: ${err.message}`))
    });

    req.on("error", (err) => {
        console.log("Error with request: ", err.name);
        console.log("Error Message: ", err.message);
    });

    req.end();
}



async function post_request(){

    let post_response_user_id;

    const post_user_data = {
        "name": "Google Pixel 6 Pro",
        "data": {
            "color": "Cloudy White",
            "capacity": "128 GB"
        }
    }

    const post_options = {
        hostname: 'api.restful-api.dev',
        path: `/objects`,
        port: 80,
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(JSON.stringify(post_user_data)),
        }
    }
    return new Promise((resolve, reject) => {
        const req = http.request(post_options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                let json = JSON.parse(data);
                console.log(json);
                post_response_user_id = json.id;
                resolve(post_response_user_id);
            });
            res.on('error', (err) => {
                console.log('Error with Response: ', err.name);
                console.log('Error Message: ', err.message);
                reject(err);
            });
        });

        req.on('error', (err) => {
            console.log('Error with Request: ', err.name);
            console.log('Error Message: ', err.message);
            reject(err);
        });

        req.write(JSON.stringify(post_user_data));
        req.end();
    });
}





async function put_request(id){

    let put_user_id = id;
    let put_response_user_id;

    const put_user_data = {
        "name": "Google Pixel 6 Pro",
        "data": {
            "color": "Cloudy White",
            "capacity": "125 GB",
            "RAM": "16 GB"
        }
    }

    const put_options = {
        hostname: 'api.restful-api.dev',
        path: `/objects/${put_user_id}`,
        port: 80,
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(JSON.stringify(put_user_data)),
        }
    }

    return new Promise((resolve, reject) => {
        const req = http.request(put_options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                const json = JSON.parse(data);
                console.log(json);
                resolve(json.id);
            });
            res.on('error', (err) => {
                console.log('Error with Response: ', err.name);
                console.log('Error Message: ', err.message);
                reject(err);
            });
        });

        req.on('error', (err) => {
            console.log('Error with Request: ', err.name);
            console.log('Error Message: ', err.message);
            reject(err);
        });

        req.write(JSON.stringify(put_user_data));
        req.end();
    });
}





async function delete_request(id){

    let delete_user_id = id;

    const delete_options = {
        hostname: 'api.restful-api.dev',
        path: `/objects/${delete_user_id}`,
        port: 80,
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        }
    };

    return new Promise((resolve, reject) => {
        const req = http.request(delete_options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                console.log(JSON.parse(data));
                resolve();
            });
            res.on('error', (err) => {
                console.log('Error with Response: ', err.name);
                console.log('Error Message: ', err.message);
                reject(err);
            });
        });

        req.on('error', (err) => {
            console.log('Error with Request: ', err.name);
            console.log('Error Message: ', err.message)
            reject(err);
        });

        req.end();
    });
}




async function sequence_caller(){
    try {
        console.log("Starting POST Request: \n");
        let post_response_id = await post_request();

        console.log("\nStarting PUT Request: \n");
        let put_response_id = await put_request(post_response_id);

        console.log("\nDeleting Request: \n");
        await delete_request(put_response_id);

        console.log('\nProgram Executed Successfully!\n');
    } catch(err){}
}

sequence_caller();
