let agent;

async function setup(provider, registry) {
  // Importaciones dinámicas
  const { createAgent } = await import("@veramo/core");
  const { CredentialPlugin } = await import("@veramo/credential-w3c");
  const { DIDManager } = await import("@veramo/did-manager");
  const { DIDResolverPlugin } = await import("@veramo/did-resolver");
  const { getResolver } = await import("ethr-did-resolver");
  const { EthrDIDProvider } = await import("@veramo/did-provider-ethr");
  const { getDidKeyResolver } = await import("@veramo/did-provider-key");
  const { KeyManager } = await import("@veramo/key-manager");
  const { KeyManagementSystem, SecretBox } = await import("@veramo/kms-local");
  const { Web3KeyManagementSystem } = await import("@veramo/kms-web3");
  const { DataSource } = await import("typeorm");

  // 🔥 Importaciones adicionales desde @veramo/data-store
  const {
    DataStore,
    DataStoreORM,
    KeyStore,
    PrivateKeyStore,
    DIDStore,
    Entities,
    migrations,
    DataStoreDiscoveryProvider,
  } = await import("@veramo/data-store");

  const databaseFile = "./database.sqlite";

  const dbConnection = new DataSource({
    name: "database",
    type: "sqlite",
    database: databaseFile,
    synchronize: false,
    migrations: migrations,
    migrationsRun: true,
    logging: false,
    entities: Entities,
  }).initialize();

  // 🔥 Solo Usamos Web3 para manejar claves ya existentes
  const dbEncryptionKey =
  "2f4e65c53b6f8a57e88dba1dab6569ab608b8c3493e62ca213da5b4588374e02";

  // 🔥 Crear un KeyManager que solo usa Web3 (sin generación de claves)
  const keyManager = new KeyManager({
    store: new KeyStore(dbConnection),
    kms: {
      local: new KeyManagementSystem(new PrivateKeyStore(dbConnection, new SecretBox(dbEncryptionKey))),
      web3: new Web3KeyManagementSystem({}),
    },
  });

  

  // Crear DIDManager con Web3
  const didManager = new DIDManager({
    store: new DIDStore(dbConnection),
    defaultProvider: "did:ethr:ganache",
    providers: {
      "did:ethr:ganache": new EthrDIDProvider({
        defaultKms: "local",
        networks: [
          {
            chainId: 1337,
            name: "ganache",
            provider: provider,
            registry,
          },
        ],
      }),
    },
  });

  // Crear el agente Veramo
  agent = createAgent({
    plugins: [
      keyManager,
      didManager,
      new DIDResolverPlugin({
        ...getResolver({
          networks: [
            {
              name: "ganache",
              chainId: 1337,
              provider: provider,
              registry,
            },
          ],
        }),
        ...getDidKeyResolver(),
      }),
      new CredentialPlugin(),
    ],
  });

  console.log(
    "✅ Agente Veramo inicializado solo con Web3 (sin creación de claves)."
  );
}

// Función para obtener el agente
const getAgent = () => agent;

module.exports = { setup, getAgent };
