const { createGanacheProvider } = require("../utils/ganache_provider.js");

async function main() {
  console.log("🚀 Iniciando...");
  const { provider, registry } = await createGanacheProvider();
  console.log("✅ Provider de Ganache listo:", provider);
  console.log("✅ Ethereum DID Registry desplegado en:", registry);
}

main().catch((error) => {
  console.error("❌ Error:", error);
});
