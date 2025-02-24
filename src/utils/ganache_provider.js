const { ethers } = require("ethers");
const { EthereumDIDRegistry } = require("ethr-did-resolver");

// Configurar el proveedor de Ganache manualmente
const GANACHE_RPC_URL = "http://127.0.0.1:7545";

async function createGanacheProvider() {
  console.log("🔗 Conectando a Ganache...");

  // Conectar al nodo de Ganache
  const provider = new ethers.JsonRpcProvider(GANACHE_RPC_URL);

  // Obtener las cuentas de Ganache
  const accounts = await provider.send("eth_accounts", []);
  if (accounts.length === 0) {
    throw new Error("❌ No hay cuentas disponibles en Ganache. Asegúrate de que la red está corriendo.");
  }

  console.log("✅ Cuentas disponibles en Ganache:", accounts);

  // Usar la primera cuenta como deployer
  const deployer = new ethers.Wallet("0xc86fdc2ae87717a37b9321922100960055afb30d1c5f95dfd4a604c8d70e2a7b", provider);

  console.log("📜 Desplegando contrato desde la cuenta:", deployer.address);

  // Crear y desplegar el contrato EthereumDIDRegistry desde `ethr-did-resolver`
  const DIDRegistryFactory = new ethers.ContractFactory(
    EthereumDIDRegistry.abi,  // ABI desde `ethr-did-resolver`
    EthereumDIDRegistry.bytecode, // Bytecode del contrato
    deployer
  );

  console.log("⌛ Desplegando Ethereum DID Registry...");
  const didRegistry = await DIDRegistryFactory.deploy();
  await didRegistry.waitForDeployment();

  const registryAddress = await didRegistry.getAddress();
  console.log("✅ Ethereum DID Registry desplegado en:", registryAddress);

  // Retornar el provider y la dirección del contrato
  return { provider, registry: registryAddress };
}

module.exports = { createGanacheProvider };
