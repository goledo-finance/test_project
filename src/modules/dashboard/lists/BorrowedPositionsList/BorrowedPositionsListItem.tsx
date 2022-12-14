import { InterestRate } from '@goledo-sdk/contract-helpers';
import { Trans } from '@lingui/macro';
import { Button } from '@mui/material';
import { useModalContext } from 'src/hooks/useModal';
import { useProtocolDataContext } from 'src/hooks/useProtocolDataContext';

import {
  ComputedUserReserveData,
  ReserveIncentiveData,
} from '../../../../hooks/app-data-provider/useAppDataProvider';
import { ListAPRColumn } from '../ListAPRColumn';
import { ListButtonsColumn } from '../ListButtonsColumn';
import { ListItemWrapper } from '../ListItemWrapper';
import { ListValueColumn } from '../ListValueColumn';

export const BorrowedPositionsListItem = ({
  reserve,
  variableBorrows,
  variableBorrowsUSD,
  stableBorrows,
  stableBorrowsUSD,
  borrowRateMode,
  stableBorrowAPY,
  reservesIncentives,
}: ComputedUserReserveData & {
  borrowRateMode: InterestRate;
  reservesIncentives: ReserveIncentiveData[];
}) => {
  const { openBorrow, openRepay } = useModalContext();
  const { currentMarket } = useProtocolDataContext();
  const { isActive, isFrozen, borrowingEnabled, variableBorrowAPY } = reserve;
  const incentives = reservesIncentives.find(
    (x) => x.tokenAddress.toLowerCase() === reserve.variableDebtTokenAddress.toLowerCase()
  );

  return (
    <ListItemWrapper
      symbol={reserve.symbol}
      iconSymbol={reserve.iconSymbol}
      name={reserve.name}
      detailsAddress={reserve.underlyingAsset}
      currentMarket={currentMarket}
      data-cy={`dashboardBorrowedListItem_${reserve.symbol.toUpperCase()}_${borrowRateMode}`}
    >
      <ListValueColumn
        symbol={reserve.symbol}
        value={Number(borrowRateMode === InterestRate.Variable ? variableBorrows : stableBorrows)}
        subValue={Number(
          borrowRateMode === InterestRate.Variable ? variableBorrowsUSD : stableBorrowsUSD
        )}
      />

      <ListAPRColumn
        value={Number(
          borrowRateMode === InterestRate.Variable ? variableBorrowAPY : stableBorrowAPY
        )}
        incentives={incentives}
        symbol={reserve.symbol}
      />

      <ListButtonsColumn>
        <Button
          sx={{ height: 32 }}
          disabled={!isActive}
          variant="contained"
          onClick={() => openRepay(reserve.underlyingAsset, borrowRateMode)}
        >
          <Trans>Repay</Trans>
        </Button>
        <Button
          sx={{ height: 32 }}
          disabled={!isActive || !borrowingEnabled || isFrozen}
          variant="outlined"
          onClick={() => openBorrow(reserve.underlyingAsset)}
        >
          <Trans>Borrow</Trans>
        </Button>
      </ListButtonsColumn>
    </ListItemWrapper>
  );
};
