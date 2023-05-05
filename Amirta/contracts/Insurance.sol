// SPDX-License-Identifier: GPL-3.0


// Enable optimizer
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Insurance{
    using SafeMath for uint256;

    struct Policy{
        string name;
        string typeOfCrop;
        uint timePeriod;
        uint nextPremiumTime;
        uint coverageAmount;
        uint premiumAmount; // 5% 
        uint noOfPremiumLeft;
        
        string phoneNo;
        bool isClaimed;
        bool isVerified;
        
        address verificationDoneBy;
        string position;
    }

    mapping (address => Policy[]) public policies; 

    // "Pravin",20,"Rice",12,123445
    function addPolicy(string memory _name, string memory _typeOfCrop, uint _timePeriod
    , string memory _phoneNo, string memory position) public  {
        Policy memory p = Policy(
            _name,
            _typeOfCrop,
            _timePeriod,
            block.timestamp + 10, // 2592000 per month
            getCoverageAmount(),
            getPremiumAmount(),
            12,

            _phoneNo,
            false,
            false,
            address(0),
            position
        );

        policies[msg.sender].push(p);
    }

    function getCoverageAmount() public pure returns(uint){
        // Code for calculating the coverage amount
        return 5;
    }

    function getPremiumAmount() public pure returns(uint){
        // code for calculating premium amount based on coverage amount
        return 1;
    }

    function payPremium(uint policyId) public payable {
        require(policies[msg.sender].length > policyId, "Invalid policy ID");


        uint premiumAmount = policies[msg.sender][policyId].premiumAmount;
        uint noOfPremiumLeft = policies[msg.sender][policyId].noOfPremiumLeft;
        bool isClaimed = policies[msg.sender][policyId].isClaimed;
        uint nextPremiumTime = policies[msg.sender][policyId].nextPremiumTime;
        bool isVerified = policies[msg.sender][policyId].isVerified;

        require(isVerified, "Your policy still not verified");
        require(nextPremiumTime <= block.timestamp, "Your next premium is not activated yet");
        require(msg.value == premiumAmount.mul(1 ether), "Insufficient premium amount");
        require(noOfPremiumLeft > 0, "You paid all your premiums");
        require(!isClaimed, "You already claimed your premiums");

        policies[msg.sender][policyId].noOfPremiumLeft--;
        policies[msg.sender][policyId].nextPremiumTime = block.timestamp + 10;// 2592000

        // _reciver.transfer(premiumAmount.mul(1 ether));
    }

    function verifyPolicy(address verifier, address policyHolder, uint policyId) public returns(bool){
        // match the verifier
        require(verifier == msg.sender, "Wrong verifier");
        require(policies[policyHolder].length > policyId, "Invalid policy ID/Holder");

        policies[policyHolder][policyId].verificationDoneBy = verifier;
        policies[policyHolder][policyId].isVerified = true;

        return true;
    }

    function getPolicyDetails(address policyHolder) public view returns (Policy[] memory){
        return policies[policyHolder];
    }

    function claimPolicy(address payable policyHolder, uint policyId) public returns(bool){
        require(policyHolder == msg.sender, "Wrong verifier");
        require(policies[policyHolder].length > policyId, "Invalid policy ID/Holder");
        
        policies[policyHolder][policyId].isClaimed = true;
        policyHolder.transfer(policies[policyHolder][policyId].coverageAmount.mul(1 ether));

        return true;
    }
}