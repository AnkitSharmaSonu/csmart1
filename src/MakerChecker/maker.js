var sql = require("mssql");
// var queries = require('./queries')
var {failureResponseBody} = require('../../helpers/response')
var {sqlToResMatrixforUser}  = require('./responseMatrix')

async function getRequestforMakerbyRequestId(req,res){
    try{
        var id = req.params['requestId']
        var mail = req.query['mail']
        //check mail id with authorzation header mail
        if(parseInt(id) && req.headers.mail == mail){
            requestRecord = await requestRecordsetsFromDatabase(queries("request_maker_by_requestId",id,mail)).catch(err=>{
                res.status(err.statusCode).send(err.body)
            })
            if(requestRecord.length != 0){
                requestDetails = await recordsforMakerbyId(id,mail).catch(err=>{
                    res.status(err.statusCode).send(err.body)
                })
                if(requestDetails){
                    res.send(requestDetails)
                }

            }else{
                errMsg = failureResponseBody("Error","NotFound",404)
                res.status(errMsg.statusCode).send(errMsg.body)
            }

        }else{
            errMsg = failureResponseBody("Error","Parameters are invalid/missing",400)
            res.status(errMsg).send(errmsg.body)
        }
    }
    catch(err){
        errMsg = failureResponseBody("Bad Request",err,400)
        res.status(errMsg).send(errmsg.body)
    }


}

async function recordsforMakerbyId(id,mail){
    return new Promise(async(resolve,reject)=>{
        reqRecordset = await requestRecordsetsFromDatabase(queries("request_maker_by_requestId",id,mail)).catch(err=>{
            reject(err)
        })
        if(reqRecordset.length == 1){
            //console.log("reqRecordset",reqRecordset)
            createdResponse = createResponse(reqRecordset[0])
            resMsgsRecordset = await requestRecordsetsFromDatabase(queries("responseMessages_maker_by_requestId",mail,id)).catch(err=>{
                reject(err)
            })
            if(resMsgsRecordset.length >=1){
                createdResponse["responseMessage"]  = resMsgsRecordset

            }else{
                createdResponse["responseMessage"] = []
            }

            resolve(createdResponse)

        }else{
            errMsg = failureResponseBody("Error","Something Went Wrong!" ,400)
            reject(errMsg)
        }


    })
    
}

async function getAllRequestByMaker(req,res){
    try{
        mail  = req.query['mail']
        status = req.query['filter_status'] ? req.query['filter_status'] : null
        //console.log(status,"statussss")
        //check mail with Authorization Header
        if(req.headers.mail == mail){
            requestRecord = await requestRecordsetsFromDatabase(queries("request_maker_by_mail",mail)).catch(err=>{
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
            query = queries("request_maker_by_mail_and_status",mail,status)
        }else{
            //console.log("iuiuioioioio")
            query = queries("request_maker_by_mail",mail)
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

function createResponse(record){
    res  = {}
    Object.keys(sqlToResMatrixforUser).forEach(function(key) {
        if(key == "requestPayload"){
            res[key] = JSON.parse(record[sqlToResMatrixforUser[key]])
        }else{
        res[key] = record[sqlToResMatrixforUser[key]]}
    });
    return res
}

var queries = function (queryType, param1 , param2) {
    if(queryType == "request_maker_by_requestId"){
        query = `Select * from [maker_checker].[requestData] where RequestId = ${param1} and UserMail = '${param2}'`
    }else if( queryType == "responseMessages_maker_by_requestId"){
        query = `select a.AdminMail,a.ResponseMessage,a.ResponseStatus
        from  [maker_checker].[records] a
        Inner Join [maker_checker].[requestData] b
        On a.RequestId = b.RequestId
        where b.UserMail = '${param1}' and b.RequestId = ${param2}`
    }else if(queryType == "request_maker_by_mail"){
        query = `Select * from [maker_checker].[requestData] where UserMail = '${param1}'`  
    }else if(queryType =="request_maker_by_mail_and_status"){
        query = `Select * from [maker_checker].[requestData] where UserMail = '${param1}' and Status = '${param2}'`
    }
    //console.log("Query----------->",query)
    return query
}
module.exports = {
    getRequestforMakerbyRequestId,getAllRequestByMaker
}
