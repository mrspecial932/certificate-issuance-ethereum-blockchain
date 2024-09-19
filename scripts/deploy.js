const { ethers } = require('hardhat');
const fs = require('fs');

async function main() {
  // Deploy the CertificateVerifier contract
  const accounts = await ethers.getSigners();
  const CertificateVerifier = await ethers.getContractFactory("CertificateVerifier");
  const contract = await CertificateVerifier.deploy({
    gasLimit: 5000000 // Adjust as needed
  });

  console.log("CertificateVerifier deployed to:", contract.address);
  console.log("Deployed by account:", accounts[0].address);
  // Save contract address to a file for reference
  fs.writeFileSync('./src/deployedAddress.json', JSON.stringify({ address: contract.address }, null, 2));

  // Insert certificates
  const certificates = [
    {
      name: "Aderemi bolanle",
      matricNo: "CSC/2018/121",
      department: "Computer Science and engineering",
      grade: "First Class"
    },
    {
      name: "Usamot Adenike",
      matricNo: "CSC/2018/123",
      department: "Computer science and engineering",
      grade: "Second Class Upper"
    },
    {
      name: "Ogunlowo balikis",
      matricNo: "CSC/2018/182",
      department: "Computer Engineering",
      grade: "Second Class Lower"
    }
  ];

  // Attach to the deployed contract
  const certificateVerifier = await CertificateVerifier.attach(contract.address);

  // Check if the function exists
  if (!certificateVerifier.issueCertificate) {
    throw new Error("issueCertificate function is not found on the contract instance");
  }

  // Insert the certificates
  for (const cert of certificates) {
    console.log(`Adding certificate for ${cert.name}`);
    try {
      const tx = await certificateVerifier.issueCertificate(
        cert.name,
        cert.matricNo,
        cert.department,
        cert.grade
      );
      await tx.wait();
      console.log(`Certificate for ${cert.name} added successfully!`);
    } catch (error) {
      console.error(`Failed to add certificate for ${cert.name}:`, error);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error in deploying and interacting with the contract:", error);
    process.exit(1);
  });
