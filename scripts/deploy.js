const hre = require("hardhat");

async function main() {
  // Define el tiempo de desbloqueo (ejemplo: 1 minuto en el futuro)
  const currentTimestampInSeconds = Math.floor(Date.now() / 1000);
  const unlockTime = currentTimestampInSeconds + 60;

  console.log("Desplegando Lock con unlockTime:", unlockTime);

  // Obtén la fábrica del contrato Lock
  const Lock = await hre.ethers.getContractFactory("Lock");

  // Despliega el contrato con unlockTime y envía 1 ETH
  const lock = await Lock.deploy();

  await lock.deploy;

  console.log("Contrato Lock desplegado en:", lock.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

