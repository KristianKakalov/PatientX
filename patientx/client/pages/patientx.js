import Head from 'next/head';
import { useState, useEffect } from 'react';
import Web3 from 'web3';
import { patientX, institutesInteraction } from '../blockchain/patientx';
import 'bulma/css/bulma.css';
import styles from '../styles/PatientX.module.css';

const PatientX = () => {
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [waitingMessage, setWaitingMessage] = useState('');
    const [address, setAddress] = useState(undefined);
    const [patientXContract, setPatientXContract] = useState(undefined);
    const [institutesInteractionContract, setInstitutesInteractionContract] = useState(undefined);
    const [role, setRole] = useState('');

    useEffect(() => {
        if (patientXContract && address) {
            getRole();
        } 
    }, [patientXContract, address]);
    
    const getRole = async () => {
        try {
            const isPatient = await patientXContract.methods.suchPatientExists(address).call();
            if (isPatient) {
                setRole("patient");
                return;
            }

            const isDoctor = await patientXContract.methods.suchDoctorExists(address).call();
            if (isDoctor) {
                setRole("doctor");
                return;
            }

            const isMedicalInstitute = await patientXContract.methods.suchMedicalInstituteExists(address).call();
            if (isMedicalInstitute) {
                setRole("medicalInstitute");
                return;
            }

            setRole("none");
        } catch (err) {
            setError(err.message);
        }
    };

    const registerAsPatient = async () => {
        try {
            setError("");
            setSuccessMessage("");
            setWaitingMessage("awaiting registration process...");

            const input = document.querySelector(".registerPatient input");
            const name = input.value;
            input.value = "";

            await patientXContract.methods.enlistPatient(name).send({
                from: address,
                value: 0
            });

            setRole("patient");
            setSuccessMessage("successful registration ✓");
            setWaitingMessage("");
        } catch (err) {
            setError(err.message);
            setWaitingMessage("");
        }
    };

    const registerAsDoctor = async () => {
        try {
            setError("");
            setSuccessMessage("");
            setWaitingMessage("awaiting registration process...");

            const input = document.querySelector(".registerDoctor input");
            const name = input.value;
            input.value = "";

            await patientXContract.methods.enlistDoctor(name).send({
                from: address,
                value: 0
            });

            setRole("doctor");
            setSuccessMessage("successful registration ✓");
            setWaitingMessage("");
        } catch (err) {
            setError(err.message);
            setWaitingMessage("");
        }
    };

    const registerAsMedicalInstitute = async () => {
        try {
            setError("");
            setSuccessMessage("");
            setWaitingMessage("awaiting registration process...");

            const input = document.querySelector(".registerMedicalInstitute input");

            const name = input.value;
            input.value = "";

            await institutesInteractionContract.methods.enlistMedicalInstitute("0xD26438C0282F30252674aE37298442c888DB0C18", name).send({
                from: address,
                value: 0
            });

            setRole("medicalInstitute");
            setSuccessMessage("successful registration ✓");
            setWaitingMessage("");
        } catch (err) {
            setError(err.message);
            setWaitingMessage("");
        }
    };

    const connectToDoctor = async () => {
        try {
            setError("");
            setSuccessMessage("");
            setWaitingMessage("awaiting connection process...");

            const input = document.querySelector(".connectToDoctor input");
            const doctorAddress = input.value;
            input.value = "";

            await patientXContract.methods.addDoctorToPatient(address, doctorAddress).send({
                from: address,
                value: 0
            });

            setSuccessMessage("successful connection ✓");
            setWaitingMessage("");
        } catch (err) {
            setError(err.message);
            setWaitingMessage("");
        }
    };

    const connectToMedicalInstitute = async () => {
        try {
            setError("");
            setSuccessMessage("");
            setWaitingMessage("awaiting connection process...");

            const input = document.querySelector(".connectToMedicalInstitute input");
            const medicalInstituteAddress = input.value;
            input.value = "";

            await patientXContract.methods.addInstituteToPatient(address, medicalInstituteAddress).send({
                from: address,
                value: 0
            });

            setSuccessMessage("successful connection ✓");
            setWaitingMessage("");
        } catch (err) {
            setError(err.message);
            setWaitingMessage("");
        }
    };

    const removeDoctorFromPatient = async () => {
        try {
            setError("");
            setSuccessMessage("");
            setWaitingMessage("awaiting removal process...");

            const input = document.querySelector(".removeDoctorFromPatient input");
            const doctorAddress = input.value;
            input.value = "";

            await patientXContract.methods.removeDoctorFromPatient(address, doctorAddress).send({
                from: address,
                value: 0
            });

            setSuccessMessage("successful removal ✓");
            setWaitingMessage("");
        } catch (err) {
            setError(err.message);
            setWaitingMessage("");
        }
    };

    const removeMedicalInstituteFromPatient = async () => {
        try {
            setError("");
            setSuccessMessage("");
            setWaitingMessage("awaiting removal process...");

            const input = document.querySelector(".removeMedicalInstituteFromPatient input");
            const medicalInstituteAddress = input.value;
            input.value = "";

            await patientXContract.methods.removeInstituteFromPatient(address, medicalInstituteAddress).send({
                from: address,
                value: 0
            });

            setSuccessMessage("successful removal ✓");
            setWaitingMessage("");
        } catch (err) {
            setError(err.message);
            setWaitingMessage("");
        }
    };

    const showAllMyDoctors = async () => {
        try {
            setError("");
            setSuccessMessage("");
            setWaitingMessage("awaiting response data...");

            const result = await patientXContract.methods.getAllDoctorsOfPatient(address).call({
                from: address,
                value: 0
            });

            let dataElement = document.querySelectorAll(".showAllMyDoctors")[0];
            dataElement.innerHTML = "";
            let counter = 1;
            result.forEach(element => {
                let newDoctor = document.createElement("p");
                newDoctor.textContent = "Doctor " + counter + ": ";
                newDoctor.style = "text-align: center; padding-top: 1em;";

                let newParagraph1 = document.createElement("p");
                newParagraph1.textContent = "Name: ";
                newParagraph1.textContent += element["name"];

                let newParagraph2 = document.createElement("p");
                newParagraph2.textContent = "Doctor address: ";
                newParagraph2.textContent += element["doctorAddress"];

                dataElement.appendChild(newDoctor);
                dataElement.appendChild(newParagraph1);
                dataElement.appendChild(newParagraph2);

                counter++;
            });

            if (result.length === 0) {
                let newParagraph = document.createElement("p");
                newParagraph.textContent = "You don't have any doctors added";
                dataElement.appendChild(newParagraph);
            }

            setSuccessMessage("successful retrieval ✓");
            setWaitingMessage("");
        } catch (err) {
            setError(err.message);
            setWaitingMessage("");
        }
    };

    const showAllMyMedicalInstitutes = async () => {
        try {
            setError("");
            setSuccessMessage("");
            setWaitingMessage("awaiting response data...");

            const result = await patientXContract.methods.getAllInstitutesOfPatient(address).call({
                from: address,
                value: 0
            });


            let dataElement = document.querySelectorAll(".showAllMyMedicalInstitutes")[0];
            dataElement.innerHTML = "";
            let counter = 1;
            result.forEach(element => {
                let newMedicalInstitute = document.createElement("p");
                newMedicalInstitute.textContent = "Medical Institute " + counter + ": ";
                newMedicalInstitute.style = "text-align: center; padding-top: 1em;";

                let newParagraph1 = document.createElement("p");
                newParagraph1.textContent = "Name: ";
                newParagraph1.textContent += element["name"];

                let newParagraph2 = document.createElement("p");
                newParagraph2.textContent = "Institute Address: ";
                newParagraph2.textContent += element["instituteAddress"];

                dataElement.appendChild(newMedicalInstitute);
                dataElement.appendChild(newParagraph1);
                dataElement.appendChild(newParagraph2);

                counter++;
            });

            if (result.length === 0) {
                let newParagraph = document.createElement("p");
                newParagraph.textContent = "You don't have any medical institutes added";
                dataElement.appendChild(newParagraph);
            }

            setSuccessMessage("successful retrieval ✓");
            setWaitingMessage("");
        } catch (err) {
            setError(err.message);
            setWaitingMessage("");
        }
    };

    const addNewMedicalExamination = async () => {
        try {
            setError("");
            setSuccessMessage("");
            setWaitingMessage("awaiting addition process...");

            const addressInput = document.querySelector(".addNewMedicalExamination input:nth-child(1)");
            const dataInput = document.querySelector(".addNewMedicalExamination input:nth-child(2)");

            const patientAddress = addressInput.value;
            const data = dataInput.value;
            addressInput.value = "";
            dataInput.value = "";

            await patientXContract.methods.addNewMedicalExaminationOfPatientByDoctor(address, patientAddress, data).send({
                from: address,
                value: 0
            });

            setSuccessMessage("successful addition ✓");
            setWaitingMessage("");
        } catch (err) {
            setError(err.message);
            setWaitingMessage("");
        }
    };

    const showAllMyPatients = async () => {
        try {
            setError("");
            setSuccessMessage("");
            setWaitingMessage("awaiting response data...");

            const result = await patientXContract.methods.getAllPatientsOfDoctor(address).call({
                from: address,
                value: 0
            });
            
            let dataElement = document.querySelectorAll(".showAllMyPatients")[0];
            dataElement.innerHTML = "";
            let counter = 1;
            result.forEach(element => {
                let newPatient = document.createElement("p");
                newPatient.textContent = "Patient " + counter + ": ";
                newPatient.style = "text-align: center; padding-top: 1em;";

                let newParagraph1 = document.createElement("p");
                newParagraph1.textContent = "Name: ";
                newParagraph1.textContent += element["name"];

                let newParagraph2 = document.createElement("p");
                newParagraph2.textContent = "Patient Address: ";
                newParagraph2.textContent += element["patientAddress"];

                dataElement.appendChild(newPatient);
                dataElement.appendChild(newParagraph1);
                dataElement.appendChild(newParagraph2);

                counter++;
            });

            if (result.length === 0) {
                let newParagraph = document.createElement("p");
                newParagraph.textContent = "You don't have any patients.";
                dataElement.appendChild(newParagraph);
            }

            setSuccessMessage("successful retrieval ✓");
            setWaitingMessage("");
        } catch (err) {
            setError(err.message);
            setWaitingMessage("");
        }
    };

    const getPatientsData = async () => {
        try {
            setError("");
            setSuccessMessage("");
            setWaitingMessage("awaiting response data...");

            await institutesInteractionContract.methods.getMedicalExaminationsShareable("0xD26438C0282F30252674aE37298442c888DB0C18").send({
                from: address,
                value: 10000000000000000
            });
            

            const result = await institutesInteractionContract.methods.getMedicalExaminationsShareable("0xD26438C0282F30252674aE37298442c888DB0C18").call({
                from: address,
                value: 10000000000000000
            });

            let dataElement = document.querySelectorAll(".getPatientsData")[0];
            dataElement.innerHTML = "";
            let counter = 1;
            result.forEach(element => {
                let newData = document.createElement("p");
                newData.textContent = "Medical exam " + counter + ": ";
                newData.style = "text-align: center; padding-top: 1em;";

                let newParagraph1 = document.createElement("p");
                newParagraph1.textContent = "Data: ";
                newParagraph1.textContent += element["data"];

                let newParagraph2 = document.createElement("p");
                newParagraph2.textContent = "Patient Address: ";
                newParagraph2.textContent += element["patientAddress"];

                let newParagraph3 = document.createElement("p");
                newParagraph3.textContent = "Doctor Address: ";
                newParagraph3.textContent += element["doctorAddress"];

                dataElement.appendChild(newData);
                dataElement.appendChild(newParagraph1);
                dataElement.appendChild(newParagraph2);
                dataElement.appendChild(newParagraph3);

                counter++;
            });

            if (result.length === 0) {
                let newParagraph = document.createElement("p");
                newParagraph.textContent = "You don't have any patients";
                dataElement.appendChild(newParagraph);
            }

            setSuccessMessage("successful retrieval ✓");
            setWaitingMessage("");
        } catch (err) {
            setError(err.message);
            setWaitingMessage("");
        }
    };

    const connectWalletHandler = async () => {
        /* check if MetaMask is installed */
        if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
            try {
                /* request wallet connect */
                await window.ethereum.request({ method: "eth_requestAccounts" });
                /* create web3 instance and set to state var */
                const web3 = new Web3(window.ethereum);
                /* get list of accounts */
                const accounts = await web3.eth.getAccounts();
                /* set Account 1 to React state var */
                setAddress(accounts[0]);
            
                /* create local contract copy */
                const patientXCopy = patientX(web3);
                const institutesInteractionCopy = institutesInteraction(web3);
                
                setPatientXContract(patientXCopy);
                setInstitutesInteractionContract(institutesInteractionCopy);
            } catch(err) {
                setError(err.message);
            }
        } else {
            // meta mask is not installed
            setError("Please install MetaMask!");
        }
    }

    return (
        <div className={styles.main} >
            <Head>
                <title>PatientX</title>
                <meta name="description" content="A blockchain app for safe patient-doctor interactions, as well as safe data flow between patients and medical institutes" />
            </Head>
            {address ? (
                <div>
                    {role === "patient" &&
                        <div className={styles.container}>
                            <h2 className={styles.registerMessage}>Logged in as a patient</h2>
                            <div className={`connectToDoctor ${styles.registerContainer}`}>
                                <input className={styles.input} type="text" placeholder='Doctor address'></input>
                                <button className={`button ${styles.registerBtn}`} onClick={connectToDoctor}>Connect to doctor</button>
                            </div>

                            <div className={`connectToMedicalInstitute ${styles.registerContainer}`}>
                                <input className={styles.input} type="text" placeholder='Medical institute address'></input>
                                <button className={`button ${styles.registerBtn}`} onClick={connectToMedicalInstitute}>Connect to medical institute</button>
                            </div>
                        
                            <div className={styles.returnContainer}>
                                <button className={`button ${styles.registerBtn}`} onClick={showAllMyDoctors}>Show all my doctors</button>
                                <div className={`showAllMyDoctors ${styles.allMyDoctors}`}></div>
                            </div>
                            
                            <div className={styles.returnContainer}>
                                <button className={`button ${styles.registerBtn}`} onClick={showAllMyMedicalInstitutes}>Show all my institutes</button>
                                <div className={`showAllMyMedicalInstitutes ${styles.allMyInstitutes}`}></div>
                            </div>
                            
                            <div className={`removeDoctorFromPatient ${styles.registerContainer}`}>
                                <input className={styles.input} type="text" placeholder='Doctor address'></input>
                                <button className={`button ${styles.registerBtn}`} onClick={removeDoctorFromPatient}>Remove doctor from patient</button>
                            </div>

                            <div className={`removeMedicalInstituteFromPatient ${styles.registerContainer}`}>
                                <input className={styles.input} type="text" placeholder='Medical institute address'></input>
                                <button className={`button ${styles.registerBtn}`} onClick={removeMedicalInstituteFromPatient}>Remove medical institute from patient</button>
                            </div>
                            <p className={styles.transactionInfo}>{error}</p>
                            <p className={styles.transactionInfo}>{successMessage}</p>                      
                            <p className={styles.transactionInfo}>{waitingMessage}</p>
                        </div>
                    }
                    {role === "doctor" &&
                        <div className={styles.container}>
                            <h2 className={styles.registerMessage}>Logged in as a doctor</h2>
                            <div className={`addNewMedicalExamination ${styles.doctorContainer}`}>
                                <input className={styles.inputPatient} type="text" placeholder='Patient address'></input>
                                <input className={styles.inputPatient} type="text" placeholder='Data'></input>
                                <button className={`button ${styles.registerBtnDoctor}`} onClick={addNewMedicalExamination}>Add new medical examination</button>
                            </div>

                            <div className={styles.returnContainer}>
                                <button className={`button ${styles.registerBtn}`} onClick={showAllMyPatients}>Show all my patients</button>
                                <div className={`showAllMyPatients ${styles.allMyPatients}`}></div>
                            </div>

                            <p className={styles.transactionInfo}>{error}</p>
                            <p className={styles.transactionInfo}>{successMessage}</p>                      
                            <p className={styles.transactionInfo}>{waitingMessage}</p>
                        </div>
                    }
                    {role === "medicalInstitute" &&
                        <div className={styles.container}>
                            <h2 className={styles.registerMessage}>Logged in as a medical institute</h2>
                            <div className={styles.returnContainer}>
                                <button className={`button ${styles.registerBtn}`} onClick={getPatientsData}>Get all patients' data</button>
                                <div className={`getPatientsData ${styles.allMyPatients}`}></div>
                            </div>
                            
                            <p className={styles.transactionInfo}>{error}</p>
                            <p className={styles.transactionInfo}>{successMessage}</p>                      
                            <p className={styles.transactionInfo}>{waitingMessage}</p>
                        </div>
                    }
                    {role === "none" &&
                        <div className={styles.container}>
                            <h2 className={styles.registerMessage}>Please, register to proceed</h2>
                            <div className={`registerPatient ${styles.registerContainer}`}>
                                <input className={styles.input} type="text" placeholder='Enter your chosen name'></input>
                                <button className={`button ${styles.registerBtn}`} onClick={registerAsPatient}>Register as patient</button>
                            </div>
                            <div className={`registerDoctor ${styles.registerContainer}`}>
                                <input className={styles.input} type="text" placeholder='Enter your chosen name'></input>
                                <button className={`button ${styles.registerBtn}`} onClick={registerAsDoctor} >Register as doctor</button>
                            </div>
                            <div className={`registerMedicalInstitute ${styles.registerContainer}`}>
                                <input className={styles.input} type="text" placeholder='Enter your chosen name'></input>
                                <button className={`button ${styles.registerBtn}`} onClick={registerAsMedicalInstitute} >Register as medical institute</button>
                            </div>
                            <p className={styles.transactionInfo}>{error}</p>
                            <p className={styles.transactionInfo}>{successMessage}</p>                      
                            <p className={styles.transactionInfo}>{waitingMessage}</p>
                        </div>
                    }
                </div>
            ) : (
                <div className={styles.container}>
                    <h1 className={styles.title}>PatientX</h1>
                    <h2 className={styles.connectWalletMessage}>Please, connect your wallet to proceed</h2>
                    <button className={`button ${styles.connectWalletBtn}`} onClick={connectWalletHandler}>Connect Wallet</button>
                    <p className={styles.transactionInfo}>{error}</p>
                    <p className={styles.transactionInfo}>{successMessage}</p>                      
                    <p className={styles.transactionInfo}>{waitingMessage}</p>
                </div>
            )}
        </div>
    );
}

export default PatientX;