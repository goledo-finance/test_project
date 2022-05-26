import { Box, Button, Typography } from '@mui/material';

import { ModalWrapperProps } from '../FlowCommons/ModalWrapper';
import { AInput } from '../Withdraw/WithdrawModalContent';
import { FormattedNumber } from 'src/components/primitives/FormattedNumber';

export const SupplyModalContent = ({
  symbol,
  onSubmit,
}: ModalWrapperProps & { onSubmit: () => Promise<void> }) => {
  return (
    <>
      <Typography variant="description" color={'#666'}>
        How much do you want to supply?
      </Typography>

      <Box display={'flex'} justifyContent="space-between" alignItems={'center'} mt={10}>
        <Typography variant="main14">Available to supply</Typography>
        <FormattedNumber
          variant="description"
          symbol="ETH"
          value={20.101}
          visibleDecimals={4}
          symbolsColor="#666"
          sx={{ color: '#666' }}
        />
      </Box>
      <AInput symbol={symbol} />
      <Button
        variant="contained"
        size="large"
        fullWidth
        sx={{ mt: 10, height: 40 }}
        onClick={onSubmit}
      >
        Continue
      </Button>
    </>
  );
};
