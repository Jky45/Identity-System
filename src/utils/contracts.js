const hre = require("hardhat");

const { CONTRACT_ADDRESSES } = require("../../config.js");
const EAS_ABI = require("../../abi/EAS.json");
const SCHEMA_REGISTRY_ABI = require("../../abi/SchemaRegistry.json");

// Devuelve una instancia del contrato EAS
async function getEASContract() {
    const signers = await hre.ethers.getSigners(); // Obtén los signers asíncronamente
    return new hre.ethers.Contract(
        CONTRACT_ADDRESSES.EAS,
        EAS_ABI.abi,
        signers[0] // Usa el primer signer
    );
}

// Devuelve una instancia del contrato Schema Registry
async function getSchemaRegistryContract() {
    console.log("\n🔍 Intentando obtener el contrato SchemaRegistry...");
    
    const signers = await hre.ethers.getSigners(); // Obtiene las cuentas
    console.log("👤 Usando cuenta:", signers[0].address);

    if (!CONTRACT_ADDRESSES.SCHEMA_REGISTRY) {
        console.error("❌ Error: Dirección del contrato SchemaRegistry no definida en config.js.");
        return null;
    }

    console.log("📜 Dirección del contrato SchemaRegistry:", CONTRACT_ADDRESSES.SCHEMA_REGISTRY);

    try {
        const contract = new hre.ethers.Contract(
            CONTRACT_ADDRESSES.SCHEMA_REGISTRY,
            SCHEMA_REGISTRY_ABI.abi,
            signers[0] // Usa el primer signer como owner
        );

        console.log("✅ Contrato SchemaRegistry instanciado correctamente.");
        // console.log(contract)
        return contract;
    } catch (error) {
        console.error("❌ Error instanciando SchemaRegistry:", error.message);
        return null;
    }
}

module.exports = {
    getEASContract,
    getSchemaRegistryContract,
};
