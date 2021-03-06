const {insertRecords} = require('./databaseQuery')

async function processRaiseTicketRequestLogic(reqBody) {
    try{
        return new Promise(async (resolve,reject)=>{

            if(reqBody){
                await insertRecords(reqBody).then(result=>{
                    resolve(result)
                }).catch(err=>{
                    console.log("Error occurred: ",err)
                    reject("Error occurred while inserting data into database: "+err)
                })
            }else{
                reject("Invalid Request")
            }
     
        })
    }catch(error){
        console.log(error)
        reject("Something went Wrong. Please try Again"+error)
    }
    
}

module.exports = { processRaiseTicketRequestLogic }