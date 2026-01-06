const mongoose = require('mongoose');

const recordingSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true,
        default: "New Recording"
    },
    artist: { 
        type: String, 
        default: ""
    },
    date: { 
        type: Date, 
        default: Date.now 
    },
    
    events: [{
        note: { type: Number, required: true },
        type: { type: String, required: true },
        time: { type: Number, required: true }
    }]
});

module.exports = mongoose.model('Recording', recordingSchema);