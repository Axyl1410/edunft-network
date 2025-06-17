// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GradeBook {
    struct CourseGrade {
        string courseName;
        uint256 grade;
    }

    mapping(address => CourseGrade[]) public studentGrades;
    mapping(address => bool) public allowedTeachers;
    address[] public teacherAddresses;

    event GradeAdded(
        address indexed studentAddress,
        string courseName,
        uint256 grade
    );
    event GradeUpdated(
        address indexed studentAddress,
        string courseName,
        uint256 oldGrade,
        uint256 newGrade
    );
    event TeacherAdded(address indexed teacher);
    event TeacherRemoved(address indexed teacher);

    address public owner;

    constructor() {
        owner = msg.sender;
        _addTeacher(msg.sender);
    }

    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "Only the contract owner can call this function."
        );
        _;
    }

    modifier onlyAllowedTeacher() {
        require(
            allowedTeachers[msg.sender],
            "Caller is not an authorized teacher."
        );
        _;
    }

    function _addTeacher(address _teacherAddress) internal {
        require(
            _teacherAddress != address(0),
            "Teacher address cannot be zero."
        );
        if (!allowedTeachers[_teacherAddress]) {
            allowedTeachers[_teacherAddress] = true;
            teacherAddresses.push(_teacherAddress);
            emit TeacherAdded(_teacherAddress);
        }
    }

    function addTeacher(address _teacherAddress) public onlyOwner {
        _addTeacher(_teacherAddress);
    }

    function removeTeacher(address _teacherAddress) public onlyOwner {
        require(
            _teacherAddress != address(0),
            "Teacher address cannot be zero."
        );
        require(
            allowedTeachers[_teacherAddress],
            "Teacher is not in the allowed list."
        );

        allowedTeachers[_teacherAddress] = false;

        for (uint i = 0; i < teacherAddresses.length; i++) {
            if (teacherAddresses[i] == _teacherAddress) {
                teacherAddresses[i] = teacherAddresses[
                    teacherAddresses.length - 1
                ];
                teacherAddresses.pop();
                break;
            }
        }
        emit TeacherRemoved(_teacherAddress);
    }

    function getAllowedTeachers() public view returns (address[] memory) {
        return teacherAddresses;
    }

    function addOrUpdateGrade(
        address _studentAddress,
        string memory _courseName,
        uint256 _grade
    ) public onlyAllowedTeacher {
        require(
            _studentAddress != address(0),
            "Student address cannot be zero."
        );
        require(bytes(_courseName).length > 0, "Course name cannot be empty.");
        require(_grade <= 4, "Grade must be between 0 and 4 (inclusive).");

        CourseGrade[] storage grades = studentGrades[_studentAddress];
        bool found = false;

        for (uint i = 0; i < grades.length; i++) {
            if (
                keccak256(abi.encodePacked(grades[i].courseName)) ==
                keccak256(abi.encodePacked(_courseName))
            ) {
                uint256 oldGrade = grades[i].grade;
                grades[i].grade = _grade;
                found = true;
                emit GradeUpdated(
                    _studentAddress,
                    _courseName,
                    oldGrade,
                    _grade
                );
                break;
            }
        }

        if (!found) {
            grades.push(CourseGrade(_courseName, _grade));
            emit GradeAdded(_studentAddress, _courseName, _grade);
        }
    }

    function getStudentGrades(
        address _studentAddress
    ) public view returns (CourseGrade[] memory) {
        return studentGrades[_studentAddress];
    }

    function getStudentCourseGrade(
        address _studentAddress,
        string memory _courseName
    ) public view returns (string memory, uint256) {
        CourseGrade[] storage grades = studentGrades[_studentAddress];
        for (uint i = 0; i < grades.length; i++) {
            if (
                keccak256(abi.encodePacked(grades[i].courseName)) ==
                keccak256(abi.encodePacked(_courseName))
            ) {
                return (grades[i].courseName, grades[i].grade);
            }
        }
        return ("", 0);
    }
}
