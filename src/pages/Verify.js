import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import jsQR from 'jsqr';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf'; // Import jsPDF
import { ethers } from 'ethers';
import CertificateVerifier from '../abi/CertificateVerifier.json'; // Adjust path as needed
import config from '../deployedAddress.json'; // Adjust path as needed
import QRCode from 'qrcode.react';

export default function Verify() {
  const [hash, setHash] = useState('');
  const [selectedCert, setSelectedCert] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const handleVerify = async () => {
    setLoading(true);
    setError('');
    setSelectedCert(null);
    setPreviewImage(null);

    try {
      // Initialize the provider
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const network = await provider.getNetwork();
      const contractAddress = config[network.chainId]?.address;
      if (!contractAddress) {
        throw new Error('Contract address not found for the network.');
      }

      // Initialize the contract
      const contract = new ethers.Contract(contractAddress, CertificateVerifier, provider);

      // Verify the certificate
      const result = await contract.verifyCertificate(hash);
      const [
        certHash,
        name,
        matricNo,
        grade,
        department,
        completionDate,
        issuer,
        exists
      ] = result;

      if (exists) {
        setSelectedCert({
          certHash,
          name,
          matricNo,
          grade,
          department,
          completionDate: new Date(completionDate * 1000).toLocaleDateString(),
          issuer
        });
        captureCertificate({
          certHash,
          name,
          matricNo,
          grade,
          department,
          completionDate: new Date(completionDate * 1000).toLocaleDateString(),
          issuer
        });
      } else {
        setSelectedCert(null);
        alert('Certificate does not exist.');
      }
    } catch (err) {
      console.error('Error verifying certificate:', err);
      setError('BlockChain authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const captureCertificate = async (cert) => {
    try {
      const element = document.getElementById(`certificate-${cert.matricNo}`);
      if (element) {
        const canvas = await html2canvas(element, { useCORS: true });
        const dataURL = canvas.toDataURL('image/png');
        setPreviewImage(dataURL);
        setShowModal(true);
      }
    } catch (error) {
      console.error('Failed to capture certificate:', error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setPreviewImage(null);
  };

  const handleScan = (data) => {
    if (data) {
      setHash(data);
      setShowScanner(false);
      handleVerify();
    }
  };

  const handleError = (error) => {
    console.error('QR Code scan error:', error);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    setImageFile(URL.createObjectURL(file));

    // Create an image element to draw on a canvas
    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      context.drawImage(img, 0, 0);
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

      // Decode QR code from the canvas
      const code = jsQR(imageData.data, canvas.width, canvas.height);
      if (code) {
        setHash(code.data);
        handleVerify();
      } else {
        setError('No QR code found in the image.');
      }
    };
  };

  const generatePDF = () => {
    const element = document.getElementById(`certificate-${selectedCert.matricNo}`);
    if (element) {
      html2canvas(element).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
  
        // Create a new jsPDF instance with landscape orientation
        const pdf = new jsPDF('l', 'mm', 'a4'); // 'l' for landscape, 'mm' for millimeters, 'a4' for page size
  
        // Get PDF page dimensions
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
  
        // Calculate the image dimensions
        const imgWidth = canvas.width * 2; // Adjust the scale factor as needed
        const imgHeight = canvas.height * 2; // Adjust the scale factor as needed
  
        // Calculate the scale to fit the image within the PDF page
        const scale = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
  
        // Calculate new dimensions for the image in PDF
        const scaledImgWidth = imgWidth * scale;
        const scaledImgHeight = imgHeight * scale;
  
        // Calculate the position to center the image
        const xOffset = (pdfWidth - scaledImgWidth) / 2;
        const yOffset = (pdfHeight - scaledImgHeight) / 2;
  
        // Add image to PDF
        pdf.addImage(imgData, 'PNG', xOffset, yOffset, scaledImgWidth, scaledImgHeight);
  
        // Save the PDF
        pdf.save('certificate.pdf');
      });
    }
  }

  return (
    <>
      <div className='pt-40 px-5 lg:px-24 place-items-center w-full'>
        <div>
          <h1 className='text-4xl text-center font-extrabold uppercase px-6'>Verifying Certificate</h1>
        </div>
        <div className='flex bg-gradient-to-r from-[#041945] to-slate-800 mt-5'>
          <input
            className='w-full bg-white text-black h-11 px-5 placeholder:text-slate-800 placeholder:px-5'
            type='text'
            placeholder='Enter certificate hash'
            value={hash}
            onChange={(e) => setHash(e.target.value)}
          />
          <button
            className='bg-green-500 px-6 text-white'
            onClick={handleVerify}
            disabled={loading}
          >
            Verify
          </button>
        </div>
        <div className='py-4 '>
          <button
            className='bg-blue-500 px-6 h-11 text-white ml-2'
            onClick={() => setShowScanner(true)}
          >
            Scan QR Code
          </button>
          <input
            type='file'
            accept='image/*'
            onChange={handleFileChange}
            className='ml-2 mt-4'
          />
        </div>
        <p>After uploading, click on verify to generate the verification. Click on verify</p>
      </div>

      {showScanner && (
        <div className='fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50'>
          <div className='bg-white p-4 rounded'>
            <h3 className='text-lg mb-2'>Scan QR Code</h3>
            <QrReader
              onResult={(result, error) => {
                if (result) {
                  handleScan(result?.text);
                } else if (error) {
                  handleError(error);
                }
              }}
              constraints={{ facingMode: 'environment' }}
              style={{ width: '100%' }}
            />
            <button
              className='mt-4 bg-red-600 text-white py-2 px-4 rounded'
              onClick={() => setShowScanner(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

<div className='bg-gradient-to-r p-3 sm:p-5 from-[#041945] to-slate-800 mt-5 sm:mt-10 mx-2 sm:mx-5 lg:mx-24 place-items-center min-h-[250px]'>
  <div className='items-center text-white'>
    {error && <p className='font-bold text-lg sm:text-2xl text-center items-center p-3 sm:p-6 capitalize'>{error}</p>}
    {selectedCert && (
      <>
        <div
          id={`certificate-${selectedCert.matricNo}`}
          className='bg-white p-4 sm:p-8 lg:p-24 text-black border border-sky-black'
        >
          <div className='text-center'>
            <div className='object-center justify-center align-middle flex'>
              <img src='/obafemi.png' className='h-32 sm:h-48 lg:h-64' alt='University Logo' />
            </div>
            <h1 className='text-2xl sm:text-4xl lg:text-6xl font-bold capitalize text-center'>Obafemi Awolowo University</h1>
            <p className='py-3 sm:py-5 lg:py-7'>Proudly presented that</p>
            <h1 className='text-sm sm:text-lg lg:text-2xl font-medium'>
              This is to certify that <strong className='underline capitalize'>{selectedCert.name}</strong> having completed the approved course of study and fulfilled all prescribed conditions has this day under the authority of the senate been admitted to the degree of B.Sc Computer Science with the matriculation number <strong>{selectedCert.matricNo}</strong> graduating with the grade of <strong>{selectedCert.grade}</strong> from the department of <strong>{selectedCert.department}</strong>.
            </h1>
            <div className='flex flex-col sm:flex-row text-center mt-4 p-2 items-center'>
              <QRCode value={selectedCert.certHash} size={96} className='p-2 bg-white mb-2 sm:mb-0'/>
              <div className='text-left p-2'>
                <strong>Hash</strong>
                <p className='text-xs sm:text-sm break-all'>{selectedCert.certHash}</p>
              </div>
            </div>
            <p className='text-right text-sm sm:text-base'><strong>Issue date:</strong> {selectedCert.completionDate}</p>
          </div>
        </div>
        <button
          className='mt-4 bg-green-500 text-white py-2 px-4 rounded w-full sm:w-auto'
          onClick={generatePDF}
        >
          Download PDF
        </button>
      </>
    )}
    {!selectedCert && !error && !loading && <p className='font-bold'>No result</p>}
  </div>
</div>

      {/* Modal for preview */}
      {showModal && (
        <div className='fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50'>
          <div className='bg-white p-4 rounded'>
            <h3 className='text-lg mb-2'>Certificate Preview</h3>
            <img src={previewImage} alt='Certificate Preview' />
            <button
              className='mt-4 bg-red-600 text-white py-2 px-4 rounded'
              onClick={handleCloseModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
