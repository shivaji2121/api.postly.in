const express = require('express')
const app = express();
const cors = require('cors')
require('dotenv').config();
const connectToDb = require('./src/config/databaseConfiguration');
const cookieParser = require('cookie-parser');
const userRouter = require('./src/routes/user.routes');
const postRouter = require('./src/routes/post.routes');
const errorHandler = require('./src/middlewares/errorHandler');

const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.use('/user', userRouter);
app.use('/post', postRouter)


app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`server is running at http://localhost:${PORT}`);
    connectToDb();
});