const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const partySchema = new Schema({
    name: {type: String, require: true},
    members: {type: [String], require: true},
    playlistId: {type: String, require: false},
    playlists: {type: [String], require: false},
});


module.exports = mongoose.model("Party", partySchema);