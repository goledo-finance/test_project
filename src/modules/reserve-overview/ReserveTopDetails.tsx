import { ExternalLinkIcon } from '@heroicons/react/outline';
import { Trans } from '@lingui/macro';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackOutlined';
import { Box, Button, Skeleton, SvgIcon, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useRouter } from 'next/router';
// import { getMarketInfoById, MarketLogo } from 'src/components/MarketSwitcher';
import { FormattedNumber } from 'src/components/primitives/FormattedNumber';
import { Link } from 'src/components/primitives/Link';
import { useProtocolDataContext } from 'src/hooks/useProtocolDataContext';
// import { NetAPYTooltip } from 'src/components/infoTooltips/NetAPYTooltip';

import { TopInfoPanel } from '../../components/TopInfoPanel/TopInfoPanel';
import { TopInfoPanelItem } from '../../components/TopInfoPanel/TopInfoPanelItem';
import {
  ComputedReserveData,
  useAppDataContext,
} from '../../hooks/app-data-provider/useAppDataProvider';

import CubeIcon from '../../../public/icons/markets/cube-icon.svg';
import PieIcon from '../../../public/icons/markets/pie-icon.svg';
import UptrendIcon from '../../../public/icons/markets/uptrend-icon.svg';
import DollarIcon from '../../../public/icons/markets/dollar-icon.svg';

interface ReserveTopDetailsProps {
  underlyingAsset: string;
}

