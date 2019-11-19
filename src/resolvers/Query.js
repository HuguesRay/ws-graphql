const {
  request
} = require('graphql-request');

const _ = require('lodash');
const url = "http://35.203.42.156:8081/";

const etsProportions = async () => {
  throw new Error('Not Implemented');
};

const thatsAWholeLotOfCommutes = async () => {
  throw new Error('Not Implemented');
};

const whereDoPedestriansGo = async () => {
  throw new Error('Not Implemented');
};

const trucksAndMoreTrucks = async () => {
  throw new Error('Not Implemented');
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

const getDayFromString = (str) => {
  return parseInt(str.split("T")[0].split("-")[2]);
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
  rawFines.forEach(element => {
    totalTime += getDayFromString(element.judgementDate) - getDayFromString(element.violationDate);
  });

  results.averageWaitingTime = Math.round(totalTime / rawFines.length);



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