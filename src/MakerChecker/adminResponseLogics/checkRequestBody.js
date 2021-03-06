async function checkRequestBody(reqBody,mail,csmartId) {
    return new Promise(async (resolve,reject)=>{

        if(!reqBody || !reqBody["userMail"] || !reqBody["adminMail"] || !reqBody["requestId"]
            || !reqBody["message"] || !reqBody["status"] || !reqBody["responseTimestamp"] 
            || !reqBody["priorityOrder"] || !mail || !csmartId )
        {
            if(!reqBody || JSON.stringify(reqBody)==='{}'){
                console.log("Error: Request body is missing.")
            }else{
                console.log("Error: Attribute missing.")
            }
    
            reject("Invalid Request")
    
        }else{
            resolve("Valid Request")
        }
    })

}

module.exports = { checkRequestBody }