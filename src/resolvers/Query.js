const {
  request
} = require('graphql-request');

const _ = require('lodash');
const url = "http://35.203.42.156:8081/";
const bikeCode = 11;
const pietonCode = 10;
const camionLeger = 1;
const camionLourd = 2;
const camion = 14;
const camionPorteur = 15;
const camionArticule = 16;

const etsProportions = async () => {
  
  const totalQuery = `{
    trafficLightCount(intersection: "Notre-Dame / Peel", bankCode: 0 ) {
      bankCode,
      date,
      WBT,
      WBLT,
      WBRT,
      WBUT,
      EBT,
      EBLT,
      EBRT,
      EBUT,
      NBT,
      NBLT,
      NBRT,
      NBUT,
      SBT,
      SBLT,
      SBRT,
      SBUT,
      northApproach,
      southApproach,
      westApproach,
      eastApproach
    }
  }`;

  res = await request(url, totalQuery);

  var rawTotalCount = res.trafficLightCount;

  var totalCount = 0;
  var bikeCount = 0;
  var carCount = 0;
  var pedestrianCount = 0;
  rawTotalCount.forEach(element => {

    // loop all traffic readings and add every count from all direction, ignore bankcode value
    totalSingleRead = 0

    var readDate = new Date(element.date);
    var readYear = readDate.getFullYear();
    if(readYear < 2014 || readYear > 2018) {
      console.log(`date out of bound: ${element.date}`);
    }



    for (let key in element) {
      if(element.hasOwnProperty(key) && key != "bankCode" && key != "date"){
        totalSingleRead += element[key];
      }
    }

    // add to bike count if reading is bike code
    if(element.bankCode == bikeCode) bikeCount += totalSingleRead;

    // add to pedestrian count if reading is pedestrian
    if(element.bankCode == pietonCode) pedestrianCount += totalSingleRead;

    // add to car count
    if(element.bankCode == 0) {
      carCount += totalSingleRead;
    }

    // add to total everytime
    totalCount += totalSingleRead;
  });


  console.log(`total count: ${totalCount}, ${bikeCount} are on bike, ${pedestrianCount} are on foot, ${carCount} are in cars`);

  breakDownList = [];
  breakDownList.push({"category": "Autos", "percentage": Math.round(carCount / totalCount * 100)})
  breakDownList.push({"category": "Pietons", "percentage": Math.round(pedestrianCount / totalCount * 100)})
  breakDownList.push({"category": "Velos", "percentage": Math.round(bikeCount / totalCount * 100)})

  return breakDownList;

};

const thatsAWholeLotOfCommutes = async () => {
  results = [];
  const query = `{
    trafficLightCount(beginHour:5, endHour:9) {
      intersectionName,
      WBT,
      WBLT,
      WBRT,
      WBUT,
      EBT,
      EBLT,
      EBRT,
      EBUT,
      NBT,
      NBLT,
      NBRT,
      NBUT,
      SBT,
      SBLT,
      SBRT,
      SBUT,
      northApproach,
      southApproach,
      westApproach,
      eastApproach
    }
  }`;

  res = await request(url, query);

  var rawTrafficLight = res.trafficLightCount;

  rawTrafficLight.forEach(element => {
    //check if intersection isnt in the result object and add it
    // find the intersection obj id
    var intersectionID = results.findIndex( (el) => {
      return el.intersection == element.intersectionName
    })
    if(intersectionID < 0 /*&& !results[intersectionID].hasOwnProperty(element.intersectionName)*/) {
      results.push({"intersection": element.intersectionName, "numberOfCommuters": 0});
    }

    // compute total amount of commuter, regardless of category
    var totalSingleRead = 0;
    for (let key in element) {
      if(element.hasOwnProperty(key) && key != "intersectionName"){
        totalSingleRead += element[key];
      }
    }

    // find the intersection obj id
    intersectionID = results.findIndex( (el) => {
      return el.intersection == element.intersectionName
    })

    // update number of commuter with single measure total
    results[intersectionID].numberOfCommuters += totalSingleRead;
  });

  results = _.reverse(_.orderBy(results, ["numberOfCommuters"]));

  return results;

};

const whereDoPedestriansGo = async () => {
  northCount = southCount = westCount = eastCount = 0;
  const query = `{
    trafficLightCount(bankCode: ${pietonCode} ) {
      northApproach,
      southApproach,
      westApproach,
      eastApproach
    }
  }`;

  res = await request(url, query);

  var rawTrafficLight = res.trafficLightCount;

  rawTrafficLight.forEach(element => {
    northCount += element.northApproach;
    southCount += element.southApproach;
    eastCount += element.eastApproach;
    westCount += element.westApproach;
  });


  console.log(`north: ${northCount}, south: ${southCount}, east: ${eastCount}, west: ${westCount}`);
  return [
    {"direction": "nord", "numberOfPedestrians": northCount}, 
    {"direction": "sud", "numberOfPedestrians": southCount}, 
    {"direction": "est", "numberOfPedestrians": eastCount}, 
    {"direction": "ouest", "numberOfPedestrians": westCount}
  ];
};

