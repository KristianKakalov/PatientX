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

interface IPatientX {
    function getMedicalExaminationsShareable() payable external returns (MyLibrary.MedicalExamination[] memory);

    function enlistMedicalInstitute(string calldata _name) external;
}

contract InstitutesInteraction {
    function enlistMedicalInstitute(IPatientX _address, string calldata _name) external {
        _address.enlistMedicalInstitute(_name);
    }

    function getMedicalExaminationsShareable(address _address) external payable returns(MyLibrary.MedicalExamination[] memory) {
        IPatientX patientXContract = IPatientX(_address);
        return patientXContract.getMedicalExaminationsShareable{value: msg.value}();
    }
}