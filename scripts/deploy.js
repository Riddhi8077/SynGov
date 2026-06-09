import hre from "hardhat";

async function main() {
  console.log("Deploying SynGovLogger...");
  
  const SynGovLogger = await hre.ethers.getContractFactory("SynGovLogger");
  const logger = await SynGovLogger.deploy();

  await logger.waitForDeployment();

  const address = await logger.getAddress();
  console.log(`SynGovLogger deployed to: ${address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
