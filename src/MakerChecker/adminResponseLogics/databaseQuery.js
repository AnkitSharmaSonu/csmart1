var sql = require("mssql");
const {getSqlDate} = require('../../../helpers/dateFormat')

async function updateRecords(reqBody) {
    return new Promise((resolve,reject)=>{
        var adminMail = reqBody["adminMail"]
        var requestId = reqBody["requestId"]
        var responseStatus = reqBody["status"]
        var responseMessage = reqBody["message"]
        var responseDate = getSqlDate(reqBody["responseTimestamp"])

        var request = new sql.Request();
        const query = `UPDATE [maker_checker].[records]
                        SET ResponseDate= '${responseDate}',
                        ResponseStatus= '${responseStatus}',
                        ResponseMessage= '${responseMessage}'
                        WHERE RequestId= ${requestId}
                        AND AdminMail= '${adminMail}'`

        request.query(query, async function (err, recordset) {
            if (err) {
                reject(err.message)
            }else{
                resolve("Data updated successfully..!!!")
            }
        })
    })

}

async function fetchRecords(reqBody,csmartId) {
    return new Promise((resolve,reject)=>{
        var mailId = reqBody["adminMail"]
        var priorityOrder = reqBody["priorityOrder"] //need to add in payloadd

        var request = new sql.Request();
        const query = `SELECT PriorityOrder, MailId
                        FROM [insights].[userInfoDuplicate]
                        WHERE PriorityOrder= (SELECT PriorityOrder as p 
                            FROM [insights].[userInfoDuplicate]
                            WHERE MailId= '${mailId}' 
                                AND Csmart_id= '${csmartId}') + 1`

        request.query(query, async function (err, recordset) {
            if (err) {
                reject(err.message)
            }else{
                resolve(recordset.recordset)
            }
        })
    })

}

async function updateStatus(reqBody) {
    return new Promise((resolve,reject)=>{
        var requestId = reqBody["requestId"]
        var responseStatus = reqBody["status"]

        var request = new sql.Request();
        const query = `UPDATE [maker_checker].[requestData]
                        SET Status= '${responseStatus}'
                        WHERE RequestId= ${requestId}`

        request.query(query, async function (err, recordset) {
            if (err) {
                reject(err.message)
            }else{
                resolve("Data updated successfully..!!!")
            }
        })
    })

}

async function insertRecords(reqBody) {
    return new Promise((resolve,reject)=>{
        var adminMail = reqBody["adminMail"]
        var requestId = reqBody["requestId"]
        var priorityOrder = reqBody["priorityOrder"]
        var responseDate = null //reqBody["responseTimestamp"]
        var responseStatus = 'Pending'   //reqBody["responseStatus"]
        var responseMessage = null  //reqBody["responseMessage"]

        if(adminMail && requestId && priorityOrder){
            var request = new sql.Request();
            const query = `INSERT INTO [maker_checker].[records] VALUES 
                            ('${adminMail}','${priorityOrder}',
                            ${responseDate},${requestId},
                            '${responseStatus}',${responseMessage});`

            request.query(query, async function (err, recordset) {
                if (err) {
                    reject(err)
                }else{
                    resolve("Data inserted successfully..!!!")
                }
            })
        }else{
            reject("Invalid Request")
        }
    })

}

module.exports = { updateRecords, fetchRecords, updateStatus, insertRecords }