const MongoClient = require('mongodb').MongoClient
const connectionString = 'mongodb+srv://christinabrgs:Breakingwith@cluster0.qia0kni.mongodb.net/?retryWrites=true&w=majority'


module.exports = function(app, passport, db) {

// normal routes ===============================================================

MongoClient.connect(connectionString, { useUnifiedTopology: true }) // client grabs input data and stores on mongo website
.then(client => {
  const workoutFavs = client.db("workouts").collection("favorites");
  console.log(workoutFavs)
    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, async(req, res) => {
        const fav = await workoutFavs.find().toArray()
          // if (err) return console.log(err)
          res.render('profile.ejs', {fav})
    })

    app.get('/favorites', isLoggedIn, async(req, res) => {
      const fav = await workoutFavs.find().toArray()
      res.render('favorites.ejs', {fav})
    })

    app.post('/favorites', (req, res) => {
      console.log('post', req.body)  
      workoutFavs
        .insertOne({favorite: req.body.favorite}, (err, result) => {
          console.log(result)
          if (err) return res.send(err)
          res.send(result)
        })
      })


    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout(() => {
          console.log('User has logged out!')
        });
        res.redirect('/');
    });

    app.delete('/delete', (req, res) => {
      db.collection('messages').findOneAndDelete({favorite: req.body.favorite}, (err, result) => {
        if (err) return res.send(500, err)
        res.send('workout deleted!')
      })
    })
  })

// message board routes ===============================================================


// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
