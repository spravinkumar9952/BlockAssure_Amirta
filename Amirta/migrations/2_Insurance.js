let Insurance = artifacts.require("./Insurance.sol");

module.exports = (deployer) => {
    deployer.deploy(Insurance);
}