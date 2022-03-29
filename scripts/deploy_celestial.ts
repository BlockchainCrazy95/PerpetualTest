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

  
  const celestialFactory = await ethers.getContractFactory("CelestialNFT");
  const celestialContract = await celestialFactory.deploy(
    "Celestial Martian NFT",
    "CMN",
    "https://mmac-meta-martian.communitynftproject.io/",
    "0x2afc08b10628cD4d51523d5A50E63311C9cbB7B7"
  )

  await celestialContract.deployed()
  console.log("nftContract = ", celestialContract.address)

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


/*
=== Polygon / Mumbai Testnet
MetaMartianNFT: 0x2afc08b10628cD4d51523d5A50E63311C9cbB7B7
CelestialNFT: 0x841cC9051D716FEeEC511EEdE9F348da1E3A6ED4

=== Polygon Mainnet
MetaMartianNFT: 0xdd2b34e738042413028a82de14b47bf887ff2d29
CelestialNFT: 
*/