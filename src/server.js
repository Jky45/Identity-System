const express = require("express");
const apiRoutes = require("./routes/apiRoutes.js");
const { createGanacheProvider } = require("./utils/ganache_provider.js");
const { setup, getAgent } = require("./veramo/agent.js");

const app = express();
const PORT = 3000;

// Middleware JSON
app.use(express.json());

// Variables para exportar
let agent;
let provider;
let registry;

// Función para inicializar el servidor
const startServer = async () => {
    try {
        console.log("🔄 Inicializando Ganache Provider...");
        ({ provider, registry } = await createGanacheProvider());
        console.log("✅ Ganache Provider listo.");

        console.log("🚀 Inicializando Veramo...");
        await setup(provider, registry); 
        agent = getAgent();
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

// Ejecutar inicialización del servidor
startServer();

// Exportar variables para uso en servicios
module.exports = { agent, provider, registry };
