const hre = require("hardhat");

async function main() {
  const NoteRegistry = await hre.ethers.getContractFactory("NoteRegistry");
  const contract = await NoteRegistry.deploy();
  await contract.waitForDeployment();

  console.log("✅ Deployed to:", await contract.getAddress());
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
