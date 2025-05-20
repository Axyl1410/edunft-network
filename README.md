# EDUNFT NETWORK

<div align="center">
  <img src="https://edunft-monorepo-student.vercel.app/_next/static/media/Logo_320x320.1a8c8212.png" alt="EduNFT Logo" width="150" height="150">
  <h3>Blockchain-based Education Certification Platform</h3>
  
  ![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-blue)
  ![NestJS](https://img.shields.io/badge/NestJS-11.0.1-red)
  ![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black)
  ![pnpm](https://img.shields.io/badge/pnpm-10.4.1-orange)
  ![MongoDB](https://img.shields.io/badge/MongoDB-8.13.2-green)
  ![ThirdWeb](https://img.shields.io/badge/ThirdWeb-5.99.1-purple)
</div>

## Overview

EduNFT Network is a blockchain-based digital education ecosystem that provides a platform for managing, verifying, and exchanging certificates and educational materials in the form of NFTs. The system serves three main user groups: students, educational institutions, and enterprises.

The project is built using a monorepo architecture, utilizing pnpm workspace and Turborepo to efficiently manage multiple applications and shared packages.

<div align="center">
  <img src="https://apricot-passive-wolverine-250.mypinata.cloud/ipfs/bafkreibousof54vqvkjy4nfjg4m3k72yzgewqj2xah5lzhwgwprzhujehi" alt="EduNFT Student Interface" width="100%">
</div>

## Table of Contents

- [Overview](#overview)
- [System Architecture](#system-architecture)
- [Key Features](#key-features)
- [Technologies](#technologies)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Development](#development)

## System Architecture

EduNFT Network is designed with a microservices architecture:

1. **Frontend Applications**: Separate user interfaces for different user groups (student, school, enterprise)
2. **Backend API**: NestJS RESTful API and WebSocket services 
3. **Database**: MongoDB for data storage and user management
4. **Blockchain Integration**: Smart contracts and NFT interactions on FORMA_SKETCHPAD network
5. **Shared Libraries**: UI components and utilities shared across applications

## Key Features

### 🧑‍🎓 Student Portal

- **Dashboard & Analytics**: Overview of activities, certificates, and events
- **Wallet Integration**: Connect with Web3 wallets (MetaMask, Coinbase, Rainbow) to manage NFTs
- **Content Discovery**: Explore, buy, and sell educational certificates and materials  
- **File Management**: Upload, and version-control educational documents
- **Q&A System**: Ask questions, receive token rewards for quality answers
- **Event Management**: Register for events and receive NFT participation certificates


### 🏫 School Portal

- **Student Management**: Manage student records, classes, and track progress
- **Certificate Issuance**: Create and issue blockchain certificates to students
- **Content Management**: Create courses and assessments with CKEditor integration
- **Event Organization**: Schedule events, track attendance, and gather feedback

### 💼 Enterprise Portal

- **Verification System**: Scan and verify certificate authenticity
- **Recruitment**: Match candidates based on verified skills and certificates
- **Skill Management**: Track employee certifications and plan training programs

### ⚙️ Backend & Blockchain

- **Authentication & Authorization**: JWT authentication and role-based access
- **Real-time Communication**: Socket.io for notifications and messaging
- **Smart Contracts**: ERC-721 NFT certificates with verification methods
- **Token Economy**: Reward system for educational achievements

```solidity
// Certificate NFT Contract
contract EduCertificate is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    
    mapping(uint256 => string) private _certificateHashes;
    mapping(uint256 => address) private _certificateIssuers;

    event CertificateIssued(uint256 tokenId, address student, string hash);
    
    function issueCertificate(
        address student, 
        string memory tokenURI,
        string memory certificateHash
    ) public onlyOwner returns (uint256) {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        
        _mint(student, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        _certificateHashes[newTokenId] = certificateHash;
        _certificateIssuers[newTokenId] = msg.sender;
        
        emit CertificateIssued(newTokenId, student, certificateHash);
        return newTokenId;
    }
    
    function verifyCertificate(
        uint256 tokenId, 
        address student,
        string memory certificateHash
    ) public view returns (bool) {
        return ownerOf(tokenId) == student && 
               keccak256(bytes(_certificateHashes[tokenId])) == 
               keccak256(bytes(certificateHash));
    }
}
```

## Technologies

### Frontend
- **Next.js**: ^15.2.4 - Modern UI with server-side rendering
- **React**: ^19.0.0 - UI library
- **TailwindCSS**: ^4.0.8 - Utility-first styling
- **Zustand**: ^5.0.4 - State management
- **ThirdWeb**: ^5.99.1 - Web3 integration
- **Socket.io-client**: ^4.8.1 - Real-time communication
- **CKEditor**: ^44.3.0 - Rich text editing

### Backend
- **NestJS**: ^11.0.1 - Node.js framework with TypeScript
- **MongoDB**: ^8.13.2 - NoSQL database
- **Mongoose**: ^11.0.3 - MongoDB ODM
- **Socket.io**: ^4.8.1 - Real-time communications
- **JWT**: ^11.0.0 - Authentication

### Blockchain
- **Hardhat**: ^2.19.0 - Ethereum development environment
- **Solidity**: ^0.8.20 - Smart contract language
- **OpenZeppelin**: ^5.3.0 - Secure contract libraries
- **ThirdWeb SDK**: ^3.10.0 - Web3 development kit

## Project Structure

```
edunft-monorepo/
├── apps/                      
│   ├── api/                   # NestJS Backend API
│   ├── student/               # Student Portal (Next.js)
│   ├── school/                # School Portal (Next.js) 
│   ├── enterprise/            # Enterprise Portal (Next.js)
│   ├── homepage/              # Landing Page (Next.js)
│   └── hardhat/               # Smart Contracts (Solidity)
├── packages/                  
│   ├── ui/                    # Shared UI components (React)
│   ├── math/                  # Utility functions
│   ├── eslint-config/         # Shared ESLint configuration
│   └── typescript-config/     # Shared TypeScript configuration
└── package.json              
```

## Installation

### Requirements
- Node.js >= 20.x
- pnpm = 10.4.1
- MongoDB = 8.13.2
- MetaMask or compatible Web3 wallet
- FORMA_SKETCHPAD network access

### Environment Setup
1. Create `.env` files for each application:

```bash
# apps/api/.env
MONGODB_URI=mongodb://localhost:27017/edunft
JWT_SECRET=your-secret-key
BLOCKCHAIN_RPC_URL=your-forma-rpc-url

# apps/hardhat/.env
PRIVATE_KEY=your-deployer-private-key
FORMA_RPC_URL=your-forma-rpc-url
```

### Quick Start
```bash
# Clone repository
git clone https://github.com/edunft/edunft-network.git
cd edunft-network

# Install dependencies
pnpm install

# Setup environment variables
cp apps/api/.env.example apps/api/.env
cp apps/hardhat/.env.example apps/hardhat/.env

# Start development servers
pnpm dev
```

### Development Ports
- Student Portal: http://localhost:3001
- School Portal: http://localhost:3002
- Enterprise Portal: http://localhost:3003
- API: http://localhost:4000

## Development

### Smart Contract Deployment
```bash
# Deploy to local network
cd apps/hardhat
pnpm hardhat compile
pnpm hardhat test
pnpm hardhat run scripts/deploy.ts

# Deploy to FORMA_SKETCHPAD
pnpm hardhat run scripts/deploy.ts --network forma
```

### Git Workflow
1. Fork and clone the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit using conventions: `git commit -m 'feat: add feature'`
4. Push and open a pull request

### Commits
Follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `refactor:` - Code refactoring

### Testing
```bash
# Run all tests
pnpm test

# Run specific app tests
cd apps/api && pnpm test
cd apps/hardhat && pnpm test
```

---

<div align="center">
  <p>© 2025 EduNFT Network </p>
</div>