export const ReserveTopDetails = ({ underlyingAsset }: ReserveTopDetailsProps) => {
  const router = useRouter();
  const { reserves, loading } = useAppDataContext();
  const { currentNetworkConfig } = useProtocolDataContext();

  const theme = useTheme();
  const downToSM = useMediaQuery(theme.breakpoints.down('sm'));

  const poolReserve = reserves.find(
    (reserve) => reserve.underlyingAsset === underlyingAsset
  ) as ComputedReserveData;

  const valueTypographyVariant = downToSM ? 'main16' : 'main21';
  const symbolsTypographyVariant = downToSM ? 'secondary16' : 'secondary21';

  const ReserveIcon = () => {
    return (
      <Box mr={3} sx={{ mr: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {loading ? (
          <Skeleton variant="circular" width={40} height={40} sx={{ background: '#383D51' }} />
        ) : (
          <img
            src={`/icons/tokens/${poolReserve.iconSymbol.toLowerCase()}.svg`}
            width="40px"
            height="40px"
            alt=""
          />
        )}
      </Box>
    );
  };

  const ReserveName = () => {
    return loading ? (
      <Skeleton width={60} height={28} sx={{ background: '#383D51' }} />
    ) : (
      <Typography variant={valueTypographyVariant}>{poolReserve.name}</Typography>
    );
  };

  return (
    <TopInfoPanel
      bridge={[]}
      titleComponent={
        <Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: downToSM ? 'flex-start' : 'center',
              alignSelf: downToSM ? 'flex-start' : 'center',
              mb: 4,
              minHeight: '40px',
              flexDirection: downToSM ? 'column' : 'row',
            }}
          >
            <Button
              variant="surface"
              size="medium"
              color="primary"
              startIcon={
                <SvgIcon sx={{ fontSize: '20px' }}>
                  <ArrowBackRoundedIcon />
                </SvgIcon>
              }
              onClick={() => {
                // https://github.com/vercel/next.js/discussions/34980
                if (history.state.idx !== 0) router.back();
                else router.push('/markets');
              }}
              sx={{ mr: 3, mb: downToSM ? '24px' : '0' }}
            >
              <Trans>Go Back</Trans>
            </Button>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="subheader1" sx={{ fontSize: 36, color: 'common.white' }}>
                <Trans>Overview</Trans>
              </Typography>
            </Box>
          </Box>
        </Box>
      }
    >
      {!downToSM && (
        <TopInfoPanelItem
          title={!loading && <Trans>{poolReserve.symbol}</Trans>}
          withoutIconWrapper
          icon={<ReserveIcon />}
          loading={loading}
        >
          <Box sx={{ display: 'inline-flex' }}>
            <ReserveName />
            {loading ? (
              <Skeleton width={16} height={16} sx={{ ml: 1, background: '#383D51' }} />
            ) : (
              <Link
                href={currentNetworkConfig.explorerLinkBuilder({
                  address: poolReserve?.underlyingAsset,
                })}
                sx={{ display: 'inline-flex', alignItems: 'center', ml: 1, color: '#A5A8B6' }}
              >
                <SvgIcon sx={{ fontSize: '16px' }}>
                  <ExternalLinkIcon />
                </SvgIcon>
              </Link>
            )}
          </Box>
        </TopInfoPanelItem>
      )}

      <TopInfoPanelItem icon={<CubeIcon />} title={<Trans>Total Amount</Trans>} loading={loading}>
        <FormattedNumber
          value={poolReserve?.totalLiquidity}
          variant={valueTypographyVariant}
          symbolsVariant={symbolsTypographyVariant}
          symbolsColor="#fff"
        />
        <FormattedNumber
          value={poolReserve?.totalLiquidityUSD}
          symbol="USD"
          variant={valueTypographyVariant}
          symbolsVariant={symbolsTypographyVariant}
          symbolsColor="#ccc"
          sx={{
            fontSize: 12,
            color: '#ccc',
            span: {
              fontSize: 12,
            },
          }}
        />
      </TopInfoPanelItem>

      <TopInfoPanelItem
        icon={<PieIcon />}
        title={<Trans>Available liquidity</Trans>}
        loading={loading}
      >
        <FormattedNumber
          value={poolReserve?.formattedAvailableLiquidity}
          variant={valueTypographyVariant}
          symbolsVariant={symbolsTypographyVariant}
          symbolsColor="#A5A8B6"
        />
        <FormattedNumber
          value={poolReserve?.availableLiquidityUSD}
          symbol="USD"
          variant={valueTypographyVariant}
          symbolsVariant={symbolsTypographyVariant}
          symbolsColor="#ccc"
          sx={{
            fontSize: 12,
            color: '#ccc',
            span: {
              fontSize: 12,
            },
          }}
        />
      </TopInfoPanelItem>

      <TopInfoPanelItem
        icon={<UptrendIcon />}
        title={
          <div style={{ display: 'flex' }}>
            <Trans>Utilization Rate</Trans>
            {/* <NetAPYTooltip /> */}
          </div>
        }
        loading={loading}
      >
        <FormattedNumber
          value={poolReserve?.borrowUsageRatio}
          variant={valueTypographyVariant}
          visibleDecimals={2}
          percent
          symbolsColor="#fff"
          symbolsVariant={'tooltip'}
          sx={{ span: { fontSize: 21 } }}
        />
      </TopInfoPanelItem>

      <TopInfoPanelItem icon={<DollarIcon />} title={<Trans>Oracle price</Trans>} loading={loading}>
        <Box sx={{ display: 'inline-flex' }}>
          <FormattedNumber
            value={poolReserve?.formattedPriceInETH}
            symbol="USD"
            variant={valueTypographyVariant}
            symbolsVariant={symbolsTypographyVariant}
            symbolsColor="#A5A8B6"
          />
          {loading ? (
            <Skeleton width={16} height={16} sx={{ ml: 1, background: '#383D51' }} />
          ) : (
            <Link
              href={currentNetworkConfig.explorerLinkBuilder({
                address: poolReserve?.underlyingAsset,
              })}
              sx={{ display: 'inline-flex', alignItems: 'center', ml: 1, color: '#A5A8B6' }}
            >
              <SvgIcon sx={{ fontSize: '16px' }}>
                <ExternalLinkIcon />
              </SvgIcon>
            </Link>
          )}
        </Box>
      </TopInfoPanelItem>
    </TopInfoPanel>
  );
};
