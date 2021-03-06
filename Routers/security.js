var express = require('express');
var router = express.Router();
var {getRequestforCheckerbyRequestId,getAllRequestForChecker} = require('../src/MakerChecker/checker')
var {getRequestforMakerbyRequestId,getAllRequestByMaker} = require('../src/MakerChecker/maker')
var {createTicket} = require('../src/MakerChecker/raiseTicket')
var {adminResponse} = require('../src/MakerChecker/adminResponse')

var {another}=require('../practice')

router.get('/admin/requests/:requestId',getRequestforCheckerbyRequestId)
router.get('/admin/requests',getAllRequestForChecker)
router.get('/user/requests/:requestId',getRequestforMakerbyRequestId)
router.get('/user/requests',getAllRequestByMaker)
router.post('/raiseTicket',createTicket)
router.post('/admin-response',adminResponse)
router.get('./callsimple',another)

module.exports = router;