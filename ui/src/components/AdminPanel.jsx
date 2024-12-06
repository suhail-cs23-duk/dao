import React, { useState } from 'react';
import { useContracts } from '../web3/useContracts';
import { Box, Typography, TextField, Button, CircularProgress } from '@mui/material';
import { parseEther } from 'ethers';

export default function AdminPanel() {
  const { contracts, signer, loading, error } = useContracts();
  const [mintAmount, setMintAmount] = useState('');
  const [mintAddress, setMintAddress] = useState('');
  const [roleAddress, setRoleAddress] = useState('');
  const [processing, setProcessing] = useState(false);

  const PROPOSER_ROLE = '0xb09aa5aeb3702cfd50b6b62bc4532604938f21248a27a1d5ca736082b6819cc1';
  const EXECUTOR_ROLE = '0xd8aa0f3194971a2a116679f7c2090f6939c8d4e01a2a8d7e41d55e5351469e63';

  const handleMint = async () => {
    try {
      setProcessing(true);
      const amount = parseEther(mintAmount);
      const tx = await contracts.govToken.mint(mintAddress, amount);
      await tx.wait();
      alert('Tokens minted successfully!');
      setMintAmount('');
      setMintAddress('');
    } catch (err) {
      alert('Error minting tokens: ' + err.message);
    } finally {
      setProcessing(false);
    }
  };

  const grantRole = async (role) => {
    try {
      setProcessing(true);
      const tx = await contracts.timeLock.grantRole(role, roleAddress);
      await tx.wait();
      alert('Role granted successfully!');
      setRoleAddress('');
    } catch (err) {
      alert('Error granting role: ' + err.message);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Admin Panel
      </Typography>

      <Box sx={{ mt: 3 }}>
        <Typography variant="h6">Mint New Tokens</Typography>
        <TextField
          label="Recipient Address"
          value={mintAddress}
          onChange={(e) => setMintAddress(e.target.value)}
          fullWidth
          sx={{ mt: 1 }}
        />
        <TextField
          label="Amount"
          type="number"
          value={mintAmount}
          onChange={(e) => setMintAmount(e.target.value)}
          fullWidth
          sx={{ mt: 1 }}
        />
        <Button
          variant="contained"
          onClick={handleMint}
          disabled={processing}
          sx={{ mt: 1 }}
        >
          Mint Tokens
        </Button>
      </Box>

      <Box sx={{ mt: 3 }}>
        <Typography variant="h6">Grant Roles</Typography>
        <TextField
          label="Address"
          value={roleAddress}
          onChange={(e) => setRoleAddress(e.target.value)}
          fullWidth
          sx={{ mt: 1 }}
        />
        <Button
          variant="contained"
          onClick={() => grantRole(PROPOSER_ROLE)}
          disabled={processing}
          sx={{ mt: 1, mr: 1 }}
        >
          Grant Proposer Role
        </Button>
        <Button
          variant="contained"
          onClick={() => grantRole(EXECUTOR_ROLE)}
          disabled={processing}
          sx={{ mt: 1 }}
        >
          Grant Executor Role
        </Button>
      </Box>
    </Box>
  );
}
