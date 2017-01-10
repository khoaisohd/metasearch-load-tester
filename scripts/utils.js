function post(url, requestBody) {
  return new Promise((resolve, reject) => {
    request.post({
      url: url,
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'content-type': 'application/json'
      }
    }, (error, resp, body) => {
      if (error) {
      } else {
        resolve(JSON.parse(body));
      }
    });
  });
}

function formatDate(date) {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
}

function randomInt(minDay, maxday) {
  return Math.floor(Math.random() * (maxday - minDay + 1)) + minDay;

}

function createDateWithAdditionalDay(days) {
  var date = new Date();
  var newDate = new Date(date.setTime( date.getTime() + days * 86400000 ));
  return formatDate(newDate).toString();
}

function delay(time) {
  return new Promise(resolve => setTimeout(() => resolve(), time));
}
