// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers, upgrades } from "hardhat";

async function main() {
  const [owner] = await ethers.getSigners();
  console.log("Deploying contracts with the account: ", owner.address);

  console.log("Account balance: ", (await owner.getBalance()).toString());

  
  const nftFactory = await ethers.getContractFactory("MetaMartianNFT");
  const nftContract = await nftFactory.deploy( )

  await nftContract.deployed()
  console.log("nftContract = ", nftContract.address)

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


/*
=== Polygon / Mumbai Testnet
MetaMartianNFT: 0x2afc08b10628cD4d51523d5A50E63311C9cbB7B7
*/