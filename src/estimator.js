const IMPACTLEVEL = {
  NORMAL: 1,
  SEVERE: 2
};

const convertToDays = (periodType, timeToElapse) => {
  if (periodType === 'weeks') {
    return timeToElapse * 7;
  }

  if (periodType === 'months') {
    return timeToElapse * 30;
  }

  return timeToElapse;
};

const calculateFactorBasedOnDays = (days) => Math.trunc(days / 3);

const calculateCurrentlyInfected = (reportedCases, impactLevel) => {
  if (impactLevel === IMPACTLEVEL.NORMAL) {
    return reportedCases * 10;
  }

  if (impactLevel === IMPACTLEVEL.SEVERE) {
    return reportedCases * 50;
  }

  return reportedCases * 10;
};

const calculateinfectionsByRequestedTime = (currentlyInfected, factor) => {
  const infectionQuotient = 2 ** factor;
  return currentlyInfected * infectionQuotient;
};

const calculateSevereCasesByRequestedTime = (
  percent,
  infectionsByRequestedTime
) => (percent / 100) * infectionsByRequestedTime;

const calculateHospitalBedsByRequestedTime = (
  severeCasesByRequestedTime,
  totalHospitalBeds
) => {
  const availableHospitalBeds = (35 / 100) * totalHospitalBeds;

  return Math.trunc(availableHospitalBeds - severeCasesByRequestedTime);
};

const calculateCasesForICUByRequestedTime = (
  percent,
  infectionsByRequestedTime
) => (percent / 100) * infectionsByRequestedTime;

const calculateCasesForVentilatorsByRequestedTime = (
  percent,
  infectionsByRequestedTime
) => Math.trunc((percent / 100) * infectionsByRequestedTime);

const calculateDollarsInFlight = (
  infectionsByRequestedTime,
  peoplePercent,
  avgIncome,
  days
) => {
  const result = (infectionsByRequestedTime * peoplePercent * avgIncome) / days;

  return result;
};

const covid19ImpactEstimator = (data) => {
  const input = data;
  const impact = {};
  const severeImpact = {};

  const daysToElapse = convertToDays(input.periodType, input.timeToElapse);
  const factor = calculateFactorBasedOnDays(daysToElapse);

  impact.currentlyInfected = calculateCurrentlyInfected(input.reportedCases, 1);
  severeImpact.currentlyInfected = calculateCurrentlyInfected(
    input.reportedCases,
    2
  );

  impact.infectionsByRequestedTime = calculateinfectionsByRequestedTime(
    impact.currentlyInfected,
    factor
  );

  severeImpact.infectionsByRequestedTime = calculateinfectionsByRequestedTime(
    severeImpact.currentlyInfected,
    factor
  );

  impact.severeCasesByRequestedTime = calculateSevereCasesByRequestedTime(
    15,
    impact.infectionsByRequestedTime
  );

  severeImpact.severeCasesByRequestedTime = calculateSevereCasesByRequestedTime(
    15,
    severeImpact.infectionsByRequestedTime
  );

  impact.hospitalBedsByRequestedTime = calculateHospitalBedsByRequestedTime(
    impact.severeCasesByRequestedTime,
    input.totalHospitalBeds
  );

  severeImpact.hospitalBedsByRequestedTime = calculateHospitalBedsByRequestedTime(
    severeImpact.severeCasesByRequestedTime,
    input.totalHospitalBeds
  );

  impact.casesForICUByRequestedTime = Math.trunc(
    calculateCasesForICUByRequestedTime(5, impact.infectionsByRequestedTime)
  );

  severeImpact.casesForICUByRequestedTime = Math.trunc(
    calculateCasesForICUByRequestedTime(
      5,
      severeImpact.infectionsByRequestedTime
    )
  );

  impact.casesForVentilatorsByRequestedTime = calculateCasesForVentilatorsByRequestedTime(
    2,
    impact.infectionsByRequestedTime
  );

  severeImpact.casesForVentilatorsByRequestedTime = calculateCasesForVentilatorsByRequestedTime(
    2,
    severeImpact.infectionsByRequestedTime
  );

  const dollarsInFlightImpact = calculateDollarsInFlight(
    impact.infectionsByRequestedTime,
    input.region.avgDailyIncomePopulation,
    input.region.avgDailyIncomeInUSD,
    daysToElapse
  );
  const dollarsInFlightSevere = calculateDollarsInFlight(
    severeImpact.infectionsByRequestedTime,
    input.region.avgDailyIncomePopulation,
    input.region.avgDailyIncomeInUSD,
    daysToElapse
  );
  severeImpact.dollarsInFlight = Math.trunc(dollarsInFlightSevere);
  impact.dollarsInFlight = Math.trunc(dollarsInFlightImpact);

  // console.log(input);
  // console.log(impact);
  // // console.log(severeImpact);

  return {
    data: input,
    impact,
    severeImpact
  };
};

export default covid19ImpactEstimator;

// console.log(
//   covid19ImpactEstimator({
//     region: {
//       name: 'Africa',
//       avgAge: 19.7,
//       avgDailyIncomeInUSD: 2,
//       avgDailyIncomePopulation: 0.62
//     },
//     reportedCases: 90,
//     population: 2244206,
//     totalHospitalBeds: 80416,
//     timeToElapse: 9,
//     periodType: 'weeks'
//   })
// );
