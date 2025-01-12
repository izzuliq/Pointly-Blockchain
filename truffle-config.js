module.exports = {
  networks: {
    development: {
      host: "127.0.0.1", // Localhost
      port: 8545, // Ganache default port
      network_id: "*", // Match any network id
      gas: 6721975, // Increase if needed
      gasPrice: 20000000000,
    },
  },
  compilers: {
    solc: {
      version: "0.8.0", // Specify Solidity compiler version
    },
  },
};
