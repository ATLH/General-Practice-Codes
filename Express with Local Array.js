import express from "express"

const db_arr = ['a', 'b', 'c', 'd'];
let token = 'user1';
const port = 3000;

console.log("Array before udpate: ", db_arr);




const app = express();
app.use(express.json());




app.get('/get', (req, res) => {

    try {
        res.send(`Value = ${db_arr[Number(req.query.position)]}`);
        console.log('GET Request Successful');
    } catch (err) {
        next(err);
    }

});




app.post('/post', (req, res, next) => {

    try {
        if(req.body.token === token) {
            db_arr.push(req.body.value);
            res.send('Data Successfully Posted');
            console.log('Array After Update: ', db_arr);
        }

        else {
            let error = new Error('Invalid Token!');
            error.status = 404;
            console.log('User not found! Responded with Error.');
            return next(error);
        };
    } catch (err) {
        next(err);
    }

});




app.put('/put', (req, res, next) => {

    try {
        if(req.body.token === token) {
            db_arr[req.query.position - 1] = req.body.value;
            res.send('Data Successfully Updated');
            console.log('Array After Update: ', db_arr);
        }

        else {
            let error = new Error('Invalid Token!');
            error.status = 404;
            console.log('User not found! Responded with Error.');
            return next(error);
        };
    } catch (err) {
        next(err);
    }

});




app.delete('/delete', (req, res, next) => {

    try {
        if(req.body.token === token) {
            db_arr.splice(req.query.position - 1, 1);
            res.send('Item Successfully Deleted');
            console.log('Array After Update: ', db_arr);
        }

        else {
            let error = new Error('Invalid User!');
            error.status = 404;
            console.log('User not found! Responded with Error.');
            return next(error);
        };
    } catch (err) {
        next(err);
    }

});




app.use((err, req, res, next) => {
    res.status(err.status || 500);

    res.json({
        error: {
            message: err.message
        }
    });

});




app.listen(port);
