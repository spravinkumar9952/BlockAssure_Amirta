import React, { useEffect, useState } from 'react'
import Navbar from '../Components/Navbar'
import Web3 from 'web3'
import { useNavigate } from 'react-router-dom';

import img1 from '../Images/1.jpg';
import MetaMaks from '../Images/metamask.png';

export default function Home() {
    const navigator = useNavigate();

    const [web3, setWeb3] = useState(null);

    const connectToMetamask = async () => {

        if (window.ethereum) {
            try {
                const web3 = new Web3(window.ethereum);
                await window.ethereum.enable();
                setWeb3(web3);
                const accounts = await web3.eth.getAccounts();
                console.log("Connected to metamask with address:", accounts[0]);
                navigator('/insuranceHome');
            } catch (error) {
                console.error(error);
            }
        } else {
            alert('Please install MetaMask!');
        }
    }

    const disconnectFromMetamask = () => {
        window.ethereum.request({ method: 'wallet_requestPermissions', params: [{ eth_accounts: {} }] }).then(() => {
            alert("Disconnected");
        }).catch((error) => {
            alert(error);
        });
    };

    useEffect(() => {
        if(web3){
            navigator('/insuranceHome');
        }
    },[])

    return (
        <div className='home'>

            <div>
                <div>
                    <h1>Block Assure</h1>
                    <img src={MetaMaks} className='metamask'/>

                    <button onClick={connectToMetamask}>Connect To MetaMask</button>
                    <button onClick={disconnectFromMetamask}>Switch MetaMask</button>
                </div>

                <img src={img1}  alt="" srcset="" />
            </div>
             
             <div className='info'>
                <h1>Welcome to BlockAssure!</h1>
                <p>
                Block Assure is a critical tool for farmers to mitigate the financial risks associated with natural disasters, such as floods, droughts, and storms. Blockchain technology can enhance the efficiency, transparency, and security of the crop insurance process by providing a tamper-proof and decentralized ledger that enables policy details to be recorded, policies to be added, and payments to be made securely.</p>
                <p> Additionally, blockchain technology can be used to analyze crop insurance data to identify trends and patterns, making it easier for insurers to accurately price policies and provide better coverage to farmers. When a natural disaster occurs, farmers can claim insurance through the blockchain platform, which provides a transparent and immutable record of the claim process, ensuring that farmers receive the compensation they deserve in a timely and efficient manner. Overall, blockchain technology has the potential to transform the crop insurance industry, making it more accessible, affordable, and reliable for farmers around the world.
                </p>
             </div>
        </div>
    )
}
