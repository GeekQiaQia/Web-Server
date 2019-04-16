const traceSchema = require('../schemas/trace-schema');
const mongoose = require('mongoose');

module.exports = mongoose.model('Trace', traceSchema);
