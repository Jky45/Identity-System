const hre = require("hardhat");

const { CONTRACT_ADDRESSES } = require("../config.js");
const EAS_ABI = require("../abi/EAS.json");
const SCHEMA_REGISTRY_ABI = require("../abi/SchemaRegistry.json");

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
    const signers = await hre.ethers.getSigners(); // Obtén los signers asíncronamente
    return new hre.ethers.Contract(
        CONTRACT_ADDRESSES.SCHEMA_REGISTRY,
        SCHEMA_REGISTRY_ABI.abi,
        signers[0] // Usa el primer signer
    );
}

module.exports = {
    getEASContract,
    getSchemaRegistryContract,
};
