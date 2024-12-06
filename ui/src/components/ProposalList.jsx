import React, { useState, useEffect } from 'react';
import { useContracts } from '../web3/useContracts';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  CircularProgress,
  Chip,
  Grid 
} from '@mui/material';

export default function ProposalList() {
  const { contracts, loading, error } = useContracts();
  const [proposals, setProposals] = useState([]);
  const [loadingProposals, setLoadingProposals] = useState(true);

  const proposalStates = [
    'Pending',
    'Active',
    'Canceled',
    'Defeated',
    'Succeeded',
    'Queued',
    'Expired',
    'Executed'
  ];

  useEffect(() => {
    const fetchProposals = async () => {
      if (contracts?.governor) {
        try {
          const filter = contracts.governor.filters.ProposalCreated();
          const events = await contracts.governor.queryFilter(filter);
          
          const proposalDetails = await Promise.all(events.map(async (event) => {
            const proposalId = event.args[0].toString();
            const state = await contracts.governor.state(proposalId);
            return {
              id: proposalId,
              description: event.args[8],
              state: proposalStates[state],
              targets: event.args[2],
              values: event.args[3],
              calldatas: event.args[4]
            };
          }));
          
          setProposals(proposalDetails);
        } catch (err) {
          console.error('Error fetching proposals:', err);
        } finally {
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
      window.location.reload();
    } catch (err) {
      alert('Error casting vote: ' + err.message);
    }
  };

  const handleQueue = async (proposal) => {
    try {
      const tx = await contracts.governor.queue(
        proposal.targets,
        proposal.values,
        proposal.calldatas,
        ethers.utils.id(proposal.description)
      );
      await tx.wait();
      alert('Proposal queued successfully!');
      window.location.reload();
    } catch (err) {
      alert('Error queueing proposal: ' + err.message);
    }
  };

  const handleExecute = async (proposal) => {
    try {
      const tx = await contracts.governor.execute(
        proposal.targets,
        proposal.values,
        proposal.calldatas,
        ethers.utils.id(proposal.description)
      );
      await tx.wait();
      alert('Proposal executed successfully!');
      window.location.reload();
    } catch (err) {
      alert('Error executing proposal: ' + err.message);
    }
  };

  const getStateColor = (state) => {
    switch (state) {
      case 'Active': return 'primary';
      case 'Succeeded': return 'success';
      case 'Executed': return 'success';
      case 'Defeated': return 'error';
      case 'Canceled': return 'error';
      case 'Expired': return 'warning';
      case 'Queued': return 'info';
      default: return 'default';
    }
  };

  if (loading || loadingProposals) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Proposals
      </Typography>

      <Grid container spacing={2}>
        {proposals.map((proposal) => (
          <Grid item xs={12} key={proposal.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    Proposal #{proposal.id.slice(0, 8)}...
                  </Typography>
                  <Chip 
                    label={proposal.state} 
                    color={getStateColor(proposal.state)}
                  />
                </Box>

                <Typography variant="body1" sx={{ mb: 2 }}>
                  {proposal.description}
                </Typography>

                {proposal.state === 'Active' && (
                  <Box sx={{ mb: 2 }}>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => handleVote(proposal.id, 1)}
                      sx={{ mr: 1 }}
                    >
                      Vote For
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleVote(proposal.id, 0)}
                    >
                      Vote Against
                    </Button>
                  </Box>
                )}

                {proposal.state === 'Succeeded' && (
                  <Button
                    variant="contained"
                    onClick={() => handleQueue(proposal)}
                  >
                    Queue Proposal
                  </Button>
                )}

                {proposal.state === 'Queued' && (
                  <Button
                    variant="contained"
                    onClick={() => handleExecute(proposal)}
                  >
                    Execute Proposal
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {proposals.length === 0 && (
        <Typography>No proposals found</Typography>
      )}
    </Box>
  );
}
