var sql = require("mssql");
var {failureResponseBody} = require('../../helpers/response')

async function recordsetsFromDatabase(query){
    return new Promise((resolve,reject)=>{
        var request = new sql.Request();
        request.query(query, async function (err, recordset){
            if(err){
                console.log(err)
                reject(failureResponseBody("Error" , err, 400))
            }else {
                resolve(recordset.recordset)
            }
        })
    })
}


module.export = {
    recordsetsFromDatabase
}