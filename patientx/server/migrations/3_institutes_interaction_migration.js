const InstitutesInteraction = artifacts.require("InstitutesInteraction");

module.exports = function (deployer) {
  deployer.deploy(InstitutesInteraction);
};
