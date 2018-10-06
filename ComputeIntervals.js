// Define the starting point from which to count indices
var previousDate = -1;
// let nextIncident = 0;

// For each Shootings index, calculate the amount of time between its date and the first index
for (var i = 0; i < Shootings.length; i++) {
  
  // Hold the all values for each index in variable "incident"
  var incident = Shootings[i];
  if (previousDate === -1) {
    previousDate = incident.DATE
    incident.time = 0
  } else {
    var dateMoment = moment(incident.DATE, 'M/DD/YY')

    // var nextDateMoment = moment(nextIncident.DATE, 'M/DD/YY')
    // console.log(dateMoment)
    incident.time = dateMoment.diff(previousDate, 'days')
    // incident.timeNext = nextDateMoment.diff(dateMoment, 'days')
  }
  incident.time = incident.time / 150;
  // incident.timeNext = incident.timeNext / 150;
  
}

// Constrain the calculations to indices that actually exist
for (var i = 0; i < Shootings.length; i++) {
  
  // Hold the # of the current index in the Shootings array in variable "i"
  Shootings[i].index = i;
  
  // If the # of the current index is less than the final index, 
  // then nextTime will always equal the next index.
  // This prevents it from trying to calculate an index that doesn't exist.
  if (i < Shootings.length - 1) {
    Shootings[i].nextTime = Shootings[i + 1].time
  } else {
    Shootings[i].nextTime = Shootings[i].time
  }
}


// start with tiny max that's definitely less than any value
// for every object in Shootings array, take the max between the TOTAL and the currently defined MAX_CASUALITIES
// that will define a global MAX_CASUALITIES
// var MAX_CASUALITIES = 0
// Shootings.forEach(function(obj) {
//   MAX_CASUALITIES = max(obj.TOTAL, MAX_CASUALITIES)
// })