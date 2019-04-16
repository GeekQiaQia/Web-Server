const express = require('express');
const router = express.Router();

const userApi = require('../api/api/user-api');
const controllerApi = require('../api/api/controller-api');
const robotApi = require('../api/api/robot-api');
const roleApi = require('../api/api/role-api');
const traceApi = require('../api/api/trace-api');
const code = require('../api/code/code');
const logger = require('../logger/logger').loggerWeb;
const valid = require('../token/token').valid();

router.post('/all', valid, function (request, response, next) {
	Promise.all([
		userApi.count(),
		robotApi.count(),
		controllerApi.count(),
		roleApi.count(),
		traceApi.statics()
	]).then(res => {
		return response.json({
			code: code.CODE_OP_SUCCESS,
			data: {
				user: res[0],
				robot: res[1],
				controller: res[2],
				role: res[3],
				statics:res[4]
			}
		})
	}).catch(err => {
		return response.json({
			code: code.CODE_OP_ERROR,
			message: err.toString()
		})
	})

});
// router.post('/statics', valid, function (request, response, next) {
// 	traceApi.statics()
// 		.then(res => {
// 			return response.json({
// 				code: code.CODE_OP_SUCCESS,
// 				data:res,
// 			});
// 		})
// 		.catch(err => {
// 			return response.json({
// 				code: code.CODE_OP_ERROR,
// 				message: err.toString()
// 			})
// 		})
//
//
// });


module.exports = router;
