const Schema = require('mongoose').Schema;
const traceSchema = new Schema({
	ctrlId: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: 'Controller'
	},
	robotId: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: 'Robot'
	},
	time: {
		type: Date,
		default: Date.now,
	},
	type: {
		type: String,
		required: true,
	},
	other: {
		type: Schema.Types.Mixed,
		default: {},
	}
});
module.exports = traceSchema;
