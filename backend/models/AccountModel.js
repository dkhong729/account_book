const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    time: {
        type: Date,
        default: Date.now
    },
    type: {
        type: Number,
        default: 1
    },
    account: {
        type: Number,
        required: true
    },
    remark: {
        type: String,
        default: ''
    },
    userId: {
        type: String,
        default: ''
    }
});

module.exports = mongoose.model('Account', AccountSchema); // 確保集合名稱統一
