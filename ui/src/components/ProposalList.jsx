import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useContracts } from '../web3/useContracts';
import { Box, Typography, Button, Card, CardContent, CircularProgress } from '@mui/material';

export default function ProposalList() {
  const { contracts, loading, error } = useContracts();
  const [proposals, setProposals] = useState([]);
  const [loadingProposals, setLoadingProposals] = useState(true);

  useEffect(() => {
    const fetchProposals = async () => {
      if (contracts) {
        try {
          // We'll implement this later when we have proposal events
          setLoadingProposals(false);
        } catch (err) {
          console.error('Error fetching proposals:', err);
          setLoadingProposals(false);
        }
      }
    };
    fetchProposals();
  }, [contracts]);

  const handleVote = async (proposalId, support) => {
    try {
      const tx = await contracts.governor.castVote(proposalId, support);
      await tx.wait();
      alert('Vote cast successfully!');
    } catch (err) {
      alert('Error casting vote: ' + err.message);
    }
  };

  const handleQueue = async (proposalId) => {
    try {
      const tx = await contracts.governor.queue(proposalId);
      await tx.wait();
      alert('Proposal queued successfully!');
    } catch (err) {
      alert('Error queueing proposal: ' + err.message);
    }
  };

  const handleExecute = async (proposalId) => {
    try {
      const tx = await contracts.governor.execute(proposalId);
      await tx.wait();
      alert('Proposal executed successfully!');
    } catch (err) {
      alert('Error executing proposal: ' + err.message);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (loadingProposals) return <CircularProgress />;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Active Proposals
      </Typography>
      {proposals.length === 0 ? (
        <Typography>No active proposals</Typography>
      ) : (
        proposals.map((proposal) => (
          <Card key={proposal.id} sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6">{proposal.description}</Typography>
              <Typography variant="body2" color="text.secondary">
                Status: {proposal.state}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleVote(proposal.id, 1)}
                  sx={{ mr: 1 }}
                >
                  Vote For
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleVote(proposal.id, 0)}
                  sx={{ mr: 1 }}
                >
                  Vote Against
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => handleQueue(proposal.id)}
                  sx={{ mr: 1 }}
                >
                  Queue
                </Button>
                <Button variant="outlined" onClick={() => handleExecute(proposal.id)}>
                  Execute
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
}
