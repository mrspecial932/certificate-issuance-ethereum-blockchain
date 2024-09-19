import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import { ethers } from 'ethers';
import Home from './pages/Home';
import Verify from './pages/Verify';
import Admin from './pages/Admin';
import CertificateVerifier from './abi/CertificateVerifier.json';
import config from './config.json';

export default function App() {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [certificateVerifier, setCertificateVerifier] = useState(null);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const loadBlockchainData = async () => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);

        const accounts = await provider.send('eth_requestAccounts', []);
        setAccount(accounts[0]);

        window.ethereum.on('accountsChanged', async (accounts) => {
          if (accounts.length === 0) {
            setAccount(null);
            setCertificateVerifier(null);
            setIsOwner(false);
          } else {
            setAccount(accounts[0]);
            const network = await provider.getNetwork();
            loadContract(provider, network.chainId);
          }
        });

        const network = await provider.getNetwork();
        loadContract(provider, network.chainId);
        
      } catch (error) {
        console.error('Failed to load blockchain data:', error);
      }
    };

    const loadContract = async (provider, chainId) => {
      try {
        const contractAddress = config[chainId]?.address;
        if (!contractAddress) {
          throw new Error('Contract address not found for the network.');
        }

        const contract = new ethers.Contract(
          contractAddress,
          CertificateVerifier,
          provider.getSigner()
        );
        console.log('Contract Address:', contract.address);
        setCertificateVerifier(contract);

        // Check if the current account is the owner
        const owner = await contract.owner();
        setIsOwner(owner.toLowerCase() === account.toLowerCase());
      } catch (error) {
        console.error('Failed to load contract:', error);
      }
    };

    loadBlockchainData();
  }, [account]);

  const ProtectedAdminRoute = () => {
    return isOwner ? <Admin certificateVerifier={certificateVerifier} /> : <Navigate to="/" />;
  };

  return (
    <Router>
      <Header account={account} setAccount={setAccount} isOwner={isOwner} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/admin" element={<ProtectedAdminRoute />} />
      </Routes>
    </Router>
  );
}