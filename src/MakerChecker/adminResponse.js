const {adminResponseLogic} = require('./adminResponseLogics/main')

async function adminResponse(req,res){
    try{
        var reqBody = req.body
        var mail = req.headers.mail
        var csmartId = req.headers.csmartid
        await adminResponseLogic(reqBody,mail,csmartId).then(response =>{
            res.send({"Success":response})
        }).catch(error => {
            res.statusCode = 400
            res.send({"Error":error})
        })

    }
    catch(error) {
        res.statusCode = 400
        res.send("Error occurred..!!! Please try again."+error)
    }	
}


module.exports = { adminResponse }