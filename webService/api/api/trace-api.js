const TraceModel = require('../models/trace-model');

module.exports = {
	save: function (item) {
		let user = new TraceModel(item);
		user.save().catch(err => {
			console.log(err.message)
		});
	},
	statics: function () {
		return TraceModel
			.aggregate()
			.match({type: 'start'})
			.project({
				date: {$dateToString: {format: "%m/%d %H时", date: {$add: ['$time', 28800000]}}}
			})
			.group({
				_id: "$date",
				total: {'$sum': 1},
			})
			.sort({_id: -1})
			.limit(24)
			.sort({_id: 1})
			.exec();
	},
	getList: function (page, limit, lte, gte) {
		if (page && limit) {
			let skip = (page - 1) * limit;
			if (lte && gte) {
				return Promise.all([
					TraceModel
						.find()
						.sort({time: -1})
						.where('time')
						.gte(gte)
						.lte(lte)
						.skip(skip)
						.limit(limit)
						.populate({path: 'robotId', select: ['RobotName','robotId']})
						.populate({path: 'ctrlId', select: 'Account'})
						.exec(),
					TraceModel
						.where('time')
						.gte(gte)
						.lte(lte)
						.count()
						.exec()
				])
			} else {
				return Promise.all([
					TraceModel
						.find()
						.sort({time: -1})
						.skip(skip)
						.limit(limit)
						.populate({path: 'robotId', select: 'RobotName'})
						.populate({path: 'ctrlId', select: 'Account'})
						.exec(),
					TraceModel.count().exec()
				])
			}

		} else {
			return Promise.all([
				TraceModel
					.find()
					.populate({path: 'robotId', select: 'RobotName'})
					.populate({path: 'ctrlId', select: 'Account'})
					.exec(),
				TraceModel.count().exec()
			])
		}
	}
};
