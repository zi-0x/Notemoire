const main =async ()=>{
    const contractFactory= await ethers.getContractFactory("socivaContract");
    const contract= await contractFactory.deploy();
    await contract.waitForDeployment();
    const address = await contract.getAddress(); // ✅ ethers v6+

  console.log("Contract deployed to:", address);

}

const runMain = async() => {
    try {
      await main();
      process.exit(0);
    } catch(error) {
      console.log(error);
      process.exit(1);
    }
  }
  
  runMain();
