
async function testVeramo() {
  console.log("🔄 Inicializando Veramo...");

  // 🔥 Importación dinámica en lugar de `import` estático
  const { setup, getAgent } = await import("../veramo/agent.js");

  await setup();
  console.log("✅ Agente Veramo inicializado.");

  const agent = getAgent();

  const userAddress = "0x103b83c775F4698722E906feDb23D7d757Aba270";

  try {
    // 🔨 Crear un DID basado en la dirección de Ethereum
    console.log(`🔨 Creando un DID con la dirección: ${userAddress} ...`);
    const identifier = await agent.didManagerCreate({
      userAddress,
      provider: "did:ethr:ganache",
      kms: "local", // 🔥 Usa Web3 para firmar en blockchain
      options: { address: userAddress },
    });

    console.log("✅ DID Creado:", identifier.did);

    // 🔍 Resolver el DID creado
    console.log(`🔍 Resolviendo el DID: ${identifier.did} ...`);
    const resolvedDID = await agent.resolveDid({ didUrl: identifier.did });

    console.log("✅ DID Resuelto:", resolvedDID);

    const metadata = {
      nombre: "Juan Perez",
      email: "juan@example.com",
      universidad: "MIT",
    };

    console.log(`📝 Creando Credencial Verificable (VC) para: ${identifier.did}`);

    const verifiableCredential = await agent.createVerifiableCredential({
      credential: {
        issuer: { id: identifier.did },
        credentialSubject: {
          id: identifier.did,
          ...metadata,
        },
        issuanceDate: new Date().toISOString(),
      },
      proofFormat: "jwt", // 🔥 Se genera en formato JWT
    });
    console.log("✅ Credencial Verificable Creada:", verifiableCredential);

  } catch (error) {
    console.error("❌ Error al probar Veramo:", error);
  }
}

// Ejecutar la función principal
testVeramo().catch((error) => {
  console.error("❌ Error general en la prueba de Veramo:", error);
  process.exit(1);
});





// async function testCreateCredential() {
//   const agent = getAgent();

//   const did = "did:ethr:ganache:0x023a8d8261f9c720d52692d54675e259b198e97f582906725d01448811f8d19e95";
//   const metadata = {
//     nombre: "Juan Perez",
//     email: "juan@example.com",
//     universidad: "MIT",
//   };

//   try {
//     console.log(`📝 Creando Credencial Verificable (VC) para: ${did}`);

//     const verifiableCredential = await agent.createVerifiableCredential({
//       credential: {
//         issuer: { id: did },
//         credentialSubject: {
//           id: did,
//           ...metadata,
//         },
//         issuanceDate: new Date().toISOString(),
//       },
//       proofFormat: "jwt", // 🔥 Se genera en formato JWT
//     });

//     console.log("✅ Credencial Verificable Creada:", verifiableCredential);
//   } catch (error) {
//     console.error("❌ Error al crear la credencial:", error);
//   }
// }

// // Ejecutar la prueba
// testCreateCredential();
