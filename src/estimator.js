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

const calculateFactorBasedOnDays = (days) => Math.floor(days / 3);

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

  return availableHospitalBeds - severeCasesByRequestedTime;
};

const calculateCasesForICUByRequestedTime = (
  percent,
  infectionsByRequestedTime
) => (percent / 100) * infectionsByRequestedTime;

const calculateCasesForVentilatorsByRequestedTime = (
  percent,
  infectionsByRequestedTime
) => (percent / 100) * infectionsByRequestedTime;

const calculateDollarsInFlight = (
  infectionsByRequestedTime,
  peoplePercent,
  avgIncome,
  days
) => {
  const result = Number.parseFloat(
    infectionsByRequestedTime * peoplePercent * avgIncome * days
  ).toFixed(2);

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

  impact.casesForICUByRequestedTime = calculateCasesForICUByRequestedTime(
    5,
    impact.infectionsByRequestedTime
  );

  severeImpact.casesForICUByRequestedTime = calculateCasesForICUByRequestedTime(
    5,
    severeImpact.infectionsByRequestedTime
  );

  impact.casesForVentilatorsByRequestedTime = calculateCasesForVentilatorsByRequestedTime(
    2,
    impact.infectionsByRequestedTime
  );

  severeImpact.casesForVentilatorsByRequestedTime = calculateCasesForVentilatorsByRequestedTime(
    2,
    severeImpact.infectionsByRequestedTime
  );

  impact.dollarsInFlight = calculateDollarsInFlight(
    impact.infectionsByRequestedTime,
    input.region.avgDailyIncomePopulation,
    input.region.avgDailyIncomeInUSD,
    daysToElapse
  );

  severeImpact.dollarsInFlight = calculateDollarsInFlight(
    severeImpact.infectionsByRequestedTime,
    input.region.avgDailyIncomePopulation,
    input.region.avgDailyIncomeInUSD,
    daysToElapse
  );

  return {
    data: input,
    impact,
    severeImpact
  };
};

// export default covid19ImpactEstimator;

console.log(
  covid19ImpactEstimator({
    region: {
      name: 'Africa',
      avgAge: 19.7,
      avgDailyIncomeInUSD: 5,
      avgDailyIncomePopulation: 0.71
    },
    periodType: 'days',
    timeToElapse: 58,
    reportedCases: 674,
    population: 66622705,
    totalHospitalBeds: 1380614
  })
);
