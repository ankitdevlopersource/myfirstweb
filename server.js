const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const Post = require('./models/post');

const app = express();
const PORT = 3000;

// --- SESSION SETUP ---
app.use(session({
    secret: 'a-very-secret-key-that-is-long-and-random',
    resave: false,
    saveUninitialized: false,
}));

// Make session available in all EJS files
app.use((req, res, next) => {
    res.locals.isLoggedIn = req.session.isLoggedIn;
    next();
});
// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// --- DATABASE CONNECTION ---
// अपनी MongoDB Atlas की Connection String यहाँ डालें

const dbURI = 'mongodb+srv://ankitkumardopta_db_user:Yadu0102@cluster0.l41ao65.mongodb.net/sarkariDb?retryWrites=true&w=majority&appName=Cluster0';

// Make sure to call the connect function
mongoose.connect(dbURI)
    .then(() => {
        console.log('Database connected successfully');
        app.listen(PORT, () => console.log(`सर्वर http://localhost:${PORT} पर चल रहा है`));
    })
    .catch((err) => console.log(err));

// --- ROUTES ---
// Homepage Route
app.get('/', async (req, res) => {
    try {
        const allPosts = await Post.find().sort({ createdAt: -1 });
        const newUpdates = allPosts.filter(post => post.category === 'New Updates');
        const admitCards = allPosts.filter(post => post.category === 'Admit Card');
        const latestResults = allPosts.filter(post => post.category === 'Latest Result');
        
        res.render('index', { 
            title: 'SarkariAI - सबसे तेज़ अपडेट',
            newUpdates,
            admitCards,
            latestResults
        });
    } catch (err) { console.log(err); }
});

// Single Post Details Route
app.get('/post/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const post = await Post.findById(id);
        res.render('post-details', { title: post.title, post: post });
    } catch (err) {
        console.log(err);
        res.status(404).send('Post not found');
    }
});


// --- AUTHENTICATION ROUTES ---

// Show the login page
app.get('/login', (req, res) => {
    res.render('login', { title: 'Admin Login' });
});

// Handle login attempt
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    // IMPORTANT: In a real app, you would check a database.
    // Here, we are using simple hardcoded values.
    if (username === 'Ankityadu' && password === 'password123') {
        req.session.isLoggedIn = true; // Set the session
        res.redirect('/admin');
    } else {
        res.redirect('/login'); // If login fails, redirect back
    }
});

// Handle logout
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return console.log(err);
        }
        res.redirect('/');
    });
});
// This is a "guard" or "middleware" function
function authGuard(req, res, next) {
    if (req.session.isLoggedIn) {
        next(); // If logged in, continue to the requested page
    } else {
        res.redirect('/login'); // If not logged in, redirect to login page
    }
}
// --- ADMIN ROUTES ---
// ...

// Admin Routes
const adminRoutes = require('./routes/admin');
app.use('/admin', authGuard, adminRoutes);