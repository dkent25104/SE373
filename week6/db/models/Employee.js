const mongoose = require('mongoose');
module.exports = mongoose.model('Employee', {
    firstName: {type: String},
    lastName: {type: String},
    department: {type: String},
    startDate: {type: Date},
    jobTitle: {type: String},
    salary: {type: Number}
});