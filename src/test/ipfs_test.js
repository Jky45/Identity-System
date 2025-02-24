const { uploadToIPFS, getFromIPFS } = require("../ipfs/ipfs_client.js"); // Ruta correcta

// **Prueba de IPFS**
(async () => {
  try {
    console.log("📝 Iniciando prueba de IPFS...");

    const testData = JSON.stringify({
      nombre: "Juan Pérez",
      email: "juan@example.com",
      mensaje: "Este es un test de IPFS con Node.js",
    });

    console.log("📦 Datos a subir:", testData);

    // **Subir datos a IPFS**
    console.log("🔼 Intentando subir datos a IPFS...");
    const cid = await uploadToIPFS(testData);
    console.log("✅ Datos subidos a IPFS con CID:", cid);

    // **Recuperar datos desde IPFS**
    console.log("🔽 Intentando recuperar datos desde IPFS...");
    const data = await getFromIPFS(cid);

    console.log("✅ Datos recuperados desde IPFS:", data);

  } catch (error) {
    console.error("❌ Error en el test de IPFS:", error.message);
  }
})();
