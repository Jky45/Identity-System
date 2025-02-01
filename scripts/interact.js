const hre = require("hardhat");

async function main() {
  // Dirección del contrato desplegado
  const contractAddress = "0x13B6379Dc5b76a46c991c95D2eBA5417dB8FA3Dd"; // Reemplaza con la dirección de tu contrato desplegado

  // Obtén la fábrica del contrato Lock
  const Lock = await hre.ethers.getContractFactory("Lock");

  // Conecta al contrato desplegado
  const lock = Lock.attach(contractAddress);

  // Define datos de ejemplo
  const did = "did:example:123";
  const metadataHash = "QmExampleHash123";
  const newMetadataHash = "QmUpdatedHash456";

  // Registrar una nueva identidad
  console.log(`Registrando identidad con DID: ${did} y metadataHash: ${metadataHash}...`);
  const txRegister = await lock.registerIdentity(did, metadataHash);
  await txRegister.wait();
  console.log("Identidad registrada.");

  // Consultar la identidad registrada
  console.log(`Obteniendo información de la identidad con DID: ${did}...`);
  const identity = await lock.getIdentity(did);
  console.log("Identidad obtenida:", {
    did: identity[0],
    metadataHash: identity[1],
    verified: identity[2],
  });

  // Actualizar los metadatos de la identidad
  console.log(`Actualizando metadataHash de DID: ${did} a ${newMetadataHash}...`);
  const txUpdate = await lock.updateMetadata(did, newMetadataHash);
  await txUpdate.wait();
  console.log("Metadatos actualizados.");

  // Consultar la identidad actualizada
  console.log(`Obteniendo información de la identidad con DID: ${did} después de la actualización...`);
  const updatedIdentity = await lock.getIdentity(did);
  console.log("Identidad actualizada:", {
    did: updatedIdentity[0],
    metadataHash: updatedIdentity[1],
    verified: updatedIdentity[2],
  });

  // Verificar la identidad (requiere que el remitente sea el administrador)
  console.log(`Verificando identidad con DID: ${did}...`);
  const txVerify = await lock.verifyIdentity(did);
  await txVerify.wait();
  console.log("Identidad verificada.");

  // Consultar la identidad verificada
  console.log(`Obteniendo información de la identidad con DID: ${did} después de la verificación...`);
  const verifiedIdentity = await lock.getIdentity(did);
  console.log("Identidad verificada:", {
    did: verifiedIdentity[0],
    metadataHash: verifiedIdentity[1],
    verified: verifiedIdentity[2],
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});