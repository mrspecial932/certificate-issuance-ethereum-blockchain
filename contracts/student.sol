// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

contract CertificateVerifier {
    address public owner;

    struct Certificate {
        bytes32 hash;
        string name;
        string matricNo;
        string grade;
        string department;
        uint256 completionDate;
        address issuer;
        bool exists;
    }

    mapping(bytes32 => Certificate) public certificates;
    mapping(string => bytes32) private certificateByMatricNo;
    bytes32[] public certificateHashes; // Array to store all certificate hashes

    event CertificateIssued(
        bytes32 indexed hash,
        string name,
        string matricNo,
        string grade,
        string department,
        uint256 completionDate,
        address issuer,
        bool exists
    );

    event CertificateDeleted(
        string matricNo,
        bytes32 indexed hash,
        address issuer
    );

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    function issueCertificate(
        string memory _name,
        string memory _matricNo,
        string memory _grade,
        string memory _department
    ) public onlyOwner {
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(bytes(_matricNo).length > 0, "Matric No cannot be empty");

        uint256 completionDate = block.timestamp;

        bytes32 certHash = generateHash(
            _name,
            _matricNo,
            _grade,
            _department,
            completionDate,
            msg.sender
        );

        certificates[certHash] = Certificate(
            certHash, // Store the generated hash in the struct
            _name,
            _matricNo,
            _grade,
            _department,
            completionDate,
            msg.sender,
            true
        );

        certificateByMatricNo[_matricNo] = certHash;
        certificateHashes.push(certHash); // Add hash to array

        emit CertificateIssued(
            certHash,
            _name,
            _matricNo,
            _grade,
            _department,
            completionDate,
            msg.sender,
            true
        );
    }

    function generateHash(
        string memory _name,
        string memory _matricNo,
        string memory _grade,
        string memory _department,
        uint256 _completionDate,
        address _issuer
    ) internal pure returns (bytes32) {
        return
            keccak256(
                abi.encode(
                    _name,
                    _matricNo,
                    _grade,
                    _department,
                    _completionDate,
                    _issuer
                )
            );
    }

    function verifyCertificate(
        bytes32 _hash
    )
        public
        view
        returns (
            bytes32,
            string memory,
            string memory,
            string memory,
            string memory,
            uint256,
            address,
            bool
        )
    {
        Certificate memory cert = certificates[_hash];
        require(cert.exists, "Certificate does not exist");

        return (
            cert.hash,
            cert.name,
            cert.matricNo,
            cert.grade,
            cert.department,
            cert.completionDate,
            cert.issuer,
            cert.exists
        );
    }

    function getCertificateByMatricNo(
        string memory _matricNo
    )
        public
        view
        returns (
            bytes32,
            string memory,
            string memory,
            string memory,
            uint256,
            address,
            bool
        )
    {
        bytes32 certHash = certificateByMatricNo[_matricNo];
        Certificate memory cert = certificates[certHash];
        require(cert.exists, "Certificate does not exist");

        return (
            cert.hash,
            cert.name,
            cert.grade,
            cert.department,
            cert.completionDate,
            cert.issuer,
            cert.exists
        );
    }

    function deleteCertificateByMatricNo(
        string memory _matricNo
    ) public onlyOwner {
        bytes32 certHash = certificateByMatricNo[_matricNo];
        require(
            certHash != bytes32(0),
            "Certificate does not exist for the provided matricNo"
        );

        delete certificates[certHash];
        delete certificateByMatricNo[_matricNo];

        // Remove certHash from the certificateHashes array
        for (uint256 i = 0; i < certificateHashes.length; i++) {
            if (certificateHashes[i] == certHash) {
                certificateHashes[i] = certificateHashes[certificateHashes.length - 1];
                certificateHashes.pop();
                break;
            }
        }

        emit CertificateDeleted(_matricNo, certHash, msg.sender);
    }

    function getAllCertificates()
        public
        view
        returns (
            bytes32[] memory hashes, 
            string[] memory names,
            string[] memory matricNos,
            string[] memory grades,
            string[] memory departments,
            uint256[] memory completionDates,
            address[] memory issuers,
            bool[] memory exists
        )
    {
        uint256 count = certificateHashes.length;
        hashes = new bytes32[](count);
        names = new string[](count);
        matricNos = new string[](count);
        grades = new string[](count);
        departments = new string[](count);
        completionDates = new uint256[](count);
        issuers = new address[](count);
        exists = new bool[](count);

        for (uint256 i = 0; i < count; i++) {
            Certificate memory cert = certificates[certificateHashes[i]];
            hashes[i] = cert.hash;
            names[i] = cert.name;
            matricNos[i] = cert.matricNo;
            grades[i] = cert.grade;
            departments[i] = cert.department;
            completionDates[i] = cert.completionDate;
            issuers[i] = cert.issuer;
            exists[i] = cert.exists;
        }
    }
}
