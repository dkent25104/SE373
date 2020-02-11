const mongoose = require('mongoose');
module.exports = mongoose.model('User', {   //Exports model to use in another file
    name: {type: String},
    email: {type: String}
});