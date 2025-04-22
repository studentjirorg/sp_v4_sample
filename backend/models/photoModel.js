var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Define comment schema
var commentSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    postedBy: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

var reportSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    postedBy: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }
})


var photoSchema = new Schema({
    'name': String,
    'path': String,
    'postedBy': {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    'message': String,
    'views': Number,
    'likes': Number,
    'dislikes': {
        type: Number,
        default: 0
    },
    'likedBy': [{
        type: Schema.Types.ObjectId,
        ref: 'user'
    }],
    'dislikedBy': [{
        type: Schema.Types.ObjectId,
        ref: 'user'
    }],
    'reports' : [reportSchema],
    'comments': [commentSchema],
    'createdAt': {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('photo', photoSchema);