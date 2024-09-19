import React, { useEffect, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import QRCode from 'qrcode.react';

function CertificateList({ certificateVerifier }) {
  const [certificates, setCertificates] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedCert, setSelectedCert] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Number of items per page

  useEffect(() => {
    const fetchCertificates = async () => {
      if (certificateVerifier) {
        try {
          const [hashes, names, matricNos, grades, departments, completionDates, issuers, exists] = await certificateVerifier.getAllCertificates();
          const certs = hashes.map((hash, i) => ({
            hash,
            name: names[i],
            matricNo: matricNos[i],
            grade: grades[i],
            department: departments[i],
            completionDate: new Date(completionDates[i] * 1000).toLocaleDateString(),
            issuer: issuers[i],
            exists: exists[i],
          }));
          setCertificates(certs);
        } catch (error) {
          console.error('Failed to fetch certificates:', error);
        }
      }
    };

    fetchCertificates();
    const intervalId = setInterval(fetchCertificates, 20000); // Poll every 20 seconds

    return () => clearInterval(intervalId); // Clean up interval on component unmount
  }, [certificateVerifier]);

  const handleDelete = async (matricNo) => {
    if (certificateVerifier) {
      try {
        const tx = await certificateVerifier.deleteCertificateByMatricNo(matricNo);
        await tx.wait();
        alert('Certificate deleted successfully!');
        setCertificates(prev => prev.filter(cert => cert.matricNo !== matricNo));
      } catch (error) {
        console.error('Failed to delete certificate:', error);
        alert('Failed to delete certificate. See console for details.');
      }
    }
  };

  const handlePreview = async (cert) => {
    setSelectedCert(cert);
    try {
      const element = document.getElementById(`certificate-${cert.matricNo}`);
      if (element) {
        const canvas = await html2canvas(element, { useCORS: true });
        const dataURL = canvas.toDataURL('image/png');
        setPreviewImage(dataURL);
        setShowModal(true);
      }
    } catch (error) {
      console.error('Failed to preview certificate:', error);
      alert('Failed to preview certificate. See console for details.');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setPreviewImage(null);
    setSelectedCert(null);
  };

  const generatePDF = () => {
    const element = document.getElementById(`certificate-${selectedCert.matricNo}`);
    if (element) {
      html2canvas(element, { useCORS: true }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');

        const pdf = new jsPDF('l', 'mm', 'a4');

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        const canvasWidth = pdfWidth - 20;
        const canvasHeight = pdfHeight - 20;
        const canvasX = 10;
        const canvasY = 10;

        const scaleX = canvasWidth / canvas.width;
        const scaleY = canvasHeight / canvas.height;
        const scale = Math.min(scaleX, scaleY);

        const scaledImgWidth = canvas.width * scale;
        const scaledImgHeight = canvas.height * scale;

        const xOffset = canvasX + (canvasWidth - scaledImgWidth) / 2;
        const yOffset = canvasY + (canvasHeight - scaledImgHeight) / 2;

        pdf.addImage(imgData, 'PNG', xOffset, yOffset, scaledImgWidth, scaledImgHeight);

        pdf.setDrawColor(0, 0, 0);
        pdf.setLineWidth(2);
        pdf.roundedRect(canvasX, canvasY, canvasWidth, canvasHeight, 10, 10);

        pdf.save('certificate.pdf');
      });
    }
  };

  // Compute the certificates to display based on pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedCertificates = certificates.slice(startIndex, endIndex);

  // Pagination handlers
  const handleNextPage = () => {
    if (currentPage < Math.ceil(certificates.length / itemsPerPage)) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  return (
    <div>
      <h2 className='text-center text-2xl py-5'>Graduating List</h2>

      <div className='px-12'>
        <table className='w-full'>
          <thead className='bg-green-500 h-14'>
            <tr>
              <th className='px-1 text-left'>Id</th>
              <th className='px-1 text-left'>Matric No</th>
              <th className='px-1 text-left'>Name</th>
              <th className='px-1 text-left'>Department</th>
              <th className='px-1 text-left'>Grade</th>
              <th className='px-1 text-left'>YOG</th>
              <th className='text-left'>Delete</th>
              <th className='text-left'>Preview</th>
            </tr>
          </thead>
          <tbody className='bg-slate-800'>
            {displayedCertificates.map((cert, index) => (
              <tr key={cert.matricNo} className='h-16'>
                <td>{startIndex + index + 1}</td>
                <td>{cert.matricNo}</td>
                <td>{cert.name}</td>
                <td>{cert.department}</td>
                <td>{cert.grade}</td>
                <td>{cert.completionDate}</td>
                <td>
                  <button
                    className='bg-red-600 p-2'
                    onClick={() => handleDelete(cert.matricNo)}
                  >
                    Delete
                  </button>
                </td>
                <td>
                  <button
                    className='bg-blue-600 p-2'
                    onClick={() => handlePreview(cert)}
                  >
                    Preview
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div className='flex justify-between mt-4'>
          <button
            className='bg-gray-600 text-white py-2 px-4 rounded'
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>Page {currentPage} of {Math.ceil(certificates.length / itemsPerPage)}</span>
          <button
            className='bg-gray-600 text-white py-2 px-4 rounded'
            onClick={handleNextPage}
            disabled={currentPage === Math.ceil(certificates.length / itemsPerPage)}
          >
            Next
          </button>
        </div>

        {/* Hidden certificate for preview */}
        {selectedCert && (
          <div
            id={`certificate-${selectedCert.matricNo}`}
            className='bg-white p-24 text-black border-1 border-sky-black'
          >
            <div className='text-center'>
              <div className='object-center justify-center align-middle flex'>
                <img src='/obafemi.png' className='h-62' alt='University Logo' />
              </div>
              <h1 className='text-6xl font-bold capitalize text-center'>Obafemi Awolowo University</h1>
              <p className='py-7'>Proudly presented that</p>
              <h1 className='text-2xl font-medium'>
                This is to certify that <strong className='underline capitalize'>{selectedCert.name}</strong> having completed the approved course of study and fulfilled all prescribed conditions has this day under the authority of the senate been admitted to the degree of B.Sc  the matriculation number <strong>{selectedCert.matricNo}</strong> graduating with the grade of <strong>{selectedCert.grade}</strong> from the department of <strong>{selectedCert.department}</strong>.
              </h1>
              <div className='flex text-center mt-4 p-2 items-center'>
                <QRCode value={selectedCert.hash} size={128} className='p-2 bg-white'/>
                <div className='text-left p-2'>
                  <strong>Hash</strong>
                  <p>{selectedCert.hash}</p>
                </div>
              </div>
              <p className='text-right'><strong>Issue date:</strong> {selectedCert.completionDate}</p>
            </div>
          </div>
        )}
      </div>

      {/* Modal for preview */}
      {showModal && (
        <div className='fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50'>
          <div className='bg-white p-4 rounded max-w-md mx-4 w-full max-h-screen overflow-auto'>
            <h3 className='text-lg mb-2'>Certificate Preview</h3>
            <img src={previewImage} alt='Certificate Preview' />
            <div className='flex justify-between mt-4'>
              <button
                className='bg-red-600 text-white py-2 px-4 rounded'
                onClick={handleCloseModal}
              >
                Close
              </button>
              <button
                className='bg-green-600 text-white py-2 px-4 rounded'
                onClick={generatePDF}
              >
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CertificateList;
