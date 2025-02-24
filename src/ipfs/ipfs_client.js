async function getIpfsClient() {
    const { create } = await import("ipfs-http-client");
    return create({ url: "http://127.0.0.1:5001" });
  }
  
  async function uploadToIPFS(data) {
    try {
      const ipfs = await getIpfsClient();
      const { cid } = await ipfs.add(data);
      return cid.toString();
    } catch (error) {
      console.error("Error subiendo a IPFS:", error);
      throw new Error("No se pudo subir a IPFS");
    }
  }
  
  async function getFromIPFS(cid) {
    try {
        const ipfs = await getIpfsClient();
        const stream = ipfs.cat(cid);
        let dataChunks = [];

        for await (const chunk of stream) {
            dataChunks.push(chunk);
        }

        const rawData = Buffer.concat(dataChunks).toString("utf-8");

        try {
            return JSON.parse(rawData);
        } catch {
            return rawData;
        }
    } catch (error) {
        throw new Error("No se pudo recuperar el archivo de IPFS");
    }
}

  
  module.exports = { uploadToIPFS, getFromIPFS };
  