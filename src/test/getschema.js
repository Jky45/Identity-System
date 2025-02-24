const hre = require("hardhat");
const { getSchemaRegistryContract } = require("../utils/contracts.js");

async function main() {
    const schemaRegistryContract = await getSchemaRegistryContract();

    // Extraer el UID del esquema del log
    const schemaUID = `0x3886a3423426bd173ac652cc1d44e8438fbc226fb7facb6164c90b2ec69333ca`; // Solo los primeros 64 caracteres

    // Verificar si el esquema está registrado en el contrato
    const schemaRecord = await schemaRegistryContract.getSchema(schemaUID);

    if (schemaRecord.uid === hre.ethers.ZeroAddress) {
        console.error("Error: El esquema no se almacenó correctamente en el contrato.");
    } else {
        console.log("Esquema almacenado correctamente:", schemaRecord.uid);
    }

    return schemaUID;
}

main().catch((error) => {
    console.error("Error al registrar el esquema:", error.message);
    process.exitCode = 1;
});
