const PatientX = artifacts.require("PatientX");

module.exports = function (deployer) {
  deployer.deploy(PatientX);
};
