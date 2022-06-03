import { API_ETH_MOCK_ADDRESS } from '@goledo-sdk/contract-helpers';
import { USD_DECIMALS, valueToBigNumber } from '@goledo-sdk/math-utils';
import { Trans } from '@lingui/macro';
import { Button, Box, useMediaQuery, useTheme, SvgIcon, Alert } from '@mui/material';
import { useState } from 'react';
import { fetchIconSymbolAndName } from 'src/ui-config/reservePatches';
import LaunchIcon from '@mui/icons-material/Launch';

import { ListWrapper } from '../../../../components/lists/ListWrapper';
import { Link } from '../../../../components/primitives/Link';
import {
  ComputedReserveData,
  useAppDataContext,
} from '../../../../hooks/app-data-provider/useAppDataProvider';
import { useWalletBalances } from '../../../../hooks/app-data-provider/useWalletBalances';
import { useProtocolDataContext } from '../../../../hooks/useProtocolDataContext';
import { DashboardListTopPanel } from '../../DashboardListTopPanel';
import { ListHeader } from '../ListHeader';
import { ListLoader } from '../ListLoader';
import { SupplyAssetsListItem } from './SupplyAssetsListItem';
import { SupplyAssetsListMobileItem } from './SupplyAssetsListMobileItem';

export const SupplyAssetsList = () => {
  const { currentNetworkConfig } = useProtocolDataContext();
  const { reserves, marketReferencePriceInUsd, loading: loadingReserves } = useAppDataContext();
  const { walletBalances, loading } = useWalletBalances();
  const theme = useTheme();
  const downToXSM = useMediaQuery(theme.breakpoints.down('xsm'));

  console.log('walletBalances', walletBalances, loading);

  const { bridge, baseAssetSymbol, name: networkName } = currentNetworkConfig;

  const localStorageName = 'showSupplyZeroAssets';
  const [isShowZeroAssets, setIsShowZeroAssets] = useState(
    localStorage.getItem(localStorageName) === 'true'
  );

  const tokensToSupply = reserves
    .filter((reserve: ComputedReserveData) => !reserve.isFrozen)
    .map((reserve: ComputedReserveData) => {
      const walletBalance = walletBalances[reserve.underlyingAsset]?.amount;
      const walletBalanceUSD = walletBalances[reserve.underlyingAsset]?.amountUSD;

      const availableToDeposit = valueToBigNumber(walletBalance);
      const availableToDepositUSD = valueToBigNumber(availableToDeposit)
        .multipliedBy(reserve.priceInEth)
        .multipliedBy(marketReferencePriceInUsd)
        .shiftedBy(-USD_DECIMALS)
        .toString();
      console.log(
        'usd',
        reserve.name,
        walletBalance?.toString(),
        availableToDeposit?.toString(),
        reserve.priceInEth,
        marketReferencePriceInUsd
      );

      const usageAsCollateralEnabledOnUser = reserve.usageAsCollateralEnabled;
      if (reserve.isWrappedBaseAsset) {
        const baseAvailableToDeposit = valueToBigNumber(
          walletBalances[API_ETH_MOCK_ADDRESS.toLowerCase()]?.amount
        );
        const baseAvailableToDepositUSD = valueToBigNumber(baseAvailableToDeposit)
          .multipliedBy(reserve.priceInEth)
          .multipliedBy(marketReferencePriceInUsd)
          .shiftedBy(-USD_DECIMALS)
          .toString();
        return [
          {
            ...reserve,
            underlyingAsset: API_ETH_MOCK_ADDRESS.toLowerCase(),
            ...fetchIconSymbolAndName({
              symbol: baseAssetSymbol,
              underlyingAsset: API_ETH_MOCK_ADDRESS.toLowerCase(),
            }),
            walletBalance: walletBalances[API_ETH_MOCK_ADDRESS.toLowerCase()]?.amount,
            walletBalanceUSD: walletBalances[API_ETH_MOCK_ADDRESS.toLowerCase()]?.amountUSD,
            availableToDeposit: baseAvailableToDeposit.toString(),
            availableToDepositUSD: baseAvailableToDepositUSD,
            usageAsCollateralEnabledOnUser,
            detailsAddress: reserve.underlyingAsset,
            id: reserve.id + 'base',
          },
          {
            ...reserve,
            walletBalance,
            walletBalanceUSD,
            availableToDeposit:
              availableToDeposit.toNumber() <= 0 ? '0' : availableToDeposit.toString(),
            availableToDepositUSD:
              Number(availableToDepositUSD) <= 0 ? '0' : availableToDepositUSD.toString(),
            usageAsCollateralEnabledOnUser,
            detailsAddress: reserve.underlyingAsset,
          },
        ];
      }

      return {
        ...reserve,
        walletBalance,
        walletBalanceUSD,
        availableToDeposit:
          availableToDeposit.toNumber() <= 0 ? '0' : availableToDeposit.toString(),
        availableToDepositUSD:
          Number(availableToDepositUSD) <= 0 ? '0' : availableToDepositUSD.toString(),
        usageAsCollateralEnabledOnUser,
        detailsAddress: reserve.underlyingAsset,
      };
    })
    .flat();

  const sortedSupplyReserves = tokensToSupply.sort((a, b) =>
    +a.walletBalanceUSD > +b.walletBalanceUSD ? -1 : 1
  );
  const filteredSupplyReserves = sortedSupplyReserves.filter((reserve) => {
    console.log('filter', reserve.name, reserve.availableToDepositUSD);
    return reserve.availableToDepositUSD !== '0';
  });

  const supplyReserves = isShowZeroAssets
    ? sortedSupplyReserves
    : filteredSupplyReserves.length >= 1
    ? filteredSupplyReserves
    : sortedSupplyReserves;

  const head = [
    <Trans key="Balance">Balance</Trans>,
    <Trans key="APY">APY</Trans>,
    <Trans key="Can be collateral">Can be collateral</Trans>,
  ];

  if (loadingReserves || loading)
    return <ListLoader title={<Trans>Assets to Deposit</Trans>} head={head} withTopMargin />;

  return (
    <ListWrapper
      title={<Trans>Assets to Deposit</Trans>}
      localStorageName="depositAssetsDashboardTableCollapse"
      withTopMargin
      subChildrenComponent={
        <>
          {/* TODO: 是否需要？ */}
          {
            <Box sx={{ px: 6 }}>
              {filteredSupplyReserves.length === 0 && (
                <Alert severity="info">
                  <Trans>Your {networkName} wallet is empty. Purchase or transfer assets</Trans>{' '}
                  {bridge && (
                    <Trans>
                      or use {<Link href={bridge.url}>{bridge.name}</Link>} to transfer your ETH
                      assets.
                    </Trans>
                  )}
                </Alert>
              )}
            </Box>
          }
          <Box
            sx={{
              display: 'flex',
              direction: 'row',
              justifyContent: filteredSupplyReserves.length >= 1 ? 'space-between' : 'end',
              alignItems: 'center',
            }}
          >
            {filteredSupplyReserves.length >= 1 && (
              <DashboardListTopPanel
                value={isShowZeroAssets}
                onClick={setIsShowZeroAssets}
                localStorageName={localStorageName}
                bridge={bridge}
              />
            )}
            <Button
              sx={{ mx: 6 }}
              size="small"
              variant="outlined"
              startIcon={
                <img
                  alt="eth logo"
                  width="14px"
                  height="14px"
                  src={'/icons/networks/ethereum.svg'}
                />
              }
              endIcon={
                <SvgIcon sx={{ fontSize: '12px' }}>
                  <LaunchIcon />
                </SvgIcon>
              }
            >
              Ethereum Bridge
            </Button>
          </Box>
        </>
      }
    >
      <>
        {!downToXSM && <ListHeader head={head} />}
        {supplyReserves.map((item) =>
          downToXSM ? (
            <SupplyAssetsListMobileItem {...item} key={item.id} />
          ) : (
            <SupplyAssetsListItem {...item} key={item.id} />
          )
        )}
      </>
    </ListWrapper>
  );
};
