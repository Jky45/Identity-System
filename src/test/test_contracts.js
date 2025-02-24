const { getEASContract, getSchemaRegistryContract } = require("../utils/contracts.js");

async function testContracts() {
    console.log("🔍 Probando acceso a los contratos...");
    try {
        const easContract = await getEASContract();
        console.log("✅ Contrato EAS obtenido en:", await easContract.getAddress());

        const schemaRegistry = await getSchemaRegistryContract();
        console.log("✅ Contrato SchemaRegistry obtenido en:", await schemaRegistry.getAddress());
    } catch (error) {
        console.error("❌ Error al obtener contratos:", error.message);
    }
}

testContracts();
