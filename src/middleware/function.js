
function pad(num){
  return (num > 0 ? '' : '0') + num
}

exports.getDateTime = function(){
  const date = new Date()

  let tYear = date.getFullYear()
  let tMonth = pad(date.getMonth()+1)
  let tDay = pad(date.getDate())
  let tHour = pad(date.getHours())
  let tMinute = pad(date.getMinutes())

  return tYear + '-' + tMonth + '-' + tDay + ' ' + tHour + ':' + tMinute
}

