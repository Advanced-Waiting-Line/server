const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const problemSchema = new Schema({
    companyId: {
        type: Schema.Types.ObjectId,
        ref: 'Company'
    },
    name: {
        type: String
    },
    duration: {
        type: Number
    }
}, {
    timestamps: false
})

const Problem = mongoose.model('Problem', problemSchema);

module.exports = Problem;