import React, { useCallback, useEffect, useState } from 'react';
import './App.css';
import { Box, Paper } from '@mui/material/';
import { Calculation } from './types/Calculation';
import { calculationsAPI } from './api/calculations';
import { NewCalculationForm } from './components/NewCalculationForm';
import { HistoryOfCalculations } from './components/HistoryOfCalculations';

export const App: React.FC = () => {
  const { deleteAllCalculations, getCalculations } = calculationsAPI;
  
  const [calculations, setCalculations] = useState<Calculation[]>([]);
  const [isClearing, setIsClearing] = useState(false);
  const [historyError, setHistoryError] = useState('');
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const loadHistory = useCallback(async () => {
    try {
      const loadedCalculations = await getCalculations();

      setCalculations(loadedCalculations);
      setIsDataLoaded(true);
    } catch (error) {
      setHistoryError('Can\'t load history');
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, []);

  const clearHistory = useCallback(async () => {
    setIsClearing(true);
    setHistoryError('');

    try {
      await deleteAllCalculations();
      await loadHistory();
    } catch (error) {
      setHistoryError('Unable to clear history');
    } finally {
      setIsClearing(false);
    }
  }, []);

  if (historyError) {
    setTimeout(() => setHistoryError(''), 2000);
  }

  return (
    <Box
      sx={{
        m: 2,
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Paper
        className="paper"
        elevation={5}
        sx={{
          padding: '20px',
          textAlign: 'center',
        }}
      >
        <h1>The median prime number(s) getter</h1>

        <NewCalculationForm loadHistory={loadHistory} />

        <HistoryOfCalculations
          calculations={calculations}
          isClearing={isClearing}
          isDataLoaded={isDataLoaded}
          historyError={historyError}
          onClearHistory={clearHistory}
        />
      </Paper>
    </Box>
  );
};
