import React, { useEffect, useState } from 'react';
import Navbar from '../Components/Navbar';
import {Link} from 'react-router-dom';
import Web3 from 'web3';
import InsuranceABI from '../contracts/Insurance.json';

export default function InsuranceHome() {

    const [accountNo, setAccountNo] = useState("");
    const [policies, setPolicies] = useState([]);

    const showActivePolicies = async () => {
        const web3 = new Web3(new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545"));
        const address = process.env.REACT_APP_CONTRACT_ADDRESS; 
        const contract = new web3.eth.Contract(InsuranceABI.abi, address);
        const accounts = await web3.eth.getAccounts();

        contract.methods.getPolicyDetails(accounts[0]).call({gas: 3000000})
        .then(res => {
            console.log(res);
            setPolicies(res);
        }).catch();
    }

    const payPremium = async (policyId) => {
        const web3 = new Web3(new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545"));
        const address = process.env.REACT_APP_CONTRACT_ADDRESS; 
        const contract = new web3.eth.Contract(InsuranceABI.abi, address);
        const accounts = await web3.eth.getAccounts();

        const premiumAmount = web3.utils.toWei('1', 'ether');
        contract.methods.payPremium(policyId).send({from: accounts[0], gas: 3000000, value: premiumAmount})
        .then(res => {
            console.log(res);
            showActivePolicies();
        }).catch((err) => {
            alert(err);
        });
    }

    const claimPolicy = async (policyId) => {
        const web3 = new Web3(new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545"));
        const address = process.env.REACT_APP_CONTRACT_ADDRESS; 
        const contract = new web3.eth.Contract(InsuranceABI.abi, address);
        const accounts = await web3.eth.getAccounts();

        contract.methods.claimPolicy(accounts[0], policyId).send({from: accounts[0], gas: 3000000})
        .then(res => {
            console.log(res);
            showActivePolicies();
        }).catch((err) => {
            alert(err);
        });
        
    }

  return (
    <div className='insurance-home'>
        <Navbar/>

        <div className='info'>
            <p>Hello {accountNo}! welcome to Block Assure</p>
            <Link to="/createInsurance" className='link'>Create new Policy</Link>

            <button onClick={showActivePolicies}>Show Active Policies</button>
        </div>
        

        <div className='insurance-container'>   
        {
            policies.map((obj, idx) => {
                return (
                <div className='insurance-card'>
                    <table>
                        <tr>
                            <th>Name:</th>
                            <td>{obj[0]}</td>
                        </tr>

                        <tr>
                            <th>Crop:</th>
                            <tr>{obj[1]}</tr>
                        </tr>

                        <tr>
                            <th>Policy Duration</th>
                            <tr>{obj[2]}</tr>
                        </tr>

                        <tr>
                            <th>Next premium Time</th>
                            <tr>{obj[3]}</tr>
                        </tr>

                        <tr>
                            <th>Coverage Amount</th>
                            <tr>{obj[4]}</tr>
                        </tr>

                        <tr>
                            <th>Premium Amount</th>
                            <tr>{obj[5]}</tr>
                        </tr>

                        <tr>
                            <th>No of premiumleft</th>
                            <tr>{obj[6]}</tr>
                        </tr>
                    </table>

                    {
                        obj[9] == false && 
                        <p>Waiting for approvel</p>
                    }

                    {
                        obj[9] && !obj[8] && (

                            <div>
                                <button onClick={() => payPremium(idx)}>Pay Premium</button>
                                <button onClick={() => claimPolicy(idx)}>Claim Policy</button>
                            </div>
                        )
                    }

                    {
                        obj[9] && obj[8] && <p>You already claimed the policy</p>
                    }
                    
                </div>
                )
            })  
        }
        </div>

    </div>
  )
}
