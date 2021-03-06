function failureResponseBody(status,message,statusCode){
    return({"statusCode": statusCode,
            "body": {
                "status" : status,
                "message"  : message
            }
        })
}

function successResponseBody(status,message,statusCode){
    return({"statusCode": statusCode,
            "body": {
                "status" : status,
                "message"  : message
            }
        })
}


module.exports  =  {
    failureResponseBody,successResponseBody
}