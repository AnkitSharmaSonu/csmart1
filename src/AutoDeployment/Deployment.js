var fs = require("fs");
require('dotenv').config();
const { BlobServiceClient } = require('@azure/storage-blob');

async function sendZiptoBlob(fileName){
    try{
        return new Promise(async (resolve)=>{
            const blobName = './uploads/'+fileName; //path
            const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.blobConnectionString);
            // Get a reference to a container
            const containerClient = blobServiceClient.getContainerClient(process.env.blobContainerClient);
            const blockBlobClient = containerClient.getBlockBlobClient(fileName);
            fs.readFile(blobName, async function(err, data) {
                let arrayBuffer =  Uint8Array.from(data);
                console.log(arrayBuffer.length);
                const uploadBlobResponse = await blockBlobClient.upload(arrayBuffer, arrayBuffer.length);
                console.log('request-id',uploadBlobResponse.requestId);
                resolve('sucesss')
            });
        })
    }catch(err){
        console.log('Error: ',err)
    }    
}

async function sendtoBlob(file,res){
    try{
        await sendZiptoBlob(file).then(response=>{
            res.send({"Status": response})
        })
    }catch(err){
        res.status(400)
        res.send({"Error occurred ":err})
    }

}

module.exports = { sendtoBlob }