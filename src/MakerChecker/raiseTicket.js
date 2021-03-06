
var sql = require("mssql");
var {failureResponseBody,successResponseBody} = require('../../helpers/response')
var {sendMailToReceipt} = require('./sendingMail')
var {newTicketMatrix,sqlParametersforSP}  = require('./responseMatrix')
var routeMapping = require('../../helpers/matrix.json')

async function createTicket(req,res){
    try{
        reqBody = req.body
        mail = reqBody.requestor 
        csmartId = req.headers.csmartid
        console.log("header...",req.body)
        if(req.headers.mail == mail && csmartId){
            createdTicket = await requestTicketController(reqBody,csmartId).catch(err=>{
                res.status(err.statusCode).send(err.body)
            })
            if(createdTicket){
                res.send(createdTicket)
            }

        }else{
            errMsg = failureResponseBody("Error","MailId/csmartId is not valid",400)
            res.status(errMsg.statusCode).send(errMsg.body)
        }
    }catch(err){
        //console.log(err)
        errMsg = failureResponseBody("Error",err,404)
        res.status(errMsg.statusCode).send(errMsg.body)
    }
}

async function requestTicketController(reqBody,csmartId){
    return new Promise(async(resolve,reject)=>{

        resFromDB = await recordsetsFromDatabase(reqBody,csmartId).catch(err=>{
            //console.log("here",err)
            errMsg = failureResponseBody("Error",err,400)
            reject(errMsg)
        })
        if(resFromDB && resFromDB.adminMail != null && resFromDB.requestId != null){
            let detailsForSendingMail = {
                role:"Admin",
                email : resFromDB.adminMail,
                response:"",
                requestId:resFromDB.requestId   
            }
            mailSent = await sendMailToReceipt(detailsForSendingMail).catch(err=>{
                error = "error in sending Mail"+err
                errMsg = failureResponseBody("Error",error,400)
                reject(errMsg)
            })
            if(mailSent){
                res = successResponseBody("success","Request Sent Succesfully",200)
                resolve(res)
            }
            //console.log("mail send to admin")

            
        }
    })
}

async function recordsetsFromDatabase(reqBody,csmartId){
    return new Promise((resolve,reject)=>{
        var request = new sql.Request();

        let body = reqBody[newTicketMatrix["RequestPayload"]]
        var routeStr = routeMapping[body.Name]
        var reqJsonString = JSON.stringify(body)

        /* Input Parameters */
        request.input("UserMail", sql.VarChar(200), reqBody[newTicketMatrix["UserMail"]])
        request.input("RequestDate", sql.DateTime, reqBody[newTicketMatrix["RequestDate"]])
        request.input("RequestPayload", sql.VarChar(500), reqJsonString)
        request.input("RoutePrefix", sql.VarChar(200), routeStr)
        request.input("Status", sql.VarChar(200), "Pending")
        request.input("Csmart_Id", sql.VarChar(200), csmartId)
        request.input("PriorityOrder", sql.Int, 1)

        /* Output Paramters */
        request.output("Name", sql.VarChar(200))
        request.output("RequestId", sql.Int)
        /* Execute Stored Procedure */
        request.execute(`[dbo].[makerChecker_save_user_request]` , async function (err, recordset){
            if(err){
                error = "Error in SP" + err
                reject(failureResponseBody("Error" , error, 400))
            }else {
                let resFromSP = {
                    "adminMail": recordset.output.Name,
                    "requestId" : recordset.output.RequestId
                };
                resolve(resFromSP)
            }
        })
    })
}


module.exports = {
    createTicket
}