import { Box, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import * as React from 'react';

import { ModalWrapperProps } from '../FlowCommons/ModalWrapper';
import { CompleteIcon, StepHeader } from '../Withdraw/WithdrawModalContentNext';

export const BorrowModalContentNext = ({ symbol }: ModalWrapperProps) => {
  return (
    <>
      <Typography variant="description" color={'#666'}>
        These are your transaction details. Make sure to check if this is correct before submitting.
      </Typography>

      <Box
        mt={2.5}
        borderRadius="8px"
        borderColor={'rgba(229, 229, 229, 1)'}
        sx={{ borderWidth: '1px', p: 4, borderStyle: 'solid' }}
      >
        {[
          <>
            <Typography variant="description" color={'#666'}>
              Amount
            </Typography>
            <Typography variant="main14">
              231,465,798 {symbol}
              <Typography component={'span'} color={'#666'}>
                ($320,102,399)
              </Typography>
            </Typography>
          </>,
          <>
            <Typography variant="description" color={'#666'}>
              Coliateral usage
            </Typography>
            <Typography variant="main14" color={'#3AC170'}>
              Yes
            </Typography>
          </>,
          <>
            <Typography variant="description" color={'#666'}>
              New health factor
            </Typography>
            <Typography variant="main14" color={'#3AC170'}>
              2.62
            </Typography>
          </>,
        ].map((item, index) => {
          return (
            <Box
              key={index}
              display={'flex'}
              justifyContent="space-between"
              alignItems={'center'}
              mt={index === 0 ? 0 : 2.5}
            >
              {item}
            </Box>
          );
        })}
      </Box>
      <Box
        mt={2.5}
        borderRadius="8px"
        borderColor={'rgba(229, 229, 229, 1)'}
        sx={{ borderWidth: '1px', borderStyle: 'solid' }}
      >
        <StepBox />
      </Box>
    </>
  );
};

const sleep = (time = 1) =>
  new Promise((r) => {
    setTimeout(() => {
      r(true);
    }, 1000 * time);
  });

const steps = ['Borrow', 'Finished'];
const StepBox = () => {
  const [isLoading, setLoading] = React.useState(false);
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const onBorrow = async () => {
    setLoading(true);
    try {
      await sleep();
      await handleNext();
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <StepHeader activeStep={activeStep} steps={steps} />
      <Box p={4}>
        {activeStep === steps.length - 1 ? (
          <Box
            display={'flex'}
            justifyContent="center"
            alignItems={'center'}
            sx={{ mt: 1, mb: 5 }}
            flexDirection="column"
          >
            <Typography sx={{ mb: 5, textAlign: 'center', fontWeight: 600 }}>
              2/2 Borrow <br />
              Finished
            </Typography>
            <CompleteIcon />
          </Box>
        ) : (
          <React.Fragment>
            <Typography sx={{ mt: 1, mb: 5, textAlign: 'center', fontWeight: 600 }}>
              1/2 Borrow
              <br />
              Please submit to borrow
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <LoadingButton
                size="large"
                variant="contained"
                fullWidth
                sx={{ height: 40 }}
                onClick={onBorrow}
                loading={isLoading}
              >
                Borrow
              </LoadingButton>
            </Box>
          </React.Fragment>
        )}
      </Box>
    </Box>
  );
};
