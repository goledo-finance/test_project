import { API_ETH_MOCK_ADDRESS } from '@aave/contract-helpers';
import { Trans } from '@lingui/macro';
import { useMediaQuery, useTheme } from '@mui/material';
import { useProtocolDataContext } from 'src/hooks/useProtocolDataContext';
import { fetchIconSymbolAndName } from 'src/ui-config/reservePatches';

import { ListWrapper } from '../../../../components/lists/ListWrapper';
import { useAppDataContext } from '../../../../hooks/app-data-provider/useAppDataProvider';
import { DashboardContentNoData } from '../../DashboardContentNoData';
import { ListHeader } from '../ListHeader';
import { ListLoader } from '../ListLoader';

import { RewardsListItem } from './RewardsListItem';
// import { SuppliedPositionsListMobileItem } from './SuppliedPositionsListMobileItem';

export const RewardsList = () => {
  const { loading } = useAppDataContext();
  //   const { currentNetworkConfig } = useProtocolDataContext();
  const theme = useTheme();
  const downToXSM = useMediaQuery(theme.breakpoints.down('xsm'));

  const data = [
    {
      underlyingAsset: 'Goledo',
      underlyingBalance: 20.04,
      underlyingBalanceUSD: 17.19,
      ...fetchIconSymbolAndName({
        symbol: 'Goledo',
        underlyingAsset: '',
      }),
      supplyAPR: 0.0111,
    },
    {
      underlyingAsset: 'GoledoFTM',
      underlyingBalance: 20.04,
      underlyingBalanceUSD: 17.19,
      ...fetchIconSymbolAndName({
        symbol: 'GoledoFTM',
        underlyingAsset: '',
      }),
      supplyAPR: 0.0111,
    },
  ];

  const head = [
    <Trans key="Balance">Balance</Trans>,
    <Trans key="APY">APR</Trans>,
    <Trans key="staked">Your staked balance</Trans>,
    <Trans key="locked">Your locked balance</Trans>,
  ];

  if (loading) return <ListLoader title={<Trans>Rewards</Trans>} head={head} assetsTitle={null} />;

  return (
    <ListWrapper
      title={<Trans>Rewards</Trans>}
      localStorageName="rewardsAssetsDashboardTableCollapse"
      noData={!data?.length}
    >
      {data.length ? (
        <>
          {!downToXSM && <ListHeader head={head} />}
          {data.map((item) =>
            downToXSM ? null : ( //   <SuppliedPositionsListMobileItem {...item} user={user} key={item.underlyingAsset} />
              <RewardsListItem {...item} key={item.underlyingAsset} />
            )
          )}
        </>
      ) : (
        <DashboardContentNoData text={<Trans>No Supplies</Trans>} />
      )}
    </ListWrapper>
  );
};