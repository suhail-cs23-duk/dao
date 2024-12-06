import React, { useState, useEffect } from 'react';
import { parseEther, formatEther } from 'ethers';
import { useContracts } from '../web3/useContracts';
import { Box, Typography, Button, TextField } from '@mui/material';

export default function TokenInfo() {
  const { contracts, signer, loading, error } = useContracts();
  const [balance, setBalance] = useState('0');
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [delegateAddress, setDelegateAddress] = useState('');

  useEffect(() => {
    const fetchBalance = async () => {
      if (contracts && signer) {
        const address = await signer.getAddress();
        const balance = await contracts.govToken.balanceOf(address);
        setBalance(formatEther(balance));
      }
    };
    fetchBalance();
  }, [contracts, signer]);

  const handleDelegate = async () => {
    try {
      const tx = await contracts.govToken.delegate(delegateAddress);
      await tx.wait();
      alert('Successfully delegated voting power!');
    } catch (err) {
      alert('Error delegating: ' + err.message);
    }
  };

  const handleTransfer = async () => {
    try {
      const amountWei = parseEther(amount);
      const tx = await contracts.govToken.transfer(recipient, amountWei);
      await tx.wait();
      alert('Transfer successful!');
    } catch (err) {
      alert('Error transferring tokens: ' + err.message);
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5">Governance Token</Typography>
      <Typography variant="body1" sx={{ mt: 2 }}>
        Your Balance: {balance} GT
      </Typography>

      <Box sx={{ mt: 3 }}>
        <Typography variant="h6">Transfer Tokens</Typography>
        <TextField
          label="Recipient Address"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          fullWidth
          sx={{ mt: 1 }}
        />
        <TextField
          label="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          fullWidth
          sx={{ mt: 1 }}
        />
        <Button variant="contained" onClick={handleTransfer} sx={{ mt: 1 }}>
          Transfer
        </Button>
      </Box>

      <Box sx={{ mt: 3 }}>
        <Typography variant="h6">Delegate Voting Power</Typography>
        <TextField
          label="Delegate Address"
          value={delegateAddress}
          onChange={(e) => setDelegateAddress(e.target.value)}
          fullWidth
          sx={{ mt: 1 }}
        />
        <Button variant="contained" onClick={handleDelegate} sx={{ mt: 1 }}>
          Delegate
        </Button>
      </Box>
    </Box>
  );
}
