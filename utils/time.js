const { network, ethers } = require("hardhat")

const moveToTime = async (futureTimestampInSeconds) => {
    console.log("Moving in time ...")
    await network.provider.send("evm_setNextBlockTimestamp", [futureTimestampInSeconds])
    await network.provider.send("evm_mine")
    console.log("We are in the future ...")
}

const getLatestBlockTimestamp = async () => {
    const latestBlock = await ethers.provider.getBlock("latest")
    const timestamp = latestBlock.timestamp
    console.log(`The latest block was mined at timestamp: ${timestamp}`)
}

module.exports = {
    moveToTime,
    getLatestBlockTimestamp,
}
