import hre, { ethers } from "hardhat";

async function main() {
    const accList = [
        {
            address: '0xaEC25A9e0D64b3CafEb256C2942d00013ad6437c',
            amount: 2
        },{
            address: '0xf235710D1A70272a274DA1c3146F16302219C6d3',
            amount: 6
        },{
            address: '0x3E5Cc534379e3887f42BB4B58d138DAC49d85324',
            amount: 5
        },{
            address: '0x484020c219a945aCb104184b026D58651dbF833a',
            amount: 3
        },{
            address: '0x57755Cc5A51dA9A70fe87A8a1e13f5d93082b529',
            amount: 4
        }
    ]
    const martianContract = await ethers.getContractAt("MetaMartianNFT", "0x2afc08b10628cD4d51523d5A50E63311C9cbB7B7");
    const res = await martianContract.functions.totalSupply()
    let totalSupply = parseInt(`${res}`)
    console.log("TotalSupply = ", totalSupply)
    for(var j = 0;j<accList.length;j++){
        const acc = accList[j];
        const mintFunc = async(account:any) => {
            console.log("=======")
            for(var i = 0;i<account.amount;i++){
                console.log(account.address, " tokenId: ", totalSupply)
                await martianContract.functions.mint(account.address, totalSupply);
                totalSupply++;
            }
            console.log(account.address, " amount: ", account.amount)
        }
        await mintFunc(acc)
    }
}

main().catch(error => {
    console.error(error);
    process.exitCode = 1;
});