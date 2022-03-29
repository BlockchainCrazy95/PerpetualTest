import chai from "chai"
import chaiAsPromised from "chai-as-promised"
import { solidity } from 'ethereum-waffle'
import { expect } from "chai"
import hre, { ethers } from "hardhat"

import { AMMExchange } from "../build/typechain/AMMExchange"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { LeverageAMMExchange } from "../build/typechain"

chai.use(solidity)
chai.use(chaiAsPromised)

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

describe ("Token Contract", () => {
  let ammFactory
  let ammContract : AMMExchange
  let leverageAmmFactory
  let leverageAmmContract: LeverageAMMExchange
  let owner: SignerWithAddress;
  let accountList: SignerWithAddress[];

  before(async () => {
    [owner, ...accountList] = await hre.ethers.getSigners();
    
    // Contract Deployment
    ammFactory = await ethers.getContractFactory("AMMExchange");
    ammContract = await ammFactory.deploy(
      ethers.utils.parseEther("10000"),
      ethers.utils.parseEther("1000")
    ) as AMMExchange
    await ammContract.deployed()

    console.log("AMMExchange:", ammContract.address)

    leverageAmmFactory = await ethers.getContractFactory("LeverageAMMExchange");
    leverageAmmContract = await leverageAmmFactory.deploy(
      ethers.utils.parseEther("10000"),
      ethers.utils.parseEther("1000")
    ) as LeverageAMMExchange
    await leverageAmmContract.deployed()

    console.log("LeverageAMMExchange:", leverageAmmContract.address)
  })

  describe("AMMExchange", async() => {
    it("First exchange", async() => {
      /*
      Rt = 10000, Ru = 1000
      x=6000, y = 375
      Rt`=16000, Ru`=625
      */
      const res = await ammContract.calcExchange(ethers.utils.parseEther("6000"));
      await ammContract.exchange(ethers.utils.parseEther("6000"));
      expect(res).to.eq(ethers.utils.parseEther("375"))
      expect(await ammContract.getRt()).to.eq(ethers.utils.parseEther("16000"));
      expect(await ammContract.getRu()).to.eq(ethers.utils.parseEther("625"));
    })
    it("Second exchange", async() => {
      /*
      Rt = 16000, Ru = 625
      x=4000, y = 125
      Rt`=20000, Ru`=500
      */
      const res = await ammContract.calcExchange(ethers.utils.parseEther("4000"));
      await ammContract.exchange(ethers.utils.parseEther("4000"));
      expect(res).to.eq(ethers.utils.parseEther("125"))
      expect(await ammContract.getRt()).to.eq(ethers.utils.parseEther("20000"));
      expect(await ammContract.getRu()).to.eq(ethers.utils.parseEther("500"));
    })
  })

  describe("Leveraged AMMExchange", async() => {
    it("deposit 50 and open 8 positions", async () => {
      await leverageAmmContract.connect(accountList[0]).deposit(ethers.utils.parseEther("50"));
      await leverageAmmContract.connect(accountList[0]).openPosition(8);
      expect(await leverageAmmContract.getRemainedAmount(accountList[0].address)).to.eq(ethers.utils.parseEther("100"));
    })
    it("open 2 more positions", async () => {
      await leverageAmmContract.connect(accountList[0]).openPosition(2);
      expect(await leverageAmmContract.getRemainedAmount(accountList[0].address)).to.eq(ethers.utils.parseEther("0"));
    })
    it("Cannot buy anymore", async() => {
      await expect(leverageAmmContract.connect(accountList[0]).openPosition(1)).to.revertedWith("Insufficient");
    })
  })
})