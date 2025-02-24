const hre = require("hardhat");
const { getSchemaRegistryContract } = require("../utils/contracts.js"); // Asegúrate de que la ruta sea correcta

async function main() {
    console.log("\n🔍 Obteniendo instancia del contrato SchemaRegistry...");
    
    // Obtener la instancia del contrato SchemaRegistry
    const schemaRegistry = await getSchemaRegistryContract();

    // =============================
    // 🔴 ESCUCHAR EVENTOS EN TIEMPO REAL
    // =============================
    
    schemaRegistry.on("SchemaRegistrationAttempt", (sender, schema, resolver, revocable) => {
        console.log(`📢 Intento de registro por ${sender}`);
        console.log(`📄 Esquema: ${schema}`);
        console.log(`🔗 Resolver: ${resolver}`);
        console.log(`🔁 Revocable: ${revocable}\n`);
    });

    schemaRegistry.on("UIDCalculated", (uid, schema, resolver, revocable) => {
        console.log(`🔢 UID calculado: ${uid}`);
        console.log(`📄 Esquema: ${schema}`);
        console.log(`🔗 Resolver: ${resolver}`);
        console.log(`🔁 Revocable: ${revocable}\n`);
    });

    schemaRegistry.on("SchemaAlreadyExists", (uid) => {
        console.log(`⚠️ El esquema con UID ${uid} ya existe y no puede ser registrado nuevamente.\n`);
    });

    schemaRegistry.on("SchemaRegistered", (uid, registerer, schemaRecord) => {
        console.log(`✅ Esquema registrado con éxito.`);
        console.log(`🔢 UID: ${uid}`);
        console.log(`👤 Registrado por: ${registerer}`);
        console.log(`📄 Esquema: ${schemaRecord.schema}`);
        console.log(`🔗 Resolver: ${schemaRecord.resolver}`);
        console.log(`🔁 Revocable: ${schemaRecord.revocable}\n`);
    });

    schemaRegistry.on("SchemaRetrieved", (uid, schemaRecord) => {
        console.log(`🔍 Esquema recuperado.`);
        console.log(`🔢 UID: ${uid}`);
        console.log(`📄 Esquema: ${schemaRecord.schema}`);
        console.log(`🔗 Resolver: ${schemaRecord.resolver}`);
        console.log(`🔁 Revocable: ${schemaRecord.revocable}\n`);
    });

    console.log("\n🎧 Escuchando eventos en tiempo real...");

    // =============================
    // 🟢 REGISTRAR UN NUEVO ESQUEMA
    // =============================

    const schema = "string did, string university, bool valid"; // Definir estructura del esquema
    const resolver = hre.ethers.ZeroAddress; // Sin resolver (resolver vacío)
    const isRevocable = true; // Define si las atestaciones pueden ser revocadas

    console.log("\n📝 Registrando un nuevo esquema en el contrato...");
    try {
        const tx = await schemaRegistry.register(schema, resolver, isRevocable);
        console.log(`🚀 Transacción enviada: ${tx.hash}`);
        await tx.wait();
        console.log("✅ Esquema registrado correctamente.\n");
    } catch (error) {
        console.error("❌ Error al registrar el esquema:", error.message);
    }

    // =============================
    // 🔵 CONSULTAR UN ESQUEMA
    // =============================

    console.log("\n🔍 Consultando el esquema registrado...");
    try {
        const uid = hre.ethers.keccak256(hre.ethers.toUtf8Bytes(schema)); // Calculamos UID manualmente
        const schemaData = await schemaRegistry.getSchema(uid);
        console.log(`📄 Esquema obtenido:`, schemaData);
    } catch (error) {
        console.error("❌ Error al obtener el esquema:", error.message);
    }

    console.log("\n🎧 Sigue escuchando eventos... Presiona CTRL+C para detener.");
}

// Manejo de errores
main().catch((error) => {
    console.error("❌ Error en el script:", error);
    process.exitCode = 1;
});
