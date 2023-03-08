const { expect } = require("chai")
const { network, deployments, ethers } = require("hardhat")
const { localChains } = require("../utils/helper-config")
const { moveToTime, getLatestBlockTimestamp } = require("../utils/time")

!localChains.includes(network.name)
    ? describe.skip
    : describe("Test MyBeauty NFT Contract", function () {
          let deployer, myBeautyContract, randomBuyer

          beforeEach(async function () {
              // What we need ?
              // We need the contract address, the abi and the deplouer
              ;[deployer, randomBuyer] = await ethers.getSigners()
              await deployments.fixture(["MyBeautyNFT"])
              myBeautyContract = await ethers.getContract("MyBeautyNFT", deployer)
          })

          describe("Constructor test", function () {
              it("Check if all the variable are defined correctly", async function () {
                  const publicSalesStartTime = await myBeautyContract.publicSalesStartTime()
                  const preSalesStartTime = await myBeautyContract.preSalesStartTime()
                  const preSalesEndTime = await myBeautyContract.preSalesEndTime()
                  const nftURI = await myBeautyContract.nftURI()
                  const claimFundAddress = await myBeautyContract.claimFundAddress()
                  expect(nftURI).to.be.equal("http://local/")
                  expect(publicSalesStartTime).to.be.equal("1778207377")
                  expect(preSalesStartTime).to.be.equal("1778207377")
                  expect(preSalesEndTime).to.be.equal("1878207377")
                  expect(claimFundAddress).to.be.equal(deployer.address)
              })
          })

          describe("NFT presale test", function () {
              it("Should failed when calling the function presale because Presales not started", async function () {
                  await expect(myBeautyContract.connect(randomBuyer).presale(1)).to.be.revertedWith(
                      "Presales not started"
                  )
              })

              it("Should failed when calling the function presale because You are not on the Allowlist", async function () {
                  await moveToTime(1788207377)
                  await getLatestBlockTimestamp()
                  await expect(myBeautyContract.connect(randomBuyer).presale(1)).to.be.revertedWith(
                      "You are not on the Allowlist"
                  )
              })

              it("Should failed when calling the function addToPresaleList because not owner", async function () {
                  await expect(
                      myBeautyContract.connect(randomBuyer).addToPresaleList([randomBuyer.address])
                  ).to.be.revertedWith("Ownable: caller is not the owner")
              })

              it("Should failed when calling the function presale because Purchase exceeds max allowed", async function () {
                  await moveToTime(1788207377)
                  await getLatestBlockTimestamp()
                  await myBeautyContract.connect(deployer).addToPresaleList([randomBuyer.address])
                  await expect(myBeautyContract.connect(randomBuyer).presale(3)).to.be.revertedWith(
                      "Purchase exceeds max allowed"
                  )
              })

              it("Should failed when calling the function presale because You don't send enough eth to purchase the beauties", async function () {
                  await moveToTime(1788207377)
                  await getLatestBlockTimestamp()
                  await myBeautyContract.connect(deployer).addToPresaleList([randomBuyer.address])
                  await expect(myBeautyContract.connect(randomBuyer).presale(1)).to.be.revertedWith(
                      "You don't send enough eth to purchase the beauties"
                  )
              })

              it("Should failed when calling the function presale because You don't send enough eth to purchase the beauties", async function () {
                  await moveToTime(1788207377)
                  await getLatestBlockTimestamp()
                  await myBeautyContract.connect(deployer).addToPresaleList([randomBuyer.address])
                  await expect(myBeautyContract.connect(randomBuyer).presale(1)).to.be.revertedWith(
                      "You don't send enough eth to purchase the beauties"
                  )
              })

              it("Should mint 1 nft, emit Presale event and presaleListClaimed for this account should be updated to 1", async function () {
                  await moveToTime(1788207377)
                  await getLatestBlockTimestamp()
                  await myBeautyContract.connect(deployer).addToPresaleList([randomBuyer.address])
                  const tx = await myBeautyContract
                      .connect(randomBuyer)
                      .presale(1, { value: ethers.utils.parseUnits("0.01", "ether") })
                  // Check that the event was emitted
                  await expect(tx).to.emit(myBeautyContract, "Presale").withArgs(1, randomBuyer.address)
                  const balanceOfToken = await myBeautyContract.balanceOf(randomBuyer.address)
                  const numberClaimed = await myBeautyContract.presaleListClaimed(randomBuyer.address)
                  expect(balanceOfToken.toString()).to.be.equal("1")
                  expect(numberClaimed.toString()).to.be.equal("1")
              })
          })

          describe("NFT mint test", function () {
              it("Should failed when calling the function mint because Public sales not started", async function () {
                  await expect(myBeautyContract.connect(randomBuyer).mint(1)).to.be.revertedWith(
                      "Public sales not started"
                  )
              })

              it("Should failed when calling the function mint because exceed the max amount that you can purchase in one transaction", async function () {
                  await moveToTime(1788207377)
                  await expect(myBeautyContract.connect(randomBuyer).mint(60)).to.be.revertedWith(
                      "You are not allowed to buy this many beauty at once."
                  )
              })

              it("Should failed when calling the function mint because You don't send enough eth to purchase the beauties", async function () {
                  await moveToTime(1788207377)
                  await expect(myBeautyContract.connect(randomBuyer).mint(1)).to.be.revertedWith(
                      "You don't send enough eth to purchase the beauties"
                  )
              })

              it("Should failed when calling the function mint because exceed the max amount that you can purchase in one transaction", async function () {
                  await moveToTime(1788207377)
                  await myBeautyContract
                      .connect(randomBuyer)
                      .mint(50, { value: ethers.utils.parseUnits("0.5", "ether") })
                  await myBeautyContract
                      .connect(randomBuyer)
                      .mint(50, { value: ethers.utils.parseUnits("0.5", "ether") })
                  await expect(
                      myBeautyContract.connect(randomBuyer).mint(1, { value: ethers.utils.parseUnits("0.01", "ether") })
                  ).to.be.revertedWith("Exceeds maximum beauty supply")
              })

              it("Should mint 1 nft and emit Mint event for this account should be updated to 1", async function () {
                  await moveToTime(1788207377)
                  const tx = await myBeautyContract
                      .connect(randomBuyer)
                      .mint(1, { value: ethers.utils.parseUnits("0.01", "ether") })
                  // Check that the event was emitted
                  await expect(tx).to.emit(myBeautyContract, "Mint").withArgs(1, randomBuyer.address)
                  const balanceOfToken = await myBeautyContract.balanceOf(randomBuyer.address)
                  expect(balanceOfToken.toString()).to.be.equal("1")
              })
          })

          describe("Withdraw funds test", function () {
              it("Should failed because not owner", async function () {
                  await expect(myBeautyContract.connect(randomBuyer).withdraw()).to.be.revertedWith(
                      "Ownable: caller is not the owner"
                  )
              })

              it("Should withdraw all funds in the contract", async function () {
                  const balanceBefore = await ethers.provider.getBalance(deployer.address)
                  console.log(balanceBefore.toString())
                  await moveToTime(1788207377)
                  await myBeautyContract
                      .connect(randomBuyer)
                      .mint(1, { value: ethers.utils.parseUnits("0.01", "ether") })
                  const tx = await myBeautyContract.connect(deployer).withdraw()
                  await tx.wait()
                  const balanceAfter = await ethers.provider.getBalance(deployer.address)
                  console.log(balanceAfter.toString())
                  expect(balanceAfter.sub(balanceBefore)).to.be.lt(ethers.utils.parseUnits("0.01", "ether"))
                  expect(ethers.utils.parseUnits("0", "ether")).to.be.lt(balanceAfter.sub(balanceBefore))
              })
          })

          describe("Test all setters", function () {
              it("MyBeautyNFT presale list setters", async function () {
                  await myBeautyContract.connect(deployer).addToPresaleList([randomBuyer.address])
                  await myBeautyContract.connect(deployer).removeFromPresaleList([randomBuyer.address])
                  expect(await myBeautyContract.onPresaleList(randomBuyer.address)).to.be.false
              })

              it("SalesActivation setters", async function () {
                  await myBeautyContract.connect(deployer).setPublicSalesTime(1788207377)
                  await myBeautyContract.connect(deployer).setPreSalesTime(1788207377, 1788207378)
                  expect(await myBeautyContract.publicSalesStartTime()).to.be.equal(1788207377)
                  expect(await myBeautyContract.preSalesStartTime()).to.be.equal(1788207377)
                  expect(await myBeautyContract.preSalesEndTime()).to.be.equal(1788207378)
              })
          })
      })
