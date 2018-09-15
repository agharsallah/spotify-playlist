const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const partySchema = new Schema({
    name: {type: String, require: true},
    members: {type: [String], require: true},
});


module.exports = mongoose.model("Party", partySchema);