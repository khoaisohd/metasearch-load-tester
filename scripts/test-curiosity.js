'use strict';

const request = require('request');
const SEARCH_ENDPOINT = `https://services-staging.bezurk.org/metasearch/flights/searches`;

const mins = 10;
const numberOfSearch = 180;

const COUNT = numberOfSearch * mins;

for (let i = 0; i < COUNT; i++) {
  delay(60000 * mins / COUNT * i).then(() => simulateSearch(i));
}

function simulateSearch(id) {
  const outbound = randomInt(0, 100);
  const inbound = randomInt(outbound + 1, outbound + 100);

  let request = {
    search: {
      cabin: "economy",
      adultsCount: 1,
      childrenCount: 0,
      infantsCount: 0,
      siteCode: "SIN",
      currencyCode: "USD",
      locale: "en",
      trips: [
        {
          departureCode: "SIN",
          arrivalCode: "DXB",
          outboundDate: createDateWithAdditionalDay(outbound),
          inboundDate: createDateWithAdditionalDay(inbound)
        }
      ]
    }
  };

  console.log("Id: " + id);

  let promise = Promise.resolve();

  const delays = [1, 3, 4, 5, 6, 6, 6, 0];

  delays.forEach(delay => {
    promise = promise.then(() => post(SEARCH_ENDPOINT, request)
      .then(res => {
        request.search.id = res.search.id;
        request.processedFaresCount = res.processedFaresCount;
        console.log(`id: ${id}, processedFaresCount: ${res.processedFaresCount}`)
      }).then(() => {
        return new Promise(resolve => setTimeout(() => resolve(), delay * 1000));
      }));
  });

}

function post(url, requestBody) {
  let before = new Date();
  return new Promise((resolve, reject) => {
    request.post({
      url: url,
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'content-type': 'application/json'
      }
    }, (error, resp, body) => {
      let after = new Date();
      console.log("Latency: " + (after - before));
      if (error) {
        console.log(error);
        reject();
      } else {
        try {
          resolve(JSON.parse(body));
        } catch(error) {
          console.log(body);
          console.log(error);
          throw("STOP");
        }
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
