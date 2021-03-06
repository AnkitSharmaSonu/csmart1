var express = require('express');
var router = express.Router();
const addRG = require("../Scripts/ResourceGroup")

router.post('/create',async(req,res)=>{
    await addRG.resourceGroupOrchestration(req).then((results)=>{
        res.send(results)
    }).catch(err=>{
        res.status(400).send(err)
    })
    
})

module.exports = router;