const IMPACTLEVEL = {
  NORMAL: 1,
  SEVERE: 2
};

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

const covid19ImpactEstimator = (data) => {
  const input = data;
  const impact = {};
  const severeImpact = {};

  impact.currentlyInfected = calculateCurrentlyInfected(input.reportedCases, 1);
  severeImpact.currentlyInfected = calculateCurrentlyInfected(
    input.reportedCases,
    2
  );

  impact.infectionsByRequestedTime = calculateinfectionsByRequestedTime(
    impact.currentlyInfected,
    9
  );

  severeImpact.infectionsByRequestedTime = calculateinfectionsByRequestedTime(
    severeImpact.currentlyInfected,
    9
  );

  return {
    data: input,
    impact,
    severeImpact
  };
};

export default covid19ImpactEstimator;
