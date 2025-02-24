require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ethers");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    ganache: {
      url: "http://127.0.0.1:7545", // Dirección RPC de Ganache
      accounts: [
        // Llaves privadas de las cuentas de Ganache
        "0xc86fdc2ae87717a37b9321922100960055afb30d1c5f95dfd4a604c8d70e2a7b",
        "0xfc3dcf8c0423cbc4729211561b5568f0a3d5f7e7d1f7c3b77a884eeee85aed03",
      ],
    },}
    
};
