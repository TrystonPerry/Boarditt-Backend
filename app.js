// NPM Packages
const express =                   require('express');
const app =                       express();
const bodyParser =                require('body-parser');
const mongoose =                  require('mongoose');
const passport =                  require('passport');
const dotEnv =                    require('dotenv');
const cors =                      require('cors');

// Middleware
const setHeader =                 require('./middleware/set-header');

// Routes
const indexRoute =                require('./routes/index');
const userRoute =                 require('./routes/user');
const boardsRoute =               require('./routes/board');
const listsRoute =                require('./routes/list');
const todosRoute =                require('./routes/todo');
const invalidRoute =              require('./routes/invalid-route');

// Load enviornement variables
dotEnv.config();

// Config public headers
app.use(cors());

// Body Parser Settings
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Connect to MongoDB Database
mongoose.connect(process.env.MONGOURI, {useNewUrlParser: true});

// Passport config
app.use(passport.initialize());

// Index Routes
app.use('', indexRoute);
app.use('/user', userRoute);
app.use('/api/boards', boardsRoute);
app.use('/api/lists', listsRoute);
app.use('/api/todos', todosRoute);
app.use('**', invalidRoute);

// Start server
app.listen(process.env.PORT, process.env.IP, () => {
  console.log(`Server started on ${process.env.IP}:${process.env.PORT}`);
})