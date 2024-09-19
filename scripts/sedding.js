const {ethers}= require("hardhat");
const config=require("../src/config.json");

async function main(){
    const {chainId}= await ethers.provider.getNetwork();
    console.log(`using chainId ${chainId}`);
    const accounts = await ethers.getSigners();
    const StudentRecord = await ethers.getContractAt(
        "CertificateVerifier",
        config[chainId].Contract.address
    );

    console.log(`StudentRecord smart contract is fetchedd at address ${StudentRecord.address}`);

    let transactionResponse;
    const user1 = accounts[0];
    transactionResponse= await StudentRecord.connect(user1).issueCertificate(
        "kareem mushidat ayodele",
        "csc/2018/192",
        "first class",
        "computer Engineering",
    );

    await transactionResponse.wait();
    console.log(`Record with Id ${await StudentRecord.Student()}`)
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
      console.error(error);
      process.exit(1);
  });
