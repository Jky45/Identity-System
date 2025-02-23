import { create } from "ipfs-http-client";

// Configuración del cliente IPFS para nodo local
const ipfs = create({ url: "http://localhost:5001/api/v0" });

/**
 * Sube un archivo o datos a IPFS (para nodo local)
 * @param {Buffer | string} data - Datos a almacenar (puede ser un string o un buffer)
 * @returns {Promise<string>} - Devuelve el CID (hash) del archivo en IPFS
 */
export const uploadToIPFS = async (data) => {
  try {
    const { cid } = await ipfs.add(data);
    return cid.toString();
  } catch (error) {
    console.error("Error subiendo a IPFS:", error);
    throw new Error("No se pudo subir a IPFS");
  }
};

/**
 * Recupera datos desde IPFS usando su CID (para nodo local)
 * @param {string} cid - Hash del archivo en IPFS
 * @returns {Promise<string>} - Devuelve los datos almacenados en IPFS
 */
export const getFromIPFS = async (cid) => {
  try {
    const stream = ipfs.cat(cid);
    let data = "";
    for await (const chunk of stream) {
      data += chunk.toString();
    }
    return data;
  } catch (error) {
    console.error("Error obteniendo de IPFS:", error);
    throw new Error("No se pudo recuperar el archivo de IPFS");
  }
};
