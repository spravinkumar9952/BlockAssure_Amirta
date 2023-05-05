import React, { useState } from 'react'
import Navbar from '../Components/Navbar';
import { useNavigate } from 'react-router-dom';
import MapPicker from 'react-google-map-picker';
import InsuranceABI from '../contracts/Insurance.json';
import Web3 from 'web3';



const DefaultLocation = { lat: 10, lng: 106 };
const DefaultZoom = 10;

export default function CreateInsurance() {
    const navigator = useNavigate();


    const [name, setName] = useState("");
    const [typeOfCrop, setTypeOfCrop] = useState("");
    const [timePeriod, setTimePeriod] = useState("");
    const [coverageAmount, setCoverageAmount] = useState(0);
    const [premiumAmount, setPremiumAmount] = useState(0);
    const [phoneNo, setPhoneNo] = useState(0);
    const [email, setEmail] = useState("");
    const [position, setPosition] = useState([]);
    const [isSubmited, setIsSubmited] = useState(false);


    const [defaultLocation, setDefaultLocation] = useState(DefaultLocation);
    const [location, setLocation] = useState(defaultLocation);
    const [zoom, setZoom] = useState(DefaultZoom);

    const handleSubmit = () => {
        setPremiumAmount(10);
        setCoverageAmount(100);
        setIsSubmited(true);
    }

    const handleConfirm = async () => {
        const web3 = new Web3(new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545"));
        const address = process.env.REACT_APP_CONTRACT_ADDRESS;
        const contract = new web3.eth.Contract(InsuranceABI.abi, address);
        console.log(address);
        const accounts = await web3.eth.getAccounts();
        const contractPromise = contract.methods.addPolicy(name, typeOfCrop, timePeriod, phoneNo, position[0] + " " + position[1]).send({ from: accounts[0], gas: 3000000 });

        console.log(accounts[0]);

        navigator('/insuranceHome');
    }


    function handleChangeLocation(lat, lng) {
        setPosition([lat, lng]);
    }

    function handleChangeZoom(newZoom) {
        setZoom(newZoom);
    }

    function handleResetLocation() {
        setDefaultLocation({ ...DefaultLocation });
        setZoom(DefaultZoom);
    }

    return (
        <div className='create-insurance'>
            <Navbar />

            <div>
                <h1>Fillout the detalis</h1>
                {!isSubmited ?
                    <form action="">
                        <input type="text" placeholder='Name' onChange={(e) => setName(e.target.value)} />
                        <input type="text" placeholder="Type of crop" onChange={(e) => setTypeOfCrop(e.target.value)} />
                        <input type='text' placeholder='TimePeriod in months' onChange={(e) => setTimePeriod(e.target.value)} />
                        <input type="tel" name="phoneNo" id="phoneNo" placeholder='Telephone Number' onChange={(e) => setPhoneNo(e.target.value)} />
                        <input type="email" name="email" id="email" placeholder='Email Id' />
                        <input type="number" name="area" id="area" placeholder='Area in Square feet'/>
                       

                        <MapPicker defaultLocation={defaultLocation}
                            zoom={zoom}
                            mapTypeId="roadmap"
                            style={{ height: '500px', width: '1200px' }}
                            onChangeLocation={handleChangeLocation}
                            onChangeZoom={handleChangeZoom}
                            apiKey='AIzaSyD07E1VvpsN_0FvsmKAj4nK9GnLq-9jtj8'
                        /> 

                        <button onClick={handleSubmit}>Estimate the premium amount</button>
                    </form>

                    :

                    <div className='info'>
                        <p>Based on your data the estimated policy details</p>

                        <table>
                            <tr>
                                <th>Premium Amount</th>
                                <td>{premiumAmount}</td>
                            </tr>

                            <tr>
                                <th>Coverage Amount</th>
                                <td>{coverageAmount}</td>
                            </tr>
                        </table>

                        <button onClick={() => setIsSubmited(false)}>Cancel</button>
                        <button onClick={handleConfirm}>Confirm</button>
                    </div>
                }
            </div>
        </div>
    )
}
