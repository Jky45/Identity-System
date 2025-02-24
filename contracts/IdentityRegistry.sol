// SPDX-License-Identifier: MIT
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





contract IdentityRegistry {
    struct Identity {
        string metadataHash;   // Hash IPFS de los metadatos
        string attestationId;  // ID de atestación
    }

    mapping(string => Identity) private identities; // Mapeo de DID a Identidad
    address public admin;                           // Dirección del administrador

    event IdentityRegistered(string did, string metadataHash);
    event IdentityUpdated(string did, string newMetadataHash);
    event IdentityAttested(string did, string attestationId);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not Admin");
        _;
    }

    constructor() {
        admin = msg.sender; // El despliegue asigna al admin inicial
    }

    function registerIdentity(string memory did, string memory metadataHash) public onlyAdmin {
        require(bytes(identities[did].metadataHash).length == 0, "DID ya registrado");

        identities[did] = Identity({
            metadataHash: metadataHash,
            attestationId: ""
        });

        emit IdentityRegistered(did, metadataHash);
    }

    function updateMetadata(string memory did, string memory newMetadataHash) public onlyAdmin {
        require(bytes(identities[did].metadataHash).length > 0, "DID no registrado");

        identities[did].metadataHash = newMetadataHash;

        emit IdentityUpdated(did, newMetadataHash);
    }

    function attestIdentity(string memory did, string memory attestationId) public onlyAdmin {
        require(bytes(identities[did].metadataHash).length > 0, "DID no registrado");

        identities[did].attestationId = attestationId;

        emit IdentityAttested(did, attestationId);
    }

    function getIdentity(string memory did) public view returns (string memory, string memory) {
        require(bytes(identities[did].metadataHash).length > 0, "DID no registrado");

        Identity memory identity = identities[did];
        return (identity.metadataHash, identity.attestationId);
    }
}

