//SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.7.0 <0.9.0;

library MyLibrary {
    struct Doctor {
        address doctorAddress;
        string name;
    }
 
    struct Patient{
        address patientAddress;
        string name;
    }
 
    struct MedicalInstitute{
        address instituteAddress;
        string name;
    }
 
    struct MedInstituteData{
        uint256 numOfMedExams;
        uint256 numOfPatientsSharingData;
    }
 
    struct MedicalExamination {
        address doctorAddress;
        address patientAddress;
        string data;
    }
}

contract PatientX {
    address public owner;

    address[] private patientAddresses;
    mapping(address => MyLibrary.Patient) private allPatientsByAddress;
    mapping(address => MyLibrary.MedicalExamination[]) private allMedicalExaminationsByPatientAddress;
    mapping(address => mapping(address => MyLibrary.Doctor)) private allDoctorsByPatientAddress;
    mapping(address => mapping(address => MyLibrary.MedicalInstitute)) private allMedicalInstitutesByPatientAddress;
    mapping(address => address[]) private allMedicalInstituteAddressesByPatientAddress;

    mapping(address => MyLibrary.Doctor) private allDoctorsByAddress;

    mapping(address => MyLibrary.MedicalInstitute) private allMedicalInstitutesByAddress;
    mapping(address => MyLibrary.MedInstituteData) public allInstituteDataByAddress;

    mapping(address => MyLibrary.Doctor[]) private doctorsOfPatient;
    mapping(address => MyLibrary.Patient[]) private patientsOfDoctor;
    mapping(address => MyLibrary.MedicalInstitute[]) private medicalInstitutesOfPatient;

    mapping(address => bool) public suchPatientExists;
    mapping(address => bool) public suchDoctorExists;
    mapping(address => bool) public suchMedicalInstituteExists;

    event Log(string func, address sender, uint256 value, bytes data);
    event OwnerSet(address indexed oldOwner, address indexed newOwner);

    constructor() {
        owner = msg.sender;
        emit OwnerSet(address(0), owner);
    }

    // ether is sent to the contract
    fallback() external payable {
        payable(owner).transfer(msg.value);
        emit Log("fallback", msg.sender, msg.value, msg.data);
    }

    // ether is sent to the contract without data
    receive() external payable {
        payable(owner).transfer(msg.value);
        emit Log("receive", msg.sender, msg.value, "");
    }

    modifier isOwner() {
        require(msg.sender == owner, "Only the owner can change the owner!");
        _;
    }

    modifier isPatient(address _patientAddress) {
        require(_patientAddress == msg.sender, "Caller is not the patient");
        _;
    }

    function changeOwner(address _newOwner) external isOwner {
        emit OwnerSet(owner, _newOwner);
        owner = _newOwner;
    }

    // enlistig users

    function enlistPatient(string calldata _name) external {
        require(allPatientsByAddress[msg.sender].patientAddress != msg.sender, "Already exists patient with that address");
        allPatientsByAddress[msg.sender] = MyLibrary.Patient({ patientAddress: msg.sender, name: _name });
        patientAddresses.push(msg.sender);
        suchPatientExists[msg.sender] = true;
    }

    function enlistDoctor(string calldata _name) external {
        require(allDoctorsByAddress[msg.sender].doctorAddress != msg.sender, "Already exists doctor with that address");
        allDoctorsByAddress[msg.sender] = MyLibrary.Doctor({ doctorAddress: msg.sender, name: _name });
        suchDoctorExists[msg.sender] = true;
    }

    function enlistMedicalInstitute(string calldata _name) external {
        require(allMedicalInstitutesByAddress[tx.origin].instituteAddress != tx.origin, "Already exists medical institute with that address");
        allMedicalInstitutesByAddress[tx.origin] = MyLibrary.MedicalInstitute({ instituteAddress: tx.origin, name: _name });
        allInstituteDataByAddress[tx.origin].numOfPatientsSharingData = 0;
        suchMedicalInstituteExists[tx.origin] = true;
    }

    // doctor functionality

    function addNewMedicalExaminationOfPatientByDoctor(address _doctorAddress, address _patientAddress, string calldata _data) external {
        require(_doctorAddress == msg.sender, "Caller is not the doctor");
        require(allPatientsByAddress[_patientAddress].patientAddress == _patientAddress, "No such patient exists");
        require(allDoctorsByPatientAddress[_patientAddress][_doctorAddress].doctorAddress ==  _doctorAddress, "Caller is not the doctor of this patient");

        MyLibrary.MedicalExamination memory medExam = MyLibrary.MedicalExamination(_doctorAddress, _patientAddress, _data);
        allMedicalExaminationsByPatientAddress[_patientAddress].push(medExam);

        updateInstitutesDataNewMedRecord(_patientAddress);
    }

    //helper function
    function updateInstitutesDataNewMedRecord(address _patientAddress) private {
        address[] memory institutesOfPatient = allMedicalInstituteAddressesByPatientAddress[_patientAddress];
        for (uint256 i = 0; i < institutesOfPatient.length; i++) {
            allInstituteDataByAddress[institutesOfPatient[i]].numOfMedExams++;
        }
    }

    function getAllPatientsOfDoctor(address _doctorAddress) external view returns (MyLibrary.Patient[] memory){
        require(_doctorAddress == msg.sender, "Caller is not the doctor");
        require(allDoctorsByAddress[_doctorAddress].doctorAddress == _doctorAddress, "No such doctor exists");

        return patientsOfDoctor[_doctorAddress];
    }

    // patient functionality

    function addDoctorToPatient(address _patientAddress, address _doctorAddress) external isPatient(_patientAddress) {
        require(allPatientsByAddress[_patientAddress].patientAddress == _patientAddress, "No such patient exists");
        require(allDoctorsByAddress[_doctorAddress].doctorAddress == _doctorAddress, "No such doctor exists");
        require(allDoctorsByPatientAddress[_patientAddress][_doctorAddress].doctorAddress != _doctorAddress, "This doctor has already been added by the patient");

        allDoctorsByPatientAddress[_patientAddress][_doctorAddress] = allDoctorsByAddress[_doctorAddress];
        doctorsOfPatient[_patientAddress].push(allDoctorsByAddress[_doctorAddress]);
        patientsOfDoctor[_doctorAddress].push(allPatientsByAddress[_patientAddress]);
    }

    function addInstituteToPatient(address _patientAddress, address _medicalInstituteAddress) external isPatient(_patientAddress) {
        require(allPatientsByAddress[_patientAddress].patientAddress == _patientAddress, "No such patient exists");
        require(allMedicalInstitutesByAddress[_medicalInstituteAddress].instituteAddress == _medicalInstituteAddress, "No such medical institute exists");
        require(allMedicalInstitutesByPatientAddress[_patientAddress][_medicalInstituteAddress].instituteAddress != _medicalInstituteAddress, "This medical institute has already been added by the patient");

        allMedicalInstituteAddressesByPatientAddress[_patientAddress].push(_medicalInstituteAddress);
        allMedicalInstitutesByPatientAddress[_patientAddress][_medicalInstituteAddress] = allMedicalInstitutesByAddress[_medicalInstituteAddress];
        allInstituteDataByAddress[_medicalInstituteAddress].numOfMedExams += allMedicalExaminationsByPatientAddress[_patientAddress].length;
        allInstituteDataByAddress[_medicalInstituteAddress].numOfPatientsSharingData++;
        medicalInstitutesOfPatient[_patientAddress].push(allMedicalInstitutesByAddress[_medicalInstituteAddress]);
    }

    function removeInstituteFromPatient(address _patientAddress, address _medicalInstituteAddress) external isPatient(_patientAddress) {
        require(allPatientsByAddress[_patientAddress].patientAddress == _patientAddress, "No such patient exists");
        require(allMedicalInstitutesByAddress[_medicalInstituteAddress].instituteAddress == _medicalInstituteAddress, "No such medical institute exists");
        require(allMedicalInstitutesByPatientAddress[_patientAddress][_medicalInstituteAddress].instituteAddress == _medicalInstituteAddress, "Caller does not share data with this institute");

        address[] storage patientInstitutesAddresses = allMedicalInstituteAddressesByPatientAddress[_patientAddress];
        for (uint256 i = 0; i < patientInstitutesAddresses.length; i++) {
            if (patientInstitutesAddresses[i] == _medicalInstituteAddress) {
                patientInstitutesAddresses[i] = patientInstitutesAddresses[patientInstitutesAddresses.length - 1];
                patientInstitutesAddresses.pop();
                break;
            }
        }

        MyLibrary.MedicalInstitute[] storage patientInstitutes = medicalInstitutesOfPatient[_patientAddress];
        for (uint256 i = 0; i < patientInstitutes.length; i++) {
            if (patientInstitutes[i].instituteAddress == _medicalInstituteAddress) {
                patientInstitutes[i] = patientInstitutes[patientInstitutes.length - 1];
                patientInstitutes.pop();
                break;
            }
        }

        delete allMedicalInstitutesByPatientAddress[_patientAddress][_medicalInstituteAddress];
        updateInstitutesDataPatientRemoved(_patientAddress,_medicalInstituteAddress);
    }

    // helper funciton
    function updateInstitutesDataPatientRemoved(address _patientAddress, address _medicalInstituteAddress) private {
        allInstituteDataByAddress[_medicalInstituteAddress].numOfMedExams -= allMedicalExaminationsByPatientAddress[_patientAddress].length;
        allInstituteDataByAddress[_medicalInstituteAddress].numOfPatientsSharingData -= 1;
    }

    function removeDoctorFromPatient(address _patientAddress, address _doctorAddress) external isPatient(_patientAddress) {
        require(allPatientsByAddress[_patientAddress].patientAddress == _patientAddress, "No such patient exists");
        require(allDoctorsByAddress[_doctorAddress].doctorAddress == _doctorAddress, "No such doctor exists");
        require(allDoctorsByPatientAddress[_patientAddress][_doctorAddress].doctorAddress == _doctorAddress, "This isn't one of the patient's doctors");

        MyLibrary.Doctor[] storage patientDoctors = doctorsOfPatient[_patientAddress];
        for (uint256 i = 0; i < patientDoctors.length; i++) {
            if (patientDoctors[i].doctorAddress == _doctorAddress) {
                patientDoctors[i] = patientDoctors[patientDoctors.length - 1];
                patientDoctors.pop();
                break;
            }
        }

        MyLibrary.Patient[] storage doctorPatients = patientsOfDoctor[_doctorAddress];
        for (uint256 i = 0; i < doctorPatients.length; i++) {
            if (doctorPatients[i].patientAddress == _patientAddress) {
                doctorPatients[i] = doctorPatients[doctorPatients.length - 1];
                doctorPatients.pop();
                break;
            }
        }

        delete allDoctorsByPatientAddress[_patientAddress][_doctorAddress];
    }

    function getAllDoctorsOfPatient(address _patientAddress) external view returns (MyLibrary.Doctor[] memory){
        require(_patientAddress == msg.sender, "Caller is not the patient");
        require(allPatientsByAddress[_patientAddress].patientAddress == _patientAddress, "No such patient exists");

        return doctorsOfPatient[_patientAddress];
    }

    function getAllInstitutesOfPatient(address _patientAddress) external view returns (MyLibrary.MedicalInstitute[] memory){
        require(_patientAddress == msg.sender, "Caller is not the patient");
        require(allPatientsByAddress[_patientAddress].patientAddress == _patientAddress, "No such patient exists");

        return medicalInstitutesOfPatient[_patientAddress];
    }

    // institute functionality

    function getMedicalExaminationsShareable() external payable returns (MyLibrary.MedicalExamination[] memory) {
        require(tx.origin == allMedicalInstitutesByAddress[tx.origin].instituteAddress, "No such medical institute");

        MyLibrary.MedicalExamination[] memory shareableMedicalExaminations = new MyLibrary.MedicalExamination[](allInstituteDataByAddress[tx.origin].numOfMedExams);
        uint256 shareableMedicalExaminationsIterator = 0;

        address[] memory addressesToSendKinti = new address[](allInstituteDataByAddress[tx.origin].numOfPatientsSharingData);
        uint256 sendKintiIterator = 0;

        for (uint256 i = 0; i < patientAddresses.length; i++) {
            if (allMedicalInstitutesByPatientAddress[patientAddresses[i]][tx.origin].instituteAddress == tx.origin) {
                addressesToSendKinti[sendKintiIterator] = patientAddresses[i];
                sendKintiIterator++;

                MyLibrary.MedicalExamination[] memory patientExaminations = allMedicalExaminationsByPatientAddress[patientAddresses[i]];
                for (uint256 j = 0; j < patientExaminations.length; j++) {
                    MyLibrary.MedicalExamination memory medExam = patientExaminations[j];
                    shareableMedicalExaminations[shareableMedicalExaminationsIterator] = medExam;
                    shareableMedicalExaminationsIterator++;
                }
            }
        }

        // owner will also receive kinti
        uint256 kintiPerPerson = 1e16 / (addressesToSendKinti.length + 1);

        for (uint256 i = 0; i < addressesToSendKinti.length; i++) {
            payable(addressesToSendKinti[i]).transfer(kintiPerPerson);
        }

        bool success = payable(owner).send(kintiPerPerson);
        require(success, "Failed send");

        return shareableMedicalExaminations;
    }
}
