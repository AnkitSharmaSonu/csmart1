var sql = require("mssql");

var sqlToResMatrixforAdmin = {
    "adminMail" : "AdminMail",
    "requestId" :"RequestId",
    "userMail":"UserMail",
    "requestPayload":"RequestPayload",
    "requestDate":"RequestDate",
    "status":"ResponseStatus",
    "priorityOrder":"PriorityOrder"

}

var sqlToResMatrixforUser = {
    "requestId" :"RequestId",
    "userMail":"UserMail",
    "requestPayload":"RequestPayload",
    "requestDate":"RequestDate",
    "routePrefix" : "RoutePrefix",
    "status":"Status"

}

var newTicketMatrix = {
    "UserMail": "requestor",
    "RequestDate" : "timestamp",
    "RequestPayload" : "requestPayload",
    "RoutePrefix" : "routePrefix",
    "Status" : "status",
    "Csmart_Id" :"csmartId",
    "PriorityOrder" : "priorityOrder"
}
var sqlParametersforSP = [
    {
        "name":"UserMail",
        "type": sql.VarChar(200),
        "value":""
    },
    {
        "name":"RequestDate",
        "type":sql.DateTime,
        "value":""
    },
    {
        "name":"RequestPayload",
        "type":sql.VarChar(500),
        "value":""
    },
    {
        "name":"RoutePrefix",
        "type":sql.VarChar(200),
        "value":""
    },
    {
        "name": "Status",
        "type":sql.VarChar(200),
        "value":"Pending"
    },
    {
        "name":"Csmart_Id",
        "type":sql.VarChar(200),
        "value":""
    },
    {
        "name":"PriorityOrder",
        "type":sql.Int,
        "value":1
    }
]


module.exports = {
    sqlToResMatrixforAdmin,sqlToResMatrixforUser,newTicketMatrix,sqlParametersforSP
}