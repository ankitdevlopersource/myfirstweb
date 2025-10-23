// routes/admin.js

const express = require('express');
const router = express.Router(); // <-- यह लाइन जोड़ें
const Post = require('../models/Post');

// Admin Dashboard - सभी पोस्ट्स दिखाएगा
router.get('/', async (req, res) => {
    try {
        const allPosts = await Post.find().sort({ createdAt: -1 });
        res.render('admin', { title: 'Admin Panel', posts: allPosts });
    } catch (err) {
        console.log(err);
    }
});

// नया पोस्ट जोड़ने का फॉर्म दिखाएगा
router.get('/add', (req, res) => {
    res.render('add-post', { title: 'Add New Post' });
});

// नया पोस्ट डेटाबेस में सेव करेगा
router.post('/add', async (req, res) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        externalLink: req.body.externalLink,
        category: req.body.category,
        isNew: req.body.isNew === 'on'
    });
    try {
        await post.save();
        res.redirect('/admin');
    } catch (err) {
        console.log(err);
    }
});

// पोस्ट एडिट करने का फॉर्म दिखाएगा
router.get('/edit/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.render('edit-post', { title: 'Edit Post', post: post });
    } catch (err) {
        console.log(err);
    }
});

// पोस्ट को अपडेट करेगा
router.post('/edit/:id', async (req, res) => {
    try {
        await Post.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            content: req.body.content,
            externalLink: req.body.externalLink,
            category: req.body.category,
            isNew: req.body.isNew === 'on'
        });
        res.redirect('/admin');
    } catch (err) {
        console.log(err);
    }
});

// पोस्ट को डिलीट करेगा
router.post('/delete/:id', async (req, res) => {
    try {
        await Post.findByIdAndDelete(req.params.id);
        res.redirect('/admin');
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;