const { getAgent } = require("../veramo/agent.js");
const { getFromIPFS } = require("../ipfs/ipfs_client");
const hre = require("hardhat");
const { CONTRACT_ADDRESSES } = require("../../config.js");

const getIdentity = async (req, res) => {
    try {
        const { address } = req.params;

        if (!address) {
            return res.status(400).json({ error: "Se requiere una dirección blockchain." });
        }

        console.log(`🔍 Resolviendo DID para la dirección: ${address}...`);

        const agent = getAgent();

        // **Resolver el DID basado en el alias (address)**
        const identifier = await agent.didManagerGetByAlias({ alias: address });

        const did = identifier.did;
        console.log(`✅ DID Resuelto: ${did}`);

        // **Conectar a Ganache**
        console.log("🔍 Conectando a Ganache...");
        const ganacheProvider = new hre.ethers.JsonRpcProvider("http://127.0.0.1:7545");
        const wallet = new hre.ethers.Wallet(
            "0xc86fdc2ae87717a37b9321922100960055afb30d1c5f95dfd4a604c8d70e2a7b", // 🔑 Private Key de Ganache
            ganacheProvider
        );

        console.log(`✅ Usando cuenta: ${wallet.address}`);

        // **Obtener el contrato IdentityRegistry conectado a Ganache**
        console.log("🔍 Obteniendo contrato IdentityRegistry...");
        const IdentityRegistry = await hre.ethers.getContractFactory("IdentityRegistry", wallet);
        const contract = IdentityRegistry.attach(CONTRACT_ADDRESSES.IDENTITY_REGISTRY);

        // **Buscar en el contrato el hash de IPFS y la ID de atestación**
        console.log("🔍 Buscando metadata en el contrato...");
        const [metadataHash, attestationId] = await contract.getIdentity(did);

        if (!metadataHash || metadataHash === "0x") {
            return res.status(404).json({ error: "No se encontró metadata para este DID en el contrato." });
        }

        console.log(`✅ Hash de IPFS encontrado: ${metadataHash}`);
        console.log(`✅ Attestation ID encontrado: ${attestationId}`);

        // **Recuperar datos desde IPFS**
        console.log("🔽 Recuperando datos desde IPFS...");
        const metadata = await getFromIPFS(metadataHash);
        console.log("✅ Datos recuperados desde IPFS:", metadata);

        return res.status(200).json({
            did,
            metadata: metadata,
            ipfsHash: metadataHash,
            attestationId
        });

    } catch (error) {
        console.error("❌ Error al obtener la identidad:", error);
        return res.status(500).json({
            error: "Error obteniendo la identidad",
            details: error.message,
        });
    }
};

module.exports = { getIdentity };
