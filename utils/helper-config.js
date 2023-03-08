const networkConfig = {
    5: {
        name: "goerli",
        _nftURI: "",
        _publicSalesStartTime: "1778207377",
        _preSalesStartTime: "1778207377",
        _preSalesEndTime: "1878207377",
    },
    31337: {
        name: "hardhat",
        _nftURI: "http://local/",
        _publicSalesStartTime: "1778207377",
        _preSalesStartTime: "1778207377",
        _preSalesEndTime: "1878207377",
    },
}

const localChains = ["hardhat", "localhost"]

module.exports = {
    networkConfig,
    localChains,
}
