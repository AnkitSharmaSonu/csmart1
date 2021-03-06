
var request = require('request');


var authToken;
function getResourceGroups(reqData,authToken){
	return new Promise((resolve,reject)=>{
		var options = {
			'method': 'GET',
			'url': ` https://management.azure.com/subscriptions/01ce3075-23cc-4058-9df8-b6888684a736/providers/Microsoft.Advisor/recommendations?api-version=2017-04-19&- $filter=Category eq 'Security`,
			'headers': {
			  'Authorization': authToken
			}
	  };
	  try{
		request(options, function (error, response) { 
			if (!error && response.statusCode ==200){
				resolve(JSON.parse(response.body))
			}else if(!error && response.statusCode>=400){
				reject(JSON.parse(response.body))
			}else{
				reject({"Error":"Not Available"})
			}
		})
	  }catch(error){
		  reject(error)
	  }

	
});
}

var another=resourceGroupList = async(req,res)=>{
	try{
		reqData = req.body
		authToken = req.header('Authorization')
		await getResourceGroups(reqData,authToken).then(results=>{
			res.send(results)
		}).catch(err=>{
			//sconsole.log(err)
			res.status(400).send({"Error":"Error in getting RG List"})
		})

	}catch(err){
		//console.log(err)
		res.status(404).send({"Error":"Error in fetching data. Please Try Again!"})

	}
}

module.exports={
another
}
