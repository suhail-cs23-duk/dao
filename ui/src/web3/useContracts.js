import { useState, useEffect } from 'react';
import { connectWallet, getContracts } from './contracts';

export const useContracts = () => {
  const [contracts, setContracts] = useState(null);
  const [signer, setSigner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const initializeContracts = async () => {
    try {
      const newSigner = await connectWallet();
      setSigner(newSigner);
      const contractInstances = await getContracts(newSigner);
      setContracts(contractInstances);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    initializeContracts();
  }, []);

  return { contracts, signer, loading, error, reconnect: initializeContracts };
};
