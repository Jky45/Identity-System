const hre = require("hardhat");
const { AbiCoder } = hre.ethers; // Importar AbiCoder desde ethers
const { getEASContract, getSchemaRegistryContract } = require("./contracts");

async function main() {
  const easContract = await getEASContract(); // Obtén el contrato EAS

  // UID del esquema como bytes32 (los primeros 64 caracteres del UID devuelto al registrar el esquema)
  

  // Dirección del destinatario
  const recipient = "0x103b83c775F4698722E906feDb23D7d757Aba270";

  // Crear un objeto AbiCoder para codificar los datos personalizados
  const abiCoder = new AbiCoder();
  const encodedData = abiCoder.encode(
    ["string", "string", "bool"], // Estructura del esquema
    ["did:example:123456789","UH", true] // Datos de la atestación
  );
  
  const schemaUID = `0x3886a3423426bd173ac652cc1d44e8438fbc226fb7facb6164c90b2ec69333ca`;
  const schemaRegistryContract = await getSchemaRegistryContract();
  const schemaRecord = await schemaRegistryContract.getSchema(schemaUID);

  if (schemaRecord.uid === hre.ethers.ZeroAddress) {
    throw new Error("El esquema no existe o no es válido");
  }
  // Construir el objeto AttestationRequest
  const attestationRequest = {
    schema: schemaUID,
    data: {
      recipient: recipient, // Dirección del destinatario
      expirationTime: 0, // 0 significa que no expira
      revocable: true, // Es revocable
      refUID: hre.ethers.ZeroHash, // Sin referencia previa
      data: encodedData, // Datos personalizados codificados
      value: 0, // Sin ETH asociado
    },
  };

  console.log("Creando atestación...");
  console.log("Datos de la solicitud:", attestationRequest);

  // Llamar a la función attest
  const tx = await easContract.attest(attestationRequest);
  console.log("Transacción enviada:", tx.hash);

  // Esperar confirmación
  const receipt = await tx.wait();
  console.log(
    "Atestación completada con éxito. UID de la atestación:",
    receipt.logs[0].data
  );
}

main().catch((error) => {
  console.error("Error al crear la atestación:", error.message);
  process.exitCode = 1;
});
