// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@thirdweb-dev/contracts/base/ERC20Base.sol";
import "@thirdweb-dev/contracts/extension/PermissionsEnumerable.sol";

contract QuestionReward is ERC20Base, PermissionsEnumerable {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant QUESTION_CREATOR_ROLE = keccak256("QUESTION_CREATOR_ROLE");
    
    address public immutable systemTreasury;
    
    struct Question {
        address author;
        uint256 rewardAmount;
        bool isActive;
        bool isAnswered;
        address acceptedAnswer;
    }
    
    mapping(bytes32 => Question) public questions;
    
    event QuestionCreated(bytes32 indexed questionId, address indexed author, uint256 rewardAmount);
    event AnswerAccepted(bytes32 indexed questionId, address indexed answerer);
    event RewardDistributed(bytes32 indexed questionId, address indexed recipient, uint256 amount);
    
    constructor(
        address _defaultAdmin,
        string memory _name,
        string memory _symbol,
        address _systemTreasury
    ) ERC20Base(_defaultAdmin, _name, _symbol) {
        _setupRole(DEFAULT_ADMIN_ROLE, _defaultAdmin);
        _setupRole(MINTER_ROLE, _defaultAdmin);
        _setupRole(QUESTION_CREATOR_ROLE, _defaultAdmin);
        systemTreasury = _systemTreasury;
    }

    function mint(address to, uint256 amount) external {
        require(hasRole(MINTER_ROLE, msg.sender), "Not authorized");
        _mint(to, amount);
    }
    
    function createQuestion(bytes32 questionId, uint256 rewardAmount) external {
        require(hasRole(QUESTION_CREATOR_ROLE, msg.sender), "Not authorized");
        require(rewardAmount > 0, "Reward amount must be greater than 0");
        require(balanceOf(msg.sender) >= rewardAmount, "Insufficient balance");
        
        transfer(address(this), rewardAmount);
        
        Question storage question = questions[questionId];
        question.author = msg.sender;
        question.rewardAmount = rewardAmount;
        question.isActive = true;
        
        emit QuestionCreated(questionId, msg.sender, rewardAmount);
    }
    
    function acceptAnswer(bytes32 questionId, address answerer) external {
        Question storage question = questions[questionId];
        require(question.isActive, "Question is not active");
        require(!question.isAnswered, "Question already answered");
        require(msg.sender == question.author, "Only author can accept answer");
        require(answerer != question.author, "Cannot accept own answer");
        
        question.isAnswered = true;
        question.acceptedAnswer = answerer;
        
        // Calculate reward distribution
        uint256 rewardAmount = question.rewardAmount;
        
        // 95% to answerer (50% community + 45% author choice)
        uint256 answererReward = (rewardAmount * 95) / 100;
        // 5% to system treasury
        uint256 systemReward = (rewardAmount * 5) / 100;
        
        // Transfer rewards
        transfer(answerer, answererReward);
        transfer(systemTreasury, systemReward);
        
        emit AnswerAccepted(questionId, answerer);
        emit RewardDistributed(questionId, answerer, answererReward);
        emit RewardDistributed(questionId, systemTreasury, systemReward);
    }
    
    function getQuestionDetails(bytes32 questionId) external view returns (
        address author,
        uint256 rewardAmount,
        bool isActive,
        bool isAnswered,
        address acceptedAnswer
    ) {
        Question storage question = questions[questionId];
        return (
            question.author,
            question.rewardAmount,
            question.isActive,
            question.isAnswered,
            question.acceptedAnswer
        );
    }
} 