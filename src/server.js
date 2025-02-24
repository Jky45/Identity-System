const express = require("express");
const apiRoutes = require("./routes/apiRoutes.js");
const { createGanacheProvider } = require("./utils/ganache_provider.js");
const { setup, getAgent } = require("./veramo/agent.js");

const app = express();
const PORT = 3000;

// Middleware JSON
app.use(express.json());

// Variables globales
let provider;
let registry;
let agentReady = null; // Promise para asegurar que `agent` está listo

// Función para inicializar el servidor
const startServer = async () => {
    try {
        console.log("🔄 Inicializando Ganache Provider...");
        ({ provider, registry } = await createGanacheProvider());
        console.log("✅ Ganache Provider listo.");

        console.log("🚀 Inicializando Veramo...");
        agentReady = setup(provider, registry).then(() => getAgent());
        console.log("✅ Veramo configurado correctamente.");

        // Usar rutas unificadas
        app.use("/api", apiRoutes);

        // Iniciar servidor
        app.listen(PORT, () => {
            console.log(`🚀 Servidor Express corriendo en http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("❌ Error al iniciar el servidor:", error);
        process.exit(1);
    }
};

// Función para obtener `agent` asegurando que ya está inicializado
async function getAgentInstance() {
    if (!agentReady) {
        throw new Error("🚨 El servidor aún no ha inicializado Veramo.");
    }
    return await agentReady; // 🔥 Retorna la promesa que contiene `agent`
}

// Ejecutar inicialización del servidor
startServer();

// ✅ Exportación corregida
module.exports = { agentReady, provider, registry };
