import mongoose from "mongoose"
import { config as dotenv_Config } from "dotenv"
import express from "express"

dotenv_Config();

const app = express();
app.use(express.json());

const db_uri = process.env.MONGODB_URI;


try {
    await mongoose.connect(db_uri)
    .then(() => console.log("Connection Successful."))
    .catch((err) => {
        console.log("Connection Error:\n\n", err);
        process.exit();
    });
} catch (err) {
    console.log("Library Connection Error: ", err);
    process.exit();
}


let userSchema = new mongoose.Schema({
    id: Number,
    name: String
});

let User = mongoose.model('User', userSchema);




async function createUser(req){
    let user_find = await User.findOne({
        id: req.body.id,
        name: req.body.name
    });

    console.log("user finder: \n", user_find);

    if (user_find == null) {
        const user = await User.create({
            id: req.body.id,
            name: req.body.name
        })
        .then(() => { return true })
        .catch((err) => console.log("Error With Data Posting: ", err));
    }
    else {
        return false;
    }
}

app.use('/post', (req, res, next) => {

    if (createUser(req)) {
        res.send("User Successfully Created");
        (
            async () => {
                let db_list = await User.find();
                console.log(db_list);
            }
        )();
    }
    else {
        res.send("User Already Exists");
    }

});




app.use((err, req, res, next) => {
    console.log("\nError Incurred! Handler Middleware called.\n", err);

    res.status(err.status || 500);

    res.json({
        error: {
            message: err.message
        }
    })
});




app.listen(process.env.PORT, () => console.log("Server Listening"));
