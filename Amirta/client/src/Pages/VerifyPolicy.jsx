import React, { useState } from 'react';
import Web3 from 'web3';
import InsuranceABI from '../contracts/Insurance.json';
import Navbar from '../Components/Navbar';

export default function VerifyPolicy() {
    const [policyId, setPolicyId] = useState(null);
    const [policyHolderAddress, setPolicyHolderAddress] = useState(null);

    const verify = async (e) => {
        e.preventDefault();
        const web3 = new Web3(new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545"));
        const address = process.env.REACT_APP_CONTRACT_ADDRESS;
        const contract = new web3.eth.Contract(InsuranceABI.abi, address);
        const accounts = await web3.eth.getAccounts();

        contract.methods.verifyPolicy(accounts[0], policyHolderAddress, policyId).send({from: accounts[0], gas: 3000000 })
        .then(res => {
            console.log(res);
        }).catch();
    }

    return (
        <div className='verifiy-policy'>
            <Navbar/>
            <form action="">
                <input type="text" name='policyHolderAddress' id='policyHolderAddress' onChange={(e) => setPolicyHolderAddress(e.target.value)} placeholder='Policy Holder Address'/>

                <input type="text" name="policyId" id="policyId" onChange={(e) => setPolicyId(e.target.value)} placeholder='Policy Id'/>

                <button onClick={verify}>Verify the policy</button>
            </form>
        </div>
    )
}
