const institutesInteractionABI = [{ "inputs": [{ "internalType": "contract IPatientX", "name": "_address", "type": "address" }, { "internalType": "string", "name": "_name", "type": "string" }], "name": "enlistMedicalInstitute", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_address", "type": "address" }], "name": "getMedicalExaminationsShareable", "outputs": [{ "components": [{ "internalType": "address", "name": "doctorAddress", "type": "address" }, { "internalType": "address", "name": "patientAddress", "type": "address" }, { "internalType": "string", "name": "data", "type": "string" }], "internalType": "struct MyLibrary.MedicalExamination[]", "name": "", "type": "tuple[]" }], "stateMutability": "payable", "type": "function" }];
const patientxABI = [{ "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "string", "name": "func", "type": "string" }, { "indexed": false, "internalType": "address", "name": "sender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }, { "indexed": false, "internalType": "bytes", "name": "data", "type": "bytes" }], "name": "Log", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "oldOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnerSet", "type": "event" }, { "stateMutability": "payable", "type": "fallback" }, { "inputs": [{ "internalType": "address", "name": "_patientAddress", "type": "address" }, { "internalType": "address", "name": "_doctorAddress", "type": "address" }], "name": "addDoctorToPatient", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_patientAddress", "type": "address" }, { "internalType": "address", "name": "_medicalInstituteAddress", "type": "address" }], "name": "addInstituteToPatient", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_doctorAddress", "type": "address" }, { "internalType": "address", "name": "_patientAddress", "type": "address" }, { "internalType": "string", "name": "_data", "type": "string" }], "name": "addNewMedicalExaminationOfPatientByDoctor", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "allInstituteDataByAddress", "outputs": [{ "internalType": "uint256", "name": "numOfMedExams", "type": "uint256" }, { "internalType": "uint256", "name": "numOfPatientsSharingData", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_newOwner", "type": "address" }], "name": "changeOwner", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "_name", "type": "string" }], "name": "enlistDoctor", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "_name", "type": "string" }], "name": "enlistMedicalInstitute", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "_name", "type": "string" }], "name": "enlistPatient", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_patientAddress", "type": "address" }], "name": "getAllDoctorsOfPatient", "outputs": [{ "components": [{ "internalType": "address", "name": "doctorAddress", "type": "address" }, { "internalType": "string", "name": "name", "type": "string" }], "internalType": "struct MyLibrary.Doctor[]", "name": "", "type": "tuple[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_patientAddress", "type": "address" }], "name": "getAllInstitutesOfPatient", "outputs": [{ "components": [{ "internalType": "address", "name": "instituteAddress", "type": "address" }, { "internalType": "string", "name": "name", "type": "string" }], "internalType": "struct MyLibrary.MedicalInstitute[]", "name": "", "type": "tuple[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_doctorAddress", "type": "address" }], "name": "getAllPatientsOfDoctor", "outputs": [{ "components": [{ "internalType": "address", "name": "patientAddress", "type": "address" }, { "internalType": "string", "name": "name", "type": "string" }], "internalType": "struct MyLibrary.Patient[]", "name": "", "type": "tuple[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getMedicalExaminationsShareable", "outputs": [{ "components": [{ "internalType": "address", "name": "doctorAddress", "type": "address" }, { "internalType": "address", "name": "patientAddress", "type": "address" }, { "internalType": "string", "name": "data", "type": "string" }], "internalType": "struct MyLibrary.MedicalExamination[]", "name": "", "type": "tuple[]" }], "stateMutability": "payable", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_patientAddress", "type": "address" }, { "internalType": "address", "name": "_doctorAddress", "type": "address" }], "name": "removeDoctorFromPatient", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_patientAddress", "type": "address" }, { "internalType": "address", "name": "_medicalInstituteAddress", "type": "address" }], "name": "removeInstituteFromPatient", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "suchDoctorExists", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "suchMedicalInstituteExists", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "suchPatientExists", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "stateMutability": "payable", "type": "receive" }];

const institutesInteraction = (web3) => {
    return new web3.eth.Contract(institutesInteractionABI, "0x5c74B41Ca7ceb8a90e299a115044eDCdCe4E2C3c");
}

const patientX = (web3) => {
    return new web3.eth.Contract(patientxABI, "0xD26438C0282F30252674aE37298442c888DB0C18");
}

export { institutesInteraction, patientX };