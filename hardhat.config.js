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
        "0x5408ab174fa99fb23fd00b672b34108190c6ce607c2b4911942bd41cfe14e3e9",
        "0x5758b0634e4a242701a58bb35ec5f9e6717de8837680e35def5ab955fb85f426",
      ],
    },}
    
};
