import React, { useState } from 'react';
import { parseEther } from 'ethers';
import { useContracts } from '../web3/useContracts';
import { Box, Typography, TextField, Button, CircularProgress } from '@mui/material';

export default function CreateProposal() {
  const { contracts, loading, error } = useContracts();
  const [description, setDescription] = useState('');
  const [targetAddress, setTargetAddress] = useState('');
  const [value, setValue] = useState('0');
  const [calldata, setCalldata] = useState('');
  const [creating, setCreating] = useState(false);

  const handleCreateProposal = async () => {
    if (!description || !targetAddress) {
      alert('Please fill in all fields');
      return;
    }

    try {
      setCreating(true);
      const valueWei = parseEther(value);
      
      const tx = await contracts.governor.propose(
        [targetAddress],
        [valueWei],
        [calldata || '0x'],
        description
      );
      
      await tx.wait();
      alert('Proposal created successfully!');
      
      // Clear form
      setDescription('');
      setTargetAddress('');
      setValue('0');
      setCalldata('');
    } catch (err) {
      alert('Error creating proposal: ' + err.message);
    } finally {
      setCreating(false);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Create New Proposal
      </Typography>
      
      <TextField
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        fullWidth
        multiline
        rows={4}
        sx={{ mt: 2 }}
      />
      
      <TextField
        label="Target Address"
        value={targetAddress}
        onChange={(e) => setTargetAddress(e.target.value)}
        fullWidth
        sx={{ mt: 2 }}
      />
      
      <TextField
        label="Value (ETH)"
        type="number"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        fullWidth
        sx={{ mt: 2 }}
      />
      
      <TextField
        label="Calldata (optional)"
        value={calldata}
        onChange={(e) => setCalldata(e.target.value)}
        fullWidth
        sx={{ mt: 2 }}
        placeholder="0x..."
      />
      
      <Button
        variant="contained"
        onClick={handleCreateProposal}
        disabled={creating}
        sx={{ mt: 2 }}
      >
        {creating ? <CircularProgress size={24} /> : 'Create Proposal'}
      </Button>
    </Box>
  );
}
