import React, { useState, useEffect } from 'react';
import { useContracts } from '../web3/useContracts';
import { 
  Box, 
  Typography, 
  CircularProgress,
  Card,
  CardContent,
  Grid
} from '@mui/material';

export default function CertificateList() {
  const { contracts, loading, error } = useContracts();
  const [certificates, setCertificates] = useState([]);
  const [loadingCerts, setLoadingCerts] = useState(true);

  useEffect(() => {
    const fetchCertificates = async () => {
      if (contracts?.cert) {
        try {
          // Get certificate issued events
          const filter = contracts.cert.filters.CertificateIssued();
          const events = await contracts.cert.queryFilter(filter);
          
          const certs = await Promise.all(events.map(async (event) => {
            const cert = {
              id: event.args[0].toString(),
              name: event.args[1],
              course: event.args[2],
              grade: event.args[3],
              date: event.args[4],
            };
            return cert;
          }));
          
          setCertificates(certs);
        } catch (err) {
          console.error('Error fetching certificates:', err);
        } finally {
          setLoadingCerts(false);
        }
      }
    };

    fetchCertificates();
  }, [contracts]);

  if (loading || loadingCerts) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Issued Certificates
      </Typography>

      <Grid container spacing={2}>
        {certificates.map((cert) => (
          <Grid item xs={12} sm={6} md={4} key={cert.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">
                  Certificate #{cert.id}
                </Typography>
                <Typography>
                  <strong>Name:</strong> {cert.name}
                </Typography>
                <Typography>
                  <strong>Course:</strong> {cert.course}
                </Typography>
                <Typography>
                  <strong>Grade:</strong> {cert.grade}
                </Typography>
                <Typography>
                  <strong>Date:</strong> {cert.date}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {certificates.length === 0 && (
        <Typography sx={{ mt: 2 }}>
          No certificates have been issued yet.
        </Typography>
      )}
    </Box>
  );
}
