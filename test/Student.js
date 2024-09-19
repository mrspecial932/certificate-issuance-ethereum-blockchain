const {expect} = require("chai")
const { ethers } = require("hardhat");

describe("CertificateVerifier", function () {
  let CertificateVerifier;
  let certificateVerifier;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    CertificateVerifier = await ethers.getContractFactory("CertificateVerifier");
    [owner, addr1, addr2] = await ethers.getSigners();
    certificateVerifier = await CertificateVerifier.deploy();
    await certificateVerifier.deployed();
  });

  it("Should issue a certificate with current completion date", async function () {
    await certificateVerifier.connect(owner).issueCertificate(
      "John Doe",
      "123456",
      "A",
      "Engineering"
    );
    const certificate = await certificateVerifier.verifyCertificate(
      await certificateVerifier.generateHash(
        "John Doe",
        "123456",
        "A",
        "Engineering",
        Math.floor(Date.now() / 1000), // Get current timestamp
        owner.address
      )
    );
    expect(certificate.exists).to.be.true;
  });

  it("Should verify a certificate", async function () {
    await certificateVerifier.connect(owner).issueCertificate(
      "Jane Doe",
      "654321",
      "B",
      "Mathematics"
    );
    const certificateHash = await certificateVerifier.generateHash(
      "Jane Doe",
      "654321",
      "B",
      "Mathematics",
      Math.floor(Date.now() / 1000), // Get current timestamp
      owner.address
    );
    const certificate = await certificateVerifier.verifyCertificate(certificateHash);
    expect(certificate.exists).to.be.true;
  });

  it("Should fetch certificate details by matriculation number", async function () {
    await certificateVerifier.connect(owner).issueCertificate(
      "Alice",
      "111111",
      "A",
      "Computer Science"
    );
    const certificate = await certificateVerifier.Student("111111");
    expect(certificate.exists).to.be.true;
  });

  it("Should delete a certificate by matriculation number", async function () {
    await certificateVerifier.connect(owner).issueCertificate(
      "Bob",
      "222222",
      "B",
      "Physics"
    );
    await certificateVerifier.deleteCertificateByMatricNo("222222");
    const certificate = await certificateVerifier.Student("222222");
    expect(certificate.exists).to.be.false;
  });
});
