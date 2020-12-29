const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const user = require('./routes/user');
const bank = require('./routes/bank');
const admin = require('./routes/admin');
const { checkUser, checkAdmin } = require('./middleware/authMiddleware');

const dbURI = 'mongodb+srv://user:1234@cluster0.sgaw0.mongodb.net/<dbname>?retryWrites=true&w=majority';

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
    .then((result) => app.listen(2020, () => console.log('Listening to port 2020')) )
    .catch((err) => console.log(err))

//middleware
app.use(express.urlencoded({extended: true}));//for accepting req body from frontend into backend
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// view engine
app.set('view engine', 'ejs');

//Use Routes
// routes

app.get('*', checkUser);
app.get('*', checkAdmin);
app.get("/", (req, res)=>{
    res.render("home")
})
app.use('/', admin);
app.use('/', user);
app.use('/', bank);