const trucksAndMoreTrucks = async () => {
  breakdowns = [
    {"category": "camion leger", "percentage": 0.0, "total": 0},
    {"category": "camion lourd", "percentage": 0.0, "total": 0},
    {"category": "camion", "percentage": 0.0, "total": 0},
    {"category": "camion porteur", "percentage": 0.0, "total": 0},
    {"category": "camion articule", "percentage": 0.0, "total": 0},
  ]
  index = 0;
  totalAllReads = 0;
  // boucle query sur chaque type de camion
  var codeArray = [camionLeger, camionLourd, camion, camionPorteur, camionArticule]
  for (let i = 0; i < codeArray.length; i++) {
    const currentBankCode = codeArray[i];
  
    const query = `{
      trafficLightCount(bankCode: ${currentBankCode}) {
        WBT,
        WBLT,
        WBRT,
        WBUT,
        EBT,
        EBLT,
        EBRT,
        EBUT,
        NBT,
        NBLT,
        NBRT,
        NBUT,
        SBT,
        SBLT,
        SBRT,
        SBUT
      }
    }`;

    res = await request(url, query);

    var rawTrafficLight = res.trafficLightCount;

    var totalSingleRead = 0;
    rawTrafficLight.forEach(element => {
      // compute total amount of trucks for this category
      for (let key in element) {
        if(element.hasOwnProperty(key)){
          totalSingleRead += element[key];
        }
      }
    });

    breakdowns[i].total += totalSingleRead;
    totalAllReads += totalSingleRead;
  };

  //reloop all breakdowns to compute percentage
  breakdowns.forEach(element => {
    element.percentage = Math.round(element.total / totalAllReads * 100);
  });

  return breakdowns;
  
};

const highSteaks = async () => {
  results = []
  const query = `{
    foodInspectionOffenders {
      amount,
      violationDate,
      establishment,
      address
    }
  }`;

  res = await request(url, query);

  rawFines = res.foodInspectionOffenders;


  var places = []

  // find all dates in response
  rawFines.forEach(fine => {
    places.push(fine.establishment);
  });

  places = _.uniq(places);

  console.log("places", places);

  places.forEach(place => {
    var offenderAmounts = {};
    offenderAmounts.establishment = place;
    offenderAmounts.totalFine = 0;
    var finesForPlace = rawFines.filter((el) => {
      return el.establishment == place
    });

    finesForPlace.forEach(element => {
      offenderAmounts.totalFine += element.amount;
    });

    results = _.reverse(_.sortBy(results, ["totalFine"]))
    

    results.push(offenderAmounts);
  });
  
  return results;
};

const aLotOfFines = async (parent, args, context, info) => {
  const query = `{
    foodInspectionOffenders {
      amount,
      violationDate
    }
  }`;

  res = await request(url, query);

  rawFines = res.foodInspectionOffenders;

  var dates = []

  // find all dates in response
  rawFines.forEach(fine => {
    dates.push(fine.violationDate);
  });
  // create unique date array
  dates = _.uniq(dates)

  results = []

  dates.forEach(date => {
    fine = {};
    fine.day = date; 
    fine.amounts = [];
    fine.averageAmount = 0;

    var finesForThisDate = rawFines.filter((el) => {
      return el.violationDate == date
    });
    
    finesForThisDate.forEach(el => {
      fine.amounts.push(el.amount);
    });

    fine.averageAmount = Math.round(fine.amounts.reduce((a, b) => a + b, 0) / fine.amounts.length);
    //console.log(`fine obj for ${date}: ${fine}`);

    results.push(fine);
  });

  results = _.sortBy(results, ['amounts.length'])
  
  
  return results;
  
};

const daysDiffTwoStrings = (dateStr1, dateStr2) => {
  date1 = new Date(dateStr1);
  date2 = new Date(dateStr2);
  var diffInTime = date2.getTime() - date1.getTime();
  var diffInDays = diffInTime / (1000 * 3600 * 24);

  return diffInDays;
}

const howLongBeforeTheJudgment = async () => {
  var results = {};
  results.averageWaitingTime = 0;
  results.entries = [];
  const query = `{
    foodInspectionOffenders {
      violationDate,
      judgementDate
    }
  }`;

  res = await request(url, query);
  rawFines = res.foodInspectionOffenders;

  var totalTime = 0;
  var maxValue = 0
  var minValue = 999999;
  var entries = [];
  rawFines.forEach(element => {
    var difference = daysDiffTwoStrings(element.violationDate, element.judgementDate);
    totalTime += difference;
    if(maxValue < difference) maxValue = difference;
    if(minValue > difference) {
      minValue = difference;
      // console.log(`nouvelle valeur min ${minValue} entre ${element.violationDate} et ${element.judgementDate}`);
    }

  });

  results.averageWaitingTime = Math.round(totalTime / rawFines.length);

  rawFines.forEach(element => {
    var difference = daysDiffTwoStrings(element.violationDate, element.judgementDate);
    var diffWithAvg = Math.abs(results.averageWaitingTime - difference);

    entries.push({"waitingTime": difference, "differenceWithAverage": diffWithAvg});
  });
  results.entries = entries;
  
  console.log(`average delay: ${results.averageWaitingTime}, max delay: ${maxValue}, min delay: ${minValue}`);

  return results;
};

const breakdownOfCrimes = async () => {
  throw new Error('Not Implemented');
};

const whenDoTheyHappen = async () => {
  throw new Error('Not Implemented');
};

module.exports = {
  etsProportions,
  thatsAWholeLotOfCommutes,
  whereDoPedestriansGo,
  trucksAndMoreTrucks,
  highSteaks,
  aLotOfFines,
  breakdownOfCrimes,
  whenDoTheyHappen,
  howLongBeforeTheJudgment
};