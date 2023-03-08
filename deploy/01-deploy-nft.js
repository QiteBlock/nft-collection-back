const { localChains, networkConfig } = require("../utils/helper-config")
const { verifyContract } = require("../utils/verifyContract")
const { network, ethers } = require("hardhat")

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    console.log(`Chain Id : ${chainId}`)
    const args = [
        networkConfig[chainId]["_nftURI"],
        networkConfig[chainId]["_publicSalesStartTime"],
        networkConfig[chainId]["_preSalesStartTime"],
        networkConfig[chainId]["_preSalesEndTime"],
        deployer,
    ]

    const beautyNFT = await deploy("MyBeautyNFT", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    console.log(`Contract Deployed Address : ${beautyNFT.address}`)

    if (!localChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verifyContract(beautyNFT.address, args)
    }
}

module.exports.tags = ["all", "MyBeautyNFT"]
