'use strict';

const request = require('request');
// const SEARCH_ENDPOINT = `http://akasha-services-elb-2.bezurk.org/metasearch/hotels/searches`;
 const SEARCH_ENDPOINT = `https://services-staging.bezurk.org/metasearch/hotels/searches`;

let totalCount = 0;
let totalLatency = 0;

const mins = 10;
const numberOfSearch = 60;

const COUNT = numberOfSearch * mins;
let errorCount = 0;

for (let i = 0; i < COUNT; i++) {
  delay(60000 * mins / COUNT * i).then(() => simulateSearch(i));
}

// testOneRequest();

const locationCodes = ["ROM", "DPS", "PAR", "BJS", "LON", "LED", "SHA", "BCN", "MOW", "IST", "RIO", "CHQ", "HKT", "CAN", "SPU", "MIL",
  "GOI", "DEL", "BUD", "FLR"];

function simulateSearch(id) {
  const checkInDays = randomInt(0, 100);
  const checkOutDays = randomInt(checkInDays + 1, checkInDays + 20);

  let request = {
    search: {
      cityCode: locationCodes[randomInt(0, locationCodes.length - 1)],
      roomsCount:1,
      guestsCount:2,
      checkIn: createDateWithAdditionalDay(checkInDays),
      checkOut: createDateWithAdditionalDay(checkOutDays),
      locale: 'en',
      siteCode: 'SG',
      currencyCode: 'USD',
      deviceType: 'mobile',
      appType: 'IOS_APP',
      userCountryCode: 'SG'
    }
  };

  console.log("Id: " + id);

  let promise = Promise.resolve();

  // const delays = [0.3, 0.6, 0.9, 2.4, 4.8, 5, 6, 0]

  const delays = [1, 3, 4, 5, 6, 6, 6, 0];

  delays.forEach(delay => {
    promise = promise.then(() => post(SEARCH_ENDPOINT, request)
      .then(res => {
        request.search.id = res.search.id;
        request.lastRatesCount = res.ratesCount;
        console.log(`id: ${id}, ratesCount: ${res.ratesCount || 0}`)
        console.log(`errorCount: ${errorCount}`);
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
      totalLatency += after - before;
      totalCount ++;
      console.log("Latency : " + (after - before));
      console.log("Latency Per request: " + (totalLatency / totalCount));

      if (error) {
        console.log(error);
        reject();
      } else {
        try {
          resolve(JSON.parse(body));
        } catch(error) {
          console.log(body);
          console.log(error);
          errorCount++;
          reject();
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
