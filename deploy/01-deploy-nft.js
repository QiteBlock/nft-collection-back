module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  const sampleContract = await deploy("Sample", {
    from: deployer,
    log: true,
    args: [],
  });

  console.log(sampleContract.address);
};
