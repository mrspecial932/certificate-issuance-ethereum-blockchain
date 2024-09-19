import React, { useState } from 'react';

function Form({ certificateVerifier }) {
  const [newCertificate, setNewCertificate] = useState({
    name: '',
    matricNo: '',
    department: '',
    grade: '',
    gmail: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCertificate(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting certificate:', newCertificate);

    if (certificateVerifier) {
      try {
        console.log('Attempting to call issueCertificate');
        const tx = await certificateVerifier.issueCertificate(
          newCertificate.name,
          newCertificate.matricNo,
          newCertificate.grade,
          newCertificate.department
        );
        console.log('Transaction sent:', tx);

        // Wait for transaction confirmation
        const receipt = await tx.wait();
        console.log('Transaction confirmed:', receipt);

        // Extract the certificate hash from the event logs
        let certificateHash = null;
        for (const event of receipt.events) {
          if (event.event === 'CertificateIssued') {
            certificateHash = event.args.hash;
            break;
          }
        }

        if (!certificateHash) {
          throw new Error('Certificate hash not found in transaction receipt.');
        }

        alert('Certificate added successfully!');

        // Send email after successful transaction
        try {
          const response = await fetch('http://localhost:5000/send-email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              email: newCertificate.gmail,
              hash: certificateHash
            })
          });

          const result = await response.text();
          console.log(result);
          alert('Email sent successfully!');
        } catch (error) {
          console.error('Error sending email:', error);
          alert('Failed to send email.');
        }
      } catch (error) {
        console.error('Failed to add certificate:', error);
        alert('Failed to add certificate. See console for details.');
      }
    } else {
      console.error('Contract instance is not available');
      alert('Contract instance is not available. Please ensure you are connected to the correct network.');
    }
  };

  return (
    <div className='my-20 text-center md:text-left'>
      <h2 className='font-extrabold text-3xl pt-12 px-20'>Add New Certificate</h2>
      <div className='mx-20'>
        <form onSubmit={handleSubmit}>
          <input
            className='input'
            type="text"
            name="name"
            placeholder="Name"
            value={newCertificate.name}
            onChange={handleInputChange}
            required
          />
          <input
            className='input'
            type="text"
            name="matricNo"
            placeholder="Matric No"
            value={newCertificate.matricNo}
            onChange={handleInputChange}
            required
          />
          <input
            className='input'
            type="text"
            name="department"
            placeholder="Department"
            value={newCertificate.department}
            onChange={handleInputChange}
            required
          />
          <select
            name="grade"
            className='w-full h-12 bg-slate-100 rounded-xl text-slate-800 px-4 my-5'
            value={newCertificate.grade}
            onChange={handleInputChange}
            required
          >
            <option value="" disabled>Select Grade</option>
            <option value="first class">First Class</option>
            <option value="second class upper">Second Class Upper</option>
            <option value="second class lower">Second Class Lower</option>
            <option value="third class">Third Class</option>
            <option value="passed">Passed</option>
          </select>

          <input
            className='input'
            type="text"
            name="gmail"
            placeholder="Student Mail"
            value={newCertificate.gmail}
            onChange={handleInputChange}
            required
          />
          <button
            type="submit"
            className='inline-block rounded-full bg-[#13ec36] px-5 py-4 font-semibold uppercase tracking-wide text-slate-50 transition-colors duration-300 hover:bg-green-700 w-full h-12'
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default Form;
