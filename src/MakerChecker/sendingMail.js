require('dotenv').config();
const sgMail = require("@sendgrid/mail");

function sendMailToReceipt(details){
    return new Promise(async(resolve,reject)=>{
        const emailAddress = details.email;
        sgMail.setApiKey(process.env.sendGridKey);
        mailConfig = await detailsForSendingMail(details.role,details.requestId,details.response).catch(err=>{
            reject(err)
        })
        if(mailConfig){
            let msg = {};
            msg["to"] = emailAddress
            msg["from"] = process.env.senderMail;
            msg["subject"] = mailConfig.subject;
            msg["text"] = "Hello";
            msg["html"] = mailConfig.dataHtml;
          console.log("message before sending mail++++++++++++", msg);
          sgMail
            .send(msg)
            .then(() => {
              console.log("Email sent");
              resolve("success")
            })
            .catch((error) => {
              console.log("error", error.response.body);
              reject(error)
            });

        }

    })
}

let subjectForMail = {
    "admin":"admin subject",
    "user" : {
        "approved":"approved subject",
        "disapproved" : "disapproeved subject"
    }
}
function detailsForSendingMail(role,requestId,response){
    return new Promise((resolve,reject)=>{
        let subject;
        let roleForSubject = role.toLowerCase()
        let responseForSUbject = response.toLowerCase()
        if( roleForSubject == "admin")
            subject = subjectForMail[roleForSubject]
        else{
            subject = subjectForMail[roleForSubject][response]
        }
        resolve({"subject":subject})
    }) 
}

module.exports = {sendMailToReceipt}
    
    // fs.readFile(createUserTemplate, "UTF-8", function (err, htmlData) {
    //     if (err) {
    //       console.log("error while reading the html file", err);
    //     } else {
    //       let dataHtml = htmlData;
    //       dataHtml = dataHtml.replace("<accountName>", accountName);
    //       dataHtml = dataHtml.replace("<fleetCode>", fleetCode);
    //       dataHtml = dataHtml.replace("<address>", accountAddress);
    //       dataHtml = dataHtml.replace("<contactName>", contactName);
    //       dataHtml = dataHtml.replace("<contactPhone>", contactPhone);
    //       dataHtml = dataHtml.replace("<contactEmail>", contactEmail);
    //       let msg = {};
    //       msg["to"] = emailAddress
    //       msg["from"] = process.env.senderMail;
    //       msg["subject"] = subject;
    //       msg["text"] = "Hello";
    //       msg["html"] = dataHtml;
    //       console.log("message before sending mail++++++++++++", msg);
    //       sgMail
    //         .send(msg)
    //         .then(() => {
    //           console.log("Email sent");
    //         })
    //         .catch((error) => {
    //           console.log("error", error.response.body);
    //         });
    // }
    // });




