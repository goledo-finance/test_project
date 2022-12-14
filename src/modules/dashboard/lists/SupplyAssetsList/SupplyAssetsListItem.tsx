import { Trans } from '@lingui/macro';
import { Button } from '@mui/material';
import { useModalContext } from 'src/hooks/useModal';
import { useProtocolDataContext } from 'src/hooks/useProtocolDataContext';

import { CapsHint } from '../../../../components/caps/CapsHint';
import { CapType } from '../../../../components/caps/helper';
import { ListColumn } from '../../../../components/lists/ListColumn';
import { Link, ROUTES } from '../../../../components/primitives/Link';
import { ListAPRColumn } from '../ListAPRColumn';
import { ListButtonsColumn } from '../ListButtonsColumn';
import { ListItemCanBeCollateral } from '../ListItemCanBeCollateral';
import { ListItemWrapper } from '../ListItemWrapper';
import { ListValueColumn } from '../ListValueColumn';
import { SupplyAssetsItem } from './types';

export const SupplyAssetsListItem = ({
  symbol,
  iconSymbol,
  name,
  walletBalance,
  walletBalanceUSD,
  totalLiquidity,
  supplyAPY,
  reservesIncentives,
  underlyingAsset,
  isActive,
  isFreezed,
  aTokenAddress,
  usageAsCollateralEnabledOnUser,
  detailsAddress,
}: SupplyAssetsItem) => {
  const { currentMarket } = useProtocolDataContext();
  const { openSupply } = useModalContext();
  const incentives = reservesIncentives.find(
    (x) => x.tokenAddress.toLowerCase() === aTokenAddress.toLowerCase()
  );
  return (
    <ListItemWrapper
      symbol={symbol}
      iconSymbol={iconSymbol}
      name={name}
      detailsAddress={detailsAddress}
      data-cy={`dashboardSupplyListItem_${symbol.toUpperCase()}`}
      currentMarket={currentMarket}
    >
      <ListValueColumn
        symbol={symbol}
        value={walletBalance}
        subValue={walletBalanceUSD}
        withTooltip
        disabled={walletBalance === '0'}
        capsComponent={
          <CapsHint
            capType={CapType.supplyCap}
            capAmount={'0'}
            totalAmount={totalLiquidity}
            withoutText
          />
        }
      />

      <ListAPRColumn value={Number(supplyAPY)} incentives={incentives} symbol={symbol} />

      <ListColumn>
        <ListItemCanBeCollateral
          isIsolated={false}
          usageAsCollateralEnabled={usageAsCollateralEnabledOnUser}
        />
      </ListColumn>

      <ListButtonsColumn>
        <Button
          sx={{ height: 32 }}
          disabled={!isActive || isFreezed || Number(walletBalance) <= 0}
          variant="contained"
          onClick={() => openSupply(underlyingAsset)}
        >
          <Trans>Supply</Trans>
        </Button>
        <Button
          sx={{ height: 32 }}
          variant="outlined"
          component={Link}
          href={ROUTES.reserveOverview(detailsAddress, currentMarket)}
        >
          <Trans>Details</Trans>
        </Button>
      </ListButtonsColumn>
    </ListItemWrapper>
  );
};
