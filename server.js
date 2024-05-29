import express from 'express';
import config from "./db/config.js";
import bodyParser from "body-parser";
import Students from './routes/Students.js';
import Applications from './routes/Applications.js';
import Bursaries from './routes/Bursaries.js';
import Disbursements from './routes/Disbursements.js';
import cors from "cors";
const app = express();
const port = 3001; // Define your desired port number
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
//routes set up
Students(app);
Applications(app);
Bursaries(app);
Disbursements(app);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Server running at port ${port}`);
});