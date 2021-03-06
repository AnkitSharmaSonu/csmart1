var sql = require("mssql");
var {failureResponseBody} = require('../../helpers/response')
var {sqlToResMatrixforAdmin}  = require('./responseMatrix')

async function getRequestforCheckerbyRequestId(req,res){
    try{
        var id = req.params['requestId']
        var mail = req.query['mail']
        //check mail id with authorzation header mail
        if(parseInt(id) && req.headers.mail == mail){
            requestRecord = await requestRecordsetsFromDatabase(queries("check_request_checker_by_requestId",id,mail)).catch(err=>{
                res.status(err.statusCode).send(err.body)
            })
            if(requestRecord.length != 0){
                requestDetails = await recordsforCheckerbyId(id,mail).catch(err=>{
                    res.status(err.statusCode).send(err.body)
                })
                if(requestDetails){
                    res.send(requestDetails)
                }

            }else{
                errMsg = failureResponseBody("Error","Not Found",404)
                res.status(errMsg.statusCode).send(errMsg.body)
            }

        }else{
            errMsg = failureResponseBody("Error","Parameters are invalid/missing",400)
            res.status(errMsg.statusCode).send(errMsg.body)
        }
    }
    catch(err){
        errMsg = failureResponseBody("Bad Request",err,400)
        res.status(errMsg).send(errMsg.body)
    }


}

async function recordsforCheckerbyId(id,mail){
    return new Promise(async(resolve,reject)=>{
        reqRecordset = await requestRecordsetsFromDatabase(queries("request_checker_by_requestId",mail,id)).catch(err=>{
            reject(err)
        })
        if(reqRecordset.length == 1){
            ////console.log("reqRecordset",reqRecordset)
            createdResponse = createResponse(reqRecordset[0])
            resolve(createdResponse)

        }else{
            errMsg = failureResponseBody("Error","Something Went Wrong!" ,400)
            reject(errMsg)
        }


    })
    
}

async function getAllRequestForChecker(req,res){
    try{
        mail  = req.query['mail']
        status = req.query['filter_status'] ? req.query['filter_status'] : null
        //console.log(status,"statussss")
        //check mail with Authorization Header
        if(req.headers.mail == mail){
            requestRecord = await requestRecordsetsFromDatabase(queries("check_request_checker_by_mail",mail)).catch(err=>{
                //console.log("err",err)
                res.status(err.statusCode).send(err.body)
            })
            if(requestRecord.length != 0){
                requestDetails = await recordsforCheckerbyMail(mail,status).catch(err=>{
                    //console.log("err",err)
                    res.status(err.statusCode).send(err.body)
                })
                if(requestDetails){
                    res.send(requestDetails)
                }

            }else{
                errMsg = failureResponseBody("Error","NotFound",404)
                //console.log("err",errMsg)
                res.status(errMsg.statusCode).send(errMsg.body)
            }


        }else{
            errMsg = failureResponseBody("Error","Mail Id is not available",400)
            res.status(errMsg.statusCode).send(errMsg.body)
        }
    }catch(err){
        //console.log("err",err)
        errMsg = failureResponseBody("Bad Request",err,400)
        res.status(errMsg.statusCode).send(errMsg.body)
    }
}

async function recordsforCheckerbyMail(mail,status){
    return new Promise(async(resolve,reject)=>{
        if(status){
            //console.log("hererererrererer")
            query = queries("request_checker_by_request_MailId_and_status",mail,status)
        }else{
            //console.log("iuiuioioioio")
            query = queries("request_checker_by_request_MailId",mail)
        }
        reqRecordset = await requestRecordsetsFromDatabase(query).catch(err=>{
            reject(err)
        })
        var listOfRecords = []
        if(reqRecordset.length >= 1){
            //console.log("reqRecordset",reqRecordset)
            for(eachRecord of reqRecordset){
                //console.log("here-->")
                createdResponse = createResponse(eachRecord)
                //console.log("createResponse",createdResponse)
                listOfRecords.push(createdResponse)
            }
            
            resolve(listOfRecords)

        }else{
            resolve([])
        }


    })
    
}


async function requestRecordsetsFromDatabase(query){
    return new Promise((resolve,reject)=>{
        var request = new sql.Request();
        request.query(query, async function (err, recordset){
            if(err){
                //console.log(err)
                reject(failureResponseBody("Error" , err, 400))
            }else {
                resolve(recordset.recordset)
            }
        })
    })
}
var queries = function (queryType, param1 , param2) {
    if(queryType == "check_request_checker_by_requestId"){
        query = `Select * from [maker_checker].[records] where RequestId = ${param1} and AdminMail = '${param2}'`
    }else if( queryType == "request_checker_by_requestId"){
        query = `select a.AdminMail,a.ResponseStatus,a.RequestId,b.UserMail,b.RequestDate,b.RequestPayload,a.PriorityOrder
        from  [maker_checker].[records] a
        Inner Join [maker_checker].[requestData] b
        On a.RequestId = b.RequestId
        where a.AdminMail = '${param1}' and a.RequestId = ${param2}`
    }else if(queryType == "check_request_checker_by_mail"){
        query = `Select * from [maker_checker].[records] where AdminMail = '${param1}'`  
    }else if(queryType =="request_checker_by_request_MailId"){
        query = `select a.AdminMail,a.ResponseStatus,a.RequestId,b.UserMail,b.RequestDate,b.RequestPayload
        from  [maker_checker].[records] a
        Inner Join [maker_checker].[requestData] b
        On a.RequestId = b.RequestId
        where a.AdminMail = '${param1}'`
    }else if(queryType == "request_checker_by_request_MailId_and_status"){
        query = `select a.AdminMail,a.ResponseStatus,a.RequestId,b.UserMail,b.RequestDate,b.RequestPayload
        from  [maker_checker].[records] a
        Inner Join [maker_checker].[requestData] b
        On a.RequestId = b.RequestId
        where a.AdminMail = '${param1}' and a.ResponseStatus = '${param2}'`
    }
    //console.log("Query----------->",query)
    return query
}
function createResponse(record){
    res  = {}
    Object.keys(sqlToResMatrixforAdmin).forEach(function(key) {
        console.log(key)
        if(key == "requestPayload"){
            console.log("here-------->")
            res[key] = JSON.parse(record[sqlToResMatrixforAdmin[key]])
        }else{
        res[key] = record[sqlToResMatrixforAdmin[key]]}
    });
    return res
}


module.exports = {
    getRequestforCheckerbyRequestId,getAllRequestForChecker
}
