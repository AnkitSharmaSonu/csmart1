const {updateRecords, fetchRecords, updateStatus} = require('./databaseQuery')
const {checkRequestBody} = require('./checkRequestBody')
const {processRaiseTicketRequestLogic} = require('./processRaiseTicketRequest')
const {sendMailToReceipt} = require('../sendingMail')

function adminResponseLogic(requestBody,mail,csmartId) {
    return new Promise(async (resolve,reject)=>{

        await checkRequestBody(requestBody,mail,csmartId).then(async response=> {
            var status = requestBody["status"]
            
            if(mail === requestBody["adminMail"]) {
                await updateRecords(requestBody).then(result=>{
                    console.log("Response recorded !!!")
                }).catch(err=>{
                    console.log("Error occurred: ",err)
                    reject("Error occurred while updating records..!!!"+err.message)
                })
        
                if(status === "approved"){
                    await approvedLogic(requestBody,csmartId).then(response=>{
                        resolve(response)
                    }).catch(error=>{
                        reject(error)
                    })
                }
                else if(status === "disapproved"){
                    await disapprovedLogic(requestBody).then(response=>{
                        resolve(response)
                    }).catch(error=>{
                        reject(error)
                    })
                }

            }else{
                reject("Requestor is Invalid.")
                // reject("Requestor missing. Please check headers.")
            }
        
        }).catch(err=>{
            reject(err)
        })

    })
    
}

function approvedLogic(requestBody,csmartId) {
    return new Promise(async (resolve,reject)=>{
        await fetchRecords(requestBody,csmartId).then(async result=>{
            if(result.length ===0){ 
                await updateStatus(requestBody).then(async result=>{
                    let details = {
                        role:"User",
                        email: requestBody["userMail"],
                        response: requestBody["status"],
                        requestId: requestBody["requestId"]
                    }
                    await sendMailToReceipt(details).then(response=>{
                        console.log("Trigger mail to user successfully..!!!")
                        resolve(response)
                    }).catch(err=>{
                        console.log("Error occurred: ",err)
                        reject("Error occurred while sending mail to user"+err.message)
                    })
                }).catch(err=>{
                    console.log("Error occurred: ",err)
                    reject("Error occurred while updating status..!!!"+err.message)
                })
            }
            else{
                var payload= {
                    "requestor": requestBody["userMail"],
                    "responseTimestamp": requestBody["responseTimestamp"],
                    "requestId": requestBody["requestId"],
                    "priorityOrder": result[0]["PriorityOrder"],
                    "adminMail": result[0]["MailId"]
                }

                //"Processing raise ticket request."
                await processRaiseTicketRequestLogic(payload).then(async result =>{
                    let details = {
                        role:"Admin",
                        email: payload["adminMail"],
                        response:"",
                        requestId: payload["requestId"]
                    }                
                    await sendMailToReceipt(details).then(response=>{
                        console.log("Trigger mail to admin successfully..!!!")
                        resolve(response)
                    }).catch(err=>{
                        console.log("Error occurred: ",err)
                        reject("Error occurred while sending mail to user"+err.message)
                    })                
                    resolve(result)

                }).catch(err => {
                    console.log("Error occurred: ",err)
                    reject("Error occurred while raising ticket request: "+err.message)
                })

            }
        }).catch(err=>{
            console.log("Error occurred: ",err.message)
            reject("Error occurred while fetching data from database "+err.message)
        })
    })
}

function disapprovedLogic(requestBody) {
    return new Promise(async (resolve,reject)=>{
        await updateStatus(requestBody).then(result=>{
            resolve(result)
        }).catch(err=>{
            console.log("Error occurred: ",err)
            reject("Error occurred while updating status..!!!"+err.message)
        })

        let details = {
            role:"User",
            email: requestBody["userMail"],
            response: requestBody["status"],
            requestId: requestBody["requestId"]
        }
        await sendMailToReceipt(details).then(response=>{
            console.log("Trigger mail to user successfully..!!!")
            resolve(response)
        }).catch(err=>{
            console.log("Error occurred: ",err)
            reject("Error occurred while sending mail to user"+err.message)
        })
    })
}

module.exports = { adminResponseLogic }