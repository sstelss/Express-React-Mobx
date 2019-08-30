import path from 'path'
import express from 'express'

var dbConfig = require('./db.js');
var mongoose = require('mongoose');
const User = require('./models/user');
const BelovedPokemon = require('./models/belovePok');
const passport = require('passport')
const session = require('express-session')
const RedisStore = require('connect-redis')(session)

require("./config-passport")

const app = express();
const DIST_DIR = __dirname;
const HTML_FILE = path.join(DIST_DIR, 'index.html');

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({extended: true}));
// Parse JSON bodies (as sent by API clients)
app.use(express.json());

//////////////it starts work with passport///////////////////////////
// version for Redis, there is no Redis for Windows
// app.use(session({
//     store: new RedisStore({
//         url: "redis-11294.c16.us-east-1-3.ec2.cloud.redislabs.com:11294"
//     }),
//     secret:"testProject",
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//         path: '/',
//         httpOnly: true,
//         maxAge: 60 * 60 * 1000
//     }
// }))
app.use(session({
    secret: 'testProject',
    resave: false,
    saveUninitialized: false,
    cookie: {
        path: '/',
        httpOnly: true,
        maxAge: 60 * 60 * 1000
    }
}))

app.use(passport.initialize())
app.use(passport.session())

///////////////////////////////////////////////////////////////////////

app.use(express.static(DIST_DIR));

///////////////////////////////////registration////////////////////

var isAuth = function (req, res, next) {
    if (req.isAuthenticated()){
        next();
    }
    else{
        // res.send("You are not autorizate!");
        res.json({
            status_text: 'NO'
        });
    }
}


//авторизация
app.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user) {
      if (err) {
           return next(err);
     }
      if (!user) {
          return  res.json({
                        err: "Bad username or password!",
                        redirect: '/',
                        status_text: 'NO'
                    });
     }
      req.logIn(user, function(err) {
        if (err) {
            return next(err);
         }
        return res.json({
            text: "Everything is good!",
            redirect: '/personalPage',
            status_text: 'OK'
        });
        // return res.redirect('/personalPage')
      });
    })(req, res, next);
  });


//регистрация
app.post('/reg', (req, res, next) => {

    // извлекаем данные пользователя из тела запроса
    let sendedUser= {
        username: req.body.username,
        password: req.body.password
    };

    User.findOne({ 'username' :  sendedUser.username }, function(err, user) {
        // In case of any error, return using the done method
        if (err){
            console.log('Error in SignUp: '+err);
            return next(err);
        }
        // already exists
        if (user) {
            res.json({
                text: "This name is busy!",
                err: "Busy name!",
                redirect: '/',
                status_text: 'NO'
            });
        } else {
            // create the user
            let newUser = new User();

            // set the user's local credentials
            newUser.username = sendedUser.username;
            newUser.password = sendedUser.password;

            // save the user
            newUser.save(function(err) {
                if (err){
                    console.log('Error in Saving user: '+err);
                    next(err);
                }
                res.json({
                    text: "Your account created!",
                    redirect: '/personalPage',
                    status_text: 'OK'
                });
            });
        }
    })

});

//добавить покемона в список любимцев или удалить его
app.get('/belove/add/:id', isAuth, function (req, res, next) {
    
    BelovedPokemon.findOne({ 'username' :  req.user.username, "pokemonID": req.params.id }, function(err, pokemon) {
        // In case of any error, return using the done method
        if (err){
            console.log('Error in SignUp: '+err);
            return next(err);
        }
        // already exists
        if (pokemon) {
            console.log("This record is exist! User: ", req.user.username, "   pokemonID: ", req.params.id);
            BelovedPokemon.deleteOne({ 'username' :  req.user.username, "pokemonID": req.params.id }, function(err, pokemon) {
                // In case of any error, return using the done method
                if (err){
                    console.log('Error in SignUp: '+err);
                    return next(err);
                }else{
                    console.log('Recor deleted!');
                    res.json({
                        text: "Recor deleted!!",
                        status_text: 'OK'
                    });
                }
            })
        } else {
            // create the record
            let newUser = new BelovedPokemon();

            newUser.username = req.user.username;
            newUser.pokemonID = req.params.id;

            // save the user
            newUser.save(function(err) {
                if (err){
                    console.log('Error in Saving user: '+err);
                    next(err);
                }
                console.log('New beloved pokemon have added! User: ', req.user.username, "   pokemonID: ", req.params.id);
                res.json({
                    text: "'New beloved pokemon have added!!",
                    status_text: 'OK'
                });
            });
        }
    })
})

//получить список всех любимцев этого пользователя
app.get('/belove/getList', isAuth, function (req, res, next) {
    BelovedPokemon.find({ 'username' :  req.user.username}, function(err, pokemonList) {
        // In case of any error, return using the done method
        if (err){
            console.log('Error in SignUp: '+err);
            return next(err);
        }
        // already exists
        if (pokemonList) {
            console.log("User: ", req.user.username, " have next list: ", pokemonList);

            //парсим pokemonList
            let result = [];
            for(let i=0; i < pokemonList.length; i++){
                result.push(pokemonList[i].pokemonID);
            }
            res.json({
                PokemonsList: result
            });
        } else {
            
                console.log(' User: ', req.user.username, "  don't have beloved pokemons!");
                res.json({
                    PokemonsList: []
                });              
        }
    });
})

app.get('/currentUser', isAuth, function (req, res, next) {
    res.json({
        username: req.user.username,
        status_text: 'OK'
    });
});


app.get('/logout', isAuth, (req, res) => {
    req.logout();
})



app.get('/auth/facebook',
  passport.authenticate('facebook'));

app.get('/auth/facebook/callback', (req, res, next) =>{

  passport.authenticate('facebook', function(err, user) {
    if (err) {
         return next(err);
    }
    req.logIn(user, function(err) {
      if (err) {
          return next(err);
       }
      return res.redirect('/personalPage')
    });
  })(req, res, next);
}
)


///////////////////////////////////

app.get('*', (req, res) => {
    res.sendFile(HTML_FILE)
});

app.use((err, req, res, next) =>{
    console.log(err);
    res.status(500).send('Something broke')
});

const PORT = process.env.PORT || 8080;


mongoose.connect(dbConfig.url, { useNewUrlParser: true })
    .then((database) =>{

    app.listen(PORT, () => {
        console.log(`App listening to ${PORT}....`);
        console.log('Press Ctrl+C to quit.')
    });
    })
    .catch(function(error) {
        console.log('There was an ERROR: ', error);
    })


