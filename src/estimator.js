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

  return {
    data: input,
    impact,
    severeImpact
  };
};

export default covid19ImpactEstimator;
