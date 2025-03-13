const { getAgent } = require("../veramo/agent.js");
const { uploadToIPFS } = require("../ipfs/ipfs_client");
const hre = require("hardhat");
const { CONTRACT_ADDRESSES } = require("../../config.js");
const { attest } = require("../eas/attest.js"); // Importa la función attest

const createAttestation = async (req, res) => {
    try {
        let { address, claim } = req.body;

        if (!address || !claim) {
            return res.status(400).json({ error: "Se requieren la dirección blockchain y el claim." });
        }

        console.log(`🔍 Resolviendo DID para la dirección: ${address}...`);

        const agent = getAgent();
        
        // address = address.toLowerCase();
        // **Resolver el DID basado en el alias (address)**
        console.log(address);
        const identifier = await agent.didManagerGetByAlias({ alias: address });
        const did = identifier.did;
        console.log(`✅ DID Resuelto: ${did}`);

        // **Generar Verifiable Credential (VC)**
        console.log("📝 Creando Verifiable Credential...");
        const verifiableCredential = await agent.createVerifiableCredential({
            credential: {
                issuer: { id: did },
                credentialSubject: {
                    id: did,
                    ...claim,
                },
                issuanceDate: new Date().toISOString(),
            },
            proofFormat: "jwt",
        });

        console.log("✅ VC generada con éxito.");

        // **Subir la VC a IPFS**
        console.log("🔼 Subiendo la VC a IPFS...");
        const ipfsHash = await uploadToIPFS(JSON.stringify(verifiableCredential));
        console.log(`✅ VC almacenada en IPFS con CID: ${ipfsHash}`);

        // **Atestar la identidad en Ethereum Attestation Service**
        console.log("📜 Atestando identidad en EAS...");
        const attestationId = await attest(recipient, ipfsHash);
        console.log(`✅ Attestation ID generado: ${attestationId}`);

        // **Conectar a Ganache**
        console.log("🔍 Conectando a Ganache...");
        const ganacheProvider = new hre.ethers.JsonRpcProvider("http://127.0.0.1:7545");
        const wallet = new hre.ethers.Wallet(
            "0xc86fdc2ae87717a37b9321922100960055afb30d1c5f95dfd4a604c8d70e2a7b", // 🔑 Private Key de Ganache
            ganacheProvider
        );

        console.log(`✅ Usando cuenta: ${wallet.address}`);


        // **Actualizar el contrato IdentityRegistry con el Attestation ID**
        console.log("🔍 Registrando Attestation ID en IdentityRegistry...");
        const IdentityRegistry = await hre.ethers.getContractFactory("IdentityRegistry", wallet);
        const identityRegistry = IdentityRegistry.attach(CONTRACT_ADDRESSES.IDENTITY_REGISTRY);

        const tx = await identityRegistry.attestIdentity(did, attestationId);
        await tx.wait();
        console.log("✅ Attestation ID registrado en el contrato IdentityRegistry.");

        return res.status(200).json({
            message: "Identidad atestada con éxito",
            did,
            ipfsHash,
            attestationId,
        });

    } catch (error) {
        console.error("❌ Error al atestar la identidad:", error);
        return res.status(500).json({
            error: "Error atestando la identidad",
            details: error.message,
        });
    }
};

module.exports = { createAttestation };

