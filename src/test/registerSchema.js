const hre = require("hardhat");
const { getSchemaRegistryContract } = require("../utils/contracts.js");

async function main() {
    console.log("\n🔍 Obteniendo instancia del contrato SchemaRegistry...");

    const schemaRegistry = await getSchemaRegistryContract();

    const signers = await hre.ethers.getSigners();
    console.log(`👤 Usando cuenta: ${signers}`);
    console.log(schemaRegistry);


    if (!schemaRegistry || !schemaRegistry.target) {
        console.error("❌ Error: El contrato SchemaRegistry no se inicializó correctamente.");
        return;
    }

    console.log(`📜 Dirección del contrato SchemaRegistry: ${schemaRegistry.target}`);

    // =============================
    // 🟢 REGISTRAR UN NUEVO ESQUEMA
    // =============================

    const schema = "string vchash";
    const resolver = hre.ethers.ZeroAddress;
    const isRevocable = true;

    console.log("\n📝 Registrando un nuevo esquema en el contrato...");
    try {
        const tx = await schemaRegistry.register(schema, resolver, isRevocable);
        console.log("🚀 Transacción enviada:", tx);
        await tx.wait();
        console.log("✅ Esquema registrado correctamente.");
    } catch (error) {
        console.error("❌ Error al registrar el esquema:", error.message);
    }

    // =============================
    // 🔍 CONSULTAR EVENTOS
    // =============================
    console.log("\n🔍 Buscando eventos SchemaRegistered...");
    const logs = await schemaRegistry.queryFilter("SchemaRegistered");
    console.log(`📜 Eventos encontrados:`, logs);

    // =============================
    // 🔵 CONSULTAR UN ESQUEMA
    // =============================

    console.log("\n🔍 Consultando el esquema registrado...");
    try {
        await new Promise(resolve => setTimeout(resolve, 3000)); // Espera para indexación
        const uid = hre.ethers.keccak256(hre.ethers.toUtf8Bytes(schema));
        const schemaData = await schemaRegistry.getSchema(uid);
        console.log(`📄 Esquema obtenido:`, schemaData);
    } catch (error) {
        console.error("❌ Error al obtener el esquema:", error.message);
    }
}

// Manejo de errores
main().catch((error) => {
    console.error("❌ Error en el script:", error);
    process.exitCode = 1;
});
