var aad = require('azure-ad-jwt');

let checkToken = (req, res, next) => {
    let token = req.headers["x-access-token"] || req.headers["authorization"];
    if (token && token.startsWith("Bearer ")) {
      token = token.slice(7, token.length);
      if (token) {
        aad.verify(token, null, function(err, decoded) {
            if (decoded) {
              //console.log(decoded)
                req.headers["mail"] = decoded.unique_name
                console.log("JWT is valid");
                next();
                

            } else {
              return res.status(401).json({
                  success: false,
                  message: "Token is not valid",
                  error: err
                })
            }
        });
      } else {
        
        return res.status(401).json({
          success: false,
          message: "Auth token is not supplied"
        });
      }
    } else {
      res.status(401).json({
        success: false,
        message: "Token is Empty"
      });
    }
};

module.exports = {
    checkToken
}