const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const queueLogSchema = new Schema({
    companyId: {
        type: Schema.Types.ObjectId,
        ref: 'Company'
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    problem: {
        type: Schema.Types.ObjectId,
        ref: 'Problem'
    },
    checkIn: {
        type: Date
    },
    status: {
        type: Boolean
    },
    duration: {
        type: Number
    }
}, {
    timestamps: true,
    versionKey: false
})

const QueueLog = mongoose.model('QueueLog', queueLogSchema);

module.exports = QueueLog;