const hre = require("hardhat");

async function main() {
    console.log("🚀 Desplegando IdentityRegistry...");

    // Obtener la fábrica del contrato
    const IdentityRegistry = await hre.ethers.getContractFactory("IdentityRegistry");

    // Desplegar el contrato
    const identityRegistry = await IdentityRegistry.deploy();
    await identityRegistry.waitForDeployment();

    console.log(`✅ IdentityRegistry desplegado en: ${identityRegistry.address}`);
}

// Manejo de errores
main().catch((error) => {
    console.error("❌ Error al desplegar:", error);
    process.exitCode = 1;
});



