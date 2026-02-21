import mongoose from "mongoose"
import { config as dotenv_Config } from "dotenv"
import express from "express"

dotenv_Config();

const app = express();
app.use(express.json());

const db_uri = process.env.MONGODB_URI;

app.use('/get/:userID', (req, res, next) => {
    
});

(
    async () => {
        try {
            await mongoose.connect(db_uri)
            .then(() => console.log("Connection Successful."))
            .catch((err) => {
                console.log("Connection Error:\n\n", err);
                process.exit();
            });
        } catch (err) {
            console.log("Library Connection Error: ", err);
        }
    }
)();

const userSchema = new mongoose.Schema({
    id:Number,
    name:String
});

const User = mongoose.model('User', userSchema);

const creator = await User.create({
    id:'1',
    name:'Talha'
});

const users_list = await User.findOne({ id: 12345});
console.log(users_list);
