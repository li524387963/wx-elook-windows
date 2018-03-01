const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const formatTime1 = date => {
 
  const month = date.getMonth() + 1
  const day = date.getDate()
 

  return [month, day].map(formatNumber).join('.') 
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
var validateEmail = function (email) {
  var reg = '^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$'
  return reg.test(email)
}


module.exports = {
  formatTime: formatTime,
  formatTime1: formatTime1,
  validateEmail: validateEmail,
  
}
