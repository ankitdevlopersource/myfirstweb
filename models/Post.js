// models/Post.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    // ब्लॉग का पूरा कंटेंट यहाँ सेव होगा
    content: {
        type: String,
        required: true
    },
    // पुराना 'link' फील्ड अब वैकल्पिक है
    externalLink: {
        type: String,
        required: false // यह ज़रूरी नहीं है
    },
    category: {
        type: String,
        required: true
    },
    isNew: {
        type: Boolean,
        default: true
    }
}, { timestamps: true, suppressReservedKeysWarning: true });

const Post = mongoose.model('Post', postSchema);
module.exports = Post;