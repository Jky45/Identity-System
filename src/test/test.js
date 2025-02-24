const hre = require("hardhat");

async function main() {
  const contractAddress = "0x867823702FEc7469C66be5C11e38408A48dB7caA"; // Dirección del contrato

  console.log("🔍 Conectando al contrato SchemaRegistry en:", contractAddress);

  // Obtener el signer (cuenta que firmará la transacción)
  const signer = (await hre.ethers.getSigners())[0];
  console.log("👤 Usando cuenta:", signer.address);

  // Cargar ABI (asegúrate de tener el archivo JSON del ABI del contrato)
  const SCHEMA_REGISTRY_ABI = require("../../abi/SchemaRegistry.json");

  // Instanciar el contrato
  const schemaRegistry = new hre.ethers.Contract(contractAddress, SCHEMA_REGISTRY_ABI.abi, signer);

  // Definir los parámetros de la transacción
  const schema = "string did, string university, bool valid";
  const resolver = hre.ethers.ZeroAddress; // Sin resolver
  const isRevocable = true;

  console.log("📝 Registrando esquema...");
  try {
    const tx = await schemaRegistry.register(schema, resolver, isRevocable);
    console.log("🚀 Transacción enviada:", tx.hash);

    // Esperar a que la transacción sea confirmada
    const receipt = await tx.wait();
    console.log("✅ Transacción confirmada en bloque:", receipt);
  } catch (error) {
    console.error("❌ Error al enviar la transacción:", error.message);
  }
}

// Ejecutar el script
main().catch((error) => {
  console.error("❌ Error general en el script:", error);
  process.exitCode = 1;
});
