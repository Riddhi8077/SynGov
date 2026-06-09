import "@nomicfoundation/hardhat-toolbox";

/** @type import('hardhat/config').HardhatUserConfig */
export default {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/-FNobVeOkK7vsoNC1S20M",
      accounts: ["0x430ba6c189c373afcb4e26ee0bf59940b0eccba32fdfac5b46baebc4a5ae84ef"]
    }
  }
};
