const express = require('express')
const app = express();
const cors = require('cors')
require('dotenv').config();
const connectToDb = require('./src/config/databaseConfiguration');
const cookieParser = require('cookie-parser');
const userRouter = require('./src/routes/user.routes');

const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.use('/user', userRouter);

app.listen(PORT, () => {
    console.log(`server is running at http://localhost:${PORT}`);
    connectToDb();
});