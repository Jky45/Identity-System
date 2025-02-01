// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

// contract Lock {
//     uint public unlockTime;
//     address payable public owner;

//     event Withdrawal(uint amount, uint when);

//     constructor(uint _unlockTime) payable {
//         require(
//             block.timestamp < _unlockTime,
//             "Unlock time should be in the future"
//         );

//         unlockTime = _unlockTime;
//         owner = payable(msg.sender);
//     }

//     function withdraw() public {
//         // Uncomment this line, and the import of "hardhat/console.sol", to print a log in your terminal
//         // console.log("Unlock time is %o and block timestamp is %o", unlockTime, block.timestamp);

//         require(block.timestamp >= unlockTime, "You can't withdraw yet");
//         require(msg.sender == owner, "You aren't the owner");

//         emit Withdrawal(address(this).balance, block.timestamp);

//         owner.transfer(address(this).balance);
//     }

//     function getTime() public view returns(uint){
//         return unlockTime;
//     }
// }




contract Lock {
    struct Identity {
        string did;            // DID del usuario
        string metadataHash;   // Hash IPFS de los metadatos
        bool verified;         // Estado de verificación
    }

    mapping(string => Identity) private identities; // Mapeo de DID a Identidad
    mapping(address => string) private ownerToDID;  // Relación de address a DID
    address public admin;                           // Dirección del administrador

    event IdentityRegistered(string did, string metadataHash, address owner);
    event IdentityUpdated(string did, string newMetadataHash);
    event IdentityVerified(string did);

    modifier onlyAdmin() {
        require(msg.sender == admin, "not Admin");
        _;
    }

    modifier onlyOwner(string memory did) {
        require(
            keccak256(abi.encodePacked(ownerToDID[msg.sender])) == keccak256(abi.encodePacked(did)),
            "No eres el propietario de este DID"
        );
        _;
    }

    constructor() {
        admin = msg.sender; // El despliegue asigna al admin inicial
    }

    function registerIdentity(string memory did, string memory metadataHash) public {
        // require(bytes(identities[did].did).length == 0, "DID ya registrado");
        // require(bytes(ownerToDID[msg.sender]).length == 0, "Ya tienes un DID registrado");

        identities[did] = Identity({
            did: did,
            metadataHash: metadataHash,
            verified: false
        });

        ownerToDID[msg.sender] = did;

        emit IdentityRegistered(did, metadataHash, msg.sender);
    }

    function updateMetadata(string memory did, string memory newMetadataHash) public onlyOwner(did) {
        require(bytes(identities[did].did).length > 0, "DID no registrado");

        identities[did].metadataHash = newMetadataHash;

        emit IdentityUpdated(did, newMetadataHash);
    }

    function verifyIdentity(string memory did) public onlyAdmin {
        require(bytes(identities[did].did).length > 0, "DID no registrado");

        identities[did].verified = true;

        emit IdentityVerified(did);
    }

    function getIdentity(string memory did) public view returns (string memory, string memory, bool) {
        require(bytes(identities[did].did).length > 0, "DID no registrado");

        Identity memory identity = identities[did];
        return (identity.did, identity.metadataHash, identity.verified);
    }
}
