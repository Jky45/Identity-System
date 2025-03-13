const hre = require("hardhat");
const { AbiCoder } = hre.ethers;
const { getEASContract, getSchemaRegistryContract } = require("../utils/contracts.js");

const attest = async (recipient, vcHash) => {
    try {
        const ganacheProvider = new hre.ethers.JsonRpcProvider("http://127.0.0.1:7545");
        const wallet = new hre.ethers.Wallet(
            "0xc86fdc2ae87717a37b9321922100960055afb30d1c5f95dfd4a604c8d70e2a7b",
            ganacheProvider
        );

        console.log(`✅ Usando cuenta para atestación: ${wallet.address}`);

        // Obtener contrato EAS
        console.log("🔍 Obteniendo contrato EAS...");
        const easContract = await getEASContract();

        // Obtener el UID del esquema (Asegúrate de que este esquema existe en EAS)
        const schemaUID = `0xf2d4f367045fd1c6f233827aab4db9591f82413b5bbe530ff48f244fa53cf6c7`;

        // Validar que el esquema existe
        // console.log("🔍 Validando esquema en el contrato...");
        // const schemaRegistryContract = await getSchemaRegistryContract();
        // const schemaRecord = await schemaRegistryContract.getSchema(schemaUID);

        // if (schemaRecord.uid === hre.ethers.ZeroAddress) {
        //     throw new Error("❌ El esquema no existe o no es válido.");
        // }

        // console.log("✅ Esquema válido en el contrato.");

        // Codificar los datos de la atestación
        const abiCoder = new AbiCoder();
        const encodedData = abiCoder.encode(
            ["string"], // Esquema: solo almacenamos el hash de la VC
            [vcHash] // Datos a atestar: Hash de la VC en IPFS
        );

        // Construir el objeto de Atestación
        const attestationRequest = {
            schema: schemaUID,
            data: {
                recipient: recipient, // Dirección del destinatario
                expirationTime: 0, // No expira
                revocable: true, // Es revocable
                refUID: hre.ethers.ZeroHash, // Sin referencia previa
                data: encodedData, // Datos personalizados codificados
                value: 0, // Sin ETH asociado
            },
        };

        console.log("📜 Creando atestación con los siguientes datos:", attestationRequest);

        // Llamar a la función `attest`
        const tx = await easContract.connect(wallet).attest(attestationRequest);
        console.log("🚀 Transacción enviada:", tx.hash);

        // Esperar confirmación
        const receipt = await tx.wait();
        const attestationId = receipt.logs[0].data; // Obtener el UID de la atestación

        console.log("✅ Atestación completada con éxito. Attestation ID:", attestationId);

        return attestationId;

    } catch (error) {
        console.error("❌ Error al crear la atestación:", error.message);
        throw new Error(error.message);
    }
};

module.exports = { attest };



0xD2a40b9263359A524650B3ef9e890a01125C16f4