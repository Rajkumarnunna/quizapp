// server.js

const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mysql = require('mysql');
const config = require('./config');

const app = express();

// MySQL connection pool
const pool = mysql.createPool(config.database);

// Google OAuth2 configuration
passport.use(new GoogleStrategy({
    clientID: 'your_google_client_id',
    clientSecret: 'your_google_client_secret',
    callbackURL: '/auth/google/callback'
  },
  function(accessToken, refreshToken, profile, cb) {
    // Save user profile to database or retrieve user if exists
    pool.query('SELECT * FROM users WHERE google_id = ?', [profile.id], (err, rows) => {
        if (err) return cb(err);
        if (!rows.length) {
            // User not found, create new user
            const newUser = {
                google_id: profile.id,
                email: profile.emails[0].value,
                // Add other necessary user data
            };
            pool.query('INSERT INTO users SET ?', newUser, (err, result) => {
                if (err) return cb(err);
                return cb(null, newUser);
            });
        } else {
            // User found, return user data
            return cb(null, rows[0]);
        }
    });
  }
));

passport.serializeUser((user, cb) => {
    cb(null, user);
});

passport.deserializeUser((obj, cb) => {
    cb(null, obj);
});

// Initialize Passport and restore authentication state, if any, from the session
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication, redirect to dashboard
    res.redirect('/dashboard');
  }
);

app.get('/dashboard', (req, res) => {
    // Render dashboard with user's score
    if (req.isAuthenticated()) {
        // User is authenticated, retrieve user's score from database and render dashboard
        const userId = req.user.google_id;
        pool.query('SELECT score FROM users WHERE google_id = ?', [userId], (err, rows) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error fetching user score');
            } else {
                // Render dashboard with user's score
                const userScore = rows[0].score || 0; // Assuming score column exists in users table
                res.send(`Welcome to your dashboard! Your score is: ${userScore}`);
            }
        });
    } else {
        // User is not authenticated, redirect to login page
        res.redirect('/login');
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
