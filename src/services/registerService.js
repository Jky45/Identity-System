const { getAgent } = require("../veramo/agent.js");
const { uploadToIPFS } = require("../ipfs/ipfs_client");
const hre = require("hardhat");
const { CONTRACT_ADDRESSES } = require("../../config.js");

const registerIdentity = async (req, res) => {
    try {
        const { address, metadata } = req.body;

        if (!address) {
            return res.status(400).json({ error: "Se requiere una dirección blockchain." });
        }

        console.log(`🔍 Registrando DID para la dirección: ${address}...`);

        const agent = getAgent();

        // **Crear DID con Veramo**
        const did = await agent.didManagerCreate({
            alias: address,
            provider: "did:ethr:ganache",
            kms: "local",
        });

        console.log(`✅ DID Creado: ${did.did}`);

        // **Subir metadatos a IPFS**
        console.log("🔼 Subiendo metadatos a IPFS...");
        const ipfsHash = await uploadToIPFS(JSON.stringify(metadata));
        console.log(`✅ Metadatos subidos a IPFS: ${ipfsHash}`);

        // **Forzar conexión a la red de Ganache**
        console.log("🔍 Conectando a Ganache...");
        const ganacheProvider = new hre.ethers.JsonRpcProvider("http://127.0.0.1:7545");
        const wallet = new hre.ethers.Wallet(
            "0xc86fdc2ae87717a37b9321922100960055afb30d1c5f95dfd4a604c8d70e2a7b", // 🔑 Private Key de Ganache
            ganacheProvider
        );

        console.log(`✅ Usando cuenta: ${wallet.address}`);

        // **Obtener contrato IdentityRegistry conectado a Ganache**
        console.log("🔍 Obteniendo contrato IdentityRegistry...");
        const IdentityRegistry = await hre.ethers.getContractFactory("IdentityRegistry", wallet);
        const contract = IdentityRegistry.attach(CONTRACT_ADDRESSES.IDENTITY_REGISTRY);

        // **Registrar en la blockchain**
        console.log("📝 Registrando identidad en el contrato...");
        const tx = await contract.registerIdentity(did.did, ipfsHash);
        await tx.wait();

        console.log(`✅ Identidad registrada en la blockchain: ${tx.hash}`);

        return res.status(201).json({
            message: "Identidad registrada con éxito",
            did: did.did,
            ipfsHash,
            txHash: tx.hash,
        });

    } catch (error) {
        console.error("❌ Error al registrar la identidad:", error);
        return res.status(500).json({
            error: "Error registrando la identidad",
            details: error.message,
        });
    }
};

module.exports = { registerIdentity };
