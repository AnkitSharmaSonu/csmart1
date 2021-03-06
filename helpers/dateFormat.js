//Get Date in SQL Format 
module.exports.getSqlDate = (timestamp)=>{
    sqlFormattedDate = new Date(timestamp).toSqlFormat()
    return sqlFormattedDate
}

Date.prototype.toSqlFormat = function () {
    return (
      this.getUTCFullYear() +
      "-" +
      twoDigits(1 + this.getUTCMonth()) +
      "-" +
      twoDigits(this.getUTCDate()) +
      " " +
      twoDigits(this.getUTCHours()) +
      ":" +
      twoDigits(this.getUTCMinutes()) +
      ":" +
      twoDigits(this.getUTCSeconds())
    );
};
  
function twoDigits(d) {
if (0 <= d && d < 10) return "0" + d.toString();
if (-10 < d && d < 0) return "-0" + (-1 * d).toString();
return d.toString();
}