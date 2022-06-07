import BigNumber from 'bignumber.js';
import {
  BigNumberValue,
  normalize,
  normalizeBN,
  valueToBigNumber,
  valueToZDBigNumber,
} from '../../bignumber';
import { RAY_DECIMALS, SECONDS_PER_YEAR, USD_DECIMALS } from '../../constants';
import { LTV_PRECISION, RAY, rayPow } from '../../index';
import {
  calculateReserveIncentives,
  CalculateReserveIncentivesResponse,
} from '../incentive/calculate-reserve-incentives';
import { ReservesIncentiveDataHumanized } from '../incentive/types';
import { nativeToUSD } from '../usd/native-to-usd';
import { calculateReserveDebt } from './calculate-reserve-debt';

export interface FormatReserveResponse extends ReserveData {
  formattedBaseLTVasCollateral: string;
  formattedReserveLiquidationThreshold: string;
  formattedReserveLiquidationBonus: string;
  formattedAvailableLiquidity: string;
  totalDebt: string;
  totalVariableDebt: string;
  totalStableDebt: string;
  totalLiquidity: string;
  borrowUsageRatio: string;
  supplyUsageRatio: string;
  supplyAPY: string;
  variableBorrowAPY: string;
  stableBorrowAPY: string;
  unborrowedLiquidity: string;
  supplyAPR: string;
  variableBorrowAPR: string;
  stableBorrowAPR: string;
}

export interface FormatReserveRequest {
  reserve: ReserveData;
  currentTimestamp: number;
}

export interface ReserveData {
  id: string;
  symbol: string;
  name: string;
  decimals: number;
  underlyingAsset: string;
  usageAsCollateralEnabled: boolean;
  reserveFactor: string;
  baseLTVasCollateral: string;
  averageStableRate: string;
  stableDebtLastUpdateTimestamp: number;
  liquidityIndex: string;
  reserveLiquidationThreshold: string;
  reserveLiquidationBonus: string;
  variableBorrowIndex: string;
  variableBorrowRate: string;
  availableLiquidity: string;
  stableBorrowRate: string;
  liquidityRate: string;
  totalPrincipalStableDebt: string;
  totalScaledVariableDebt: string;
  lastUpdateTimestamp: number;
}

interface GetComputedReserveFieldsResponse {
  formattedReserveLiquidationBonus: string;
  formattedAvailableLiquidity: BigNumber;
  totalDebt: BigNumber;
  totalStableDebt: BigNumber;
  totalVariableDebt: BigNumber;
  totalLiquidity: BigNumber;
  borrowUsageRatio: string;
  supplyUsageRatio: string;
  supplyAPY: BigNumber;
  variableBorrowAPY: BigNumber;
  stableBorrowAPY: BigNumber;
  unborrowedLiquidity: string;
}

/**
 * @description accrues interest and adds computed fields
 */
function getComputedReserveFields({
  reserve,
  currentTimestamp,
}: FormatReserveRequest): GetComputedReserveFieldsResponse {
  const { totalDebt, totalStableDebt, totalVariableDebt, totalLiquidity } = calculateReserveDebt(
    reserve,
    currentTimestamp
  );
  const borrowUsageRatio = totalLiquidity.eq(0)
    ? '0'
    : valueToBigNumber(totalDebt).dividedBy(totalLiquidity).toFixed();
  const supplyUsageRatio = totalLiquidity.eq(0)
    ? '0'
    : valueToBigNumber(totalDebt).dividedBy(totalLiquidity).toFixed();
  // https://github.com/aave/protocol-v2/blob/baeb455fad42d3160d571bd8d3a795948b72dd85/contracts/protocol/lendingpool/LendingPoolConfigurator.sol#L284
  const reserveLiquidationBonus = normalize(
    valueToBigNumber(reserve.reserveLiquidationBonus).minus(10 ** LTV_PRECISION),
    LTV_PRECISION
  );

  /**
   * availableLiquidity returned by the helper is the amount of unborrowed tokens
   * the actual availableLiquidity might be lower due to borrowCap
   */
  const availableLiquidity = new BigNumber(reserve.availableLiquidity);

  const supplyAPY = rayPow(
    valueToZDBigNumber(reserve.liquidityRate).dividedBy(SECONDS_PER_YEAR).plus(RAY),
    SECONDS_PER_YEAR
  ).minus(RAY);

  const variableBorrowAPY = rayPow(
    valueToZDBigNumber(reserve.variableBorrowRate).dividedBy(SECONDS_PER_YEAR).plus(RAY),
    SECONDS_PER_YEAR
  ).minus(RAY);

  const stableBorrowAPY = rayPow(
    valueToZDBigNumber(reserve.stableBorrowRate).dividedBy(SECONDS_PER_YEAR).plus(RAY),
    SECONDS_PER_YEAR
  ).minus(RAY);

  return {
    totalDebt,
    totalStableDebt,
    totalVariableDebt,
    totalLiquidity,
    borrowUsageRatio,
    supplyUsageRatio,
    formattedReserveLiquidationBonus: reserveLiquidationBonus,
    supplyAPY,
    variableBorrowAPY,
    stableBorrowAPY,
    formattedAvailableLiquidity: availableLiquidity,
    unborrowedLiquidity: reserve.availableLiquidity,
  };
}

interface FormatEnhancedReserveRequest {
  reserve: ReserveData & GetComputedReserveFieldsResponse;
}
/**
 * @description normalizes reserve values & computed fields
 */
function formatEnhancedReserve({ reserve }: FormatEnhancedReserveRequest): FormatReserveResponse {
  const normalizeWithReserve = (n: BigNumberValue) => normalize(n, reserve.decimals);

  return {
    ...reserve,
    totalVariableDebt: normalizeWithReserve(reserve.totalVariableDebt),
    totalStableDebt: normalizeWithReserve(reserve.totalStableDebt),
    totalLiquidity: normalizeWithReserve(reserve.totalLiquidity),
    formattedAvailableLiquidity: normalizeWithReserve(reserve.availableLiquidity),
    unborrowedLiquidity: normalizeWithReserve(reserve.unborrowedLiquidity),
    borrowUsageRatio: reserve.borrowUsageRatio,
    supplyUsageRatio: reserve.supplyUsageRatio,
    totalDebt: normalizeWithReserve(reserve.totalDebt),
    formattedBaseLTVasCollateral: normalize(reserve.baseLTVasCollateral, LTV_PRECISION),
    reserveFactor: normalize(reserve.reserveFactor, LTV_PRECISION),
    supplyAPY: normalize(reserve.supplyAPY, RAY_DECIMALS),
    supplyAPR: normalize(reserve.liquidityRate, RAY_DECIMALS),
    variableBorrowAPY: normalize(reserve.variableBorrowAPY, RAY_DECIMALS),
    variableBorrowAPR: normalize(reserve.variableBorrowRate, RAY_DECIMALS),
    stableBorrowAPY: normalize(reserve.stableBorrowAPY, RAY_DECIMALS),
    stableBorrowAPR: normalize(reserve.stableBorrowRate, RAY_DECIMALS),
    formattedReserveLiquidationThreshold: normalize(reserve.reserveLiquidationThreshold, 4),
    formattedReserveLiquidationBonus: normalize(
      valueToBigNumber(reserve.reserveLiquidationBonus).minus(10 ** LTV_PRECISION),
      4
    ),
    totalScaledVariableDebt: normalizeWithReserve(reserve.totalScaledVariableDebt),
    totalPrincipalStableDebt: normalizeWithReserve(reserve.totalPrincipalStableDebt),
  };
}

/**
 * @description computes additional fields and normalizes numbers into human readable decimals
 */
export function formatReserve({
  reserve,
  currentTimestamp,
}: FormatReserveRequest): FormatReserveResponse {
  const computedFields = getComputedReserveFields({
    reserve,
    currentTimestamp,
  });
  return formatEnhancedReserve({ reserve: { ...reserve, ...computedFields } });
}

export type ReserveDataWithPrice = ReserveData & {
  priceInEth: string;
};

export interface FormatReserveUSDRequest {
  reserve: ReserveDataWithPrice;
  currentTimestamp: number;
  marketReferencePriceInUsd: string;
  marketReferenceCurrencyDecimals: number;
}

export interface FormatReserveUSDResponse extends FormatReserveResponse {
  totalLiquidityUSD: string;
  availableLiquidityUSD: string;
  totalDebtUSD: string;
  totalVariableDebtUSD: string;
  totalStableDebtUSD: string;
  priceInEth: string;
  formattedPriceInETH: string;
  priceInUSD: string;
}

/**
 * @description computes additional fields and normalizes numbers into human readable decimals
 * In addition to that it also converts the numbers to USD
 */
export function formatReserveUSD({
  reserve,
  currentTimestamp,
  marketReferencePriceInUsd,
  marketReferenceCurrencyDecimals,
}: FormatReserveUSDRequest): FormatReserveUSDResponse {
  const normalizedMarketReferencePriceInUsd = normalizeBN(marketReferencePriceInUsd, USD_DECIMALS);

  const computedFields = getComputedReserveFields({
    reserve,
    currentTimestamp,
  });
  const formattedReserve = formatEnhancedReserve({
    reserve: { ...reserve, ...computedFields },
  });

  return {
    ...formattedReserve,
    totalLiquidityUSD: nativeToUSD({
      amount: computedFields.totalLiquidity,
      currencyDecimals: reserve.decimals,
      marketReferenceCurrencyDecimals,
      priceInEth: reserve.priceInEth,
      normalizedMarketReferencePriceInUsd,
    }),
    availableLiquidityUSD: nativeToUSD({
      amount: computedFields.formattedAvailableLiquidity,
      currencyDecimals: reserve.decimals,
      marketReferenceCurrencyDecimals,
      priceInEth: reserve.priceInEth,
      normalizedMarketReferencePriceInUsd,
    }),
    totalDebtUSD: nativeToUSD({
      amount: computedFields.totalDebt,
      currencyDecimals: reserve.decimals,
      marketReferenceCurrencyDecimals,
      priceInEth: reserve.priceInEth,
      normalizedMarketReferencePriceInUsd,
    }),
    totalVariableDebtUSD: nativeToUSD({
      amount: computedFields.totalVariableDebt,
      currencyDecimals: reserve.decimals,
      marketReferenceCurrencyDecimals,
      priceInEth: reserve.priceInEth,
      normalizedMarketReferencePriceInUsd,
    }),
    totalStableDebtUSD: nativeToUSD({
      amount: computedFields.totalStableDebt,
      currencyDecimals: reserve.decimals,
      marketReferenceCurrencyDecimals,
      priceInEth: reserve.priceInEth,
      normalizedMarketReferencePriceInUsd,
    }),
    // isolationModeTotalDebtUSD: nativeToUSD({
    //   amount: computedFields.totalStableDebt,
    //   currencyDecimals: reserve.decimals,
    //   marketReferenceCurrencyDecimals,
    //   priceInEth: reserve.priceInEth,
    //   marketReferencePriceInUsd,
    // }),
    formattedPriceInETH: normalize(reserve.priceInEth, marketReferenceCurrencyDecimals),
    priceInEth: reserve.priceInEth,
    priceInUSD: nativeToUSD({
      amount: new BigNumber(1).shiftedBy(reserve.decimals),
      currencyDecimals: reserve.decimals,
      marketReferenceCurrencyDecimals,
      priceInEth: reserve.priceInEth,
      normalizedMarketReferencePriceInUsd,
    }),
  };
}

export interface FormatReservesUSDRequest<T extends ReserveDataWithPrice> {
  reserves: T[];
  currentTimestamp: number;
  marketReferencePriceInUsd: string;
  marketReferenceCurrencyDecimals: number;
}

export function formatReserves<T extends ReserveDataWithPrice>({
  reserves,
  currentTimestamp,
  marketReferencePriceInUsd,
  marketReferenceCurrencyDecimals,
}: FormatReservesUSDRequest<T>) {
  return reserves.map((reserve) => {
    const formattedReserve = formatReserveUSD({
      reserve,
      currentTimestamp,
      marketReferencePriceInUsd,
      marketReferenceCurrencyDecimals,
    });
    return { ...reserve, ...formattedReserve };
  });
}

export interface FormatReservesAndIncentivesUSDRequest<T extends ReserveDataWithPrice>
  extends FormatReservesUSDRequest<T & { underlyingAsset: string }> {
  reserveIncentives: ReservesIncentiveDataHumanized[];
}

export function formatReservesAndIncentives<T extends ReserveDataWithPrice>({
  reserves,
  currentTimestamp,
  marketReferencePriceInUsd,
  marketReferenceCurrencyDecimals,
  reserveIncentives,
}: FormatReservesAndIncentivesUSDRequest<T>): Array<
  FormatReserveUSDResponse & T & Partial<CalculateReserveIncentivesResponse>
> {
  const formattedReserves = formatReserves<T & { underlyingAsset: string }>({
    reserves,
    currentTimestamp,
    marketReferenceCurrencyDecimals,
    marketReferencePriceInUsd,
  });
  return formattedReserves.map((reserve) => {
    const reserveIncentive = reserveIncentives.find(
      (reserveIncentive) => reserveIncentive.underlyingAsset === reserve.underlyingAsset
    );
    if (!reserveIncentive) return reserve;
    const incentive = calculateReserveIncentives({
      reserves: formattedReserves,
      reserveIncentiveData: reserveIncentive,
      totalLiquidity: normalize(reserve.totalLiquidity, -reserve.decimals),
      totalVariableDebt: normalize(reserve.totalVariableDebt, -reserve.decimals),
      totalStableDebt: normalize(reserve.totalStableDebt, -reserve.decimals),
      priceInEth: reserve.formattedPriceInETH,
      decimals: reserve.decimals,
      marketReferenceCurrencyDecimals,
    });
    return { ...reserve, ...incentive };
  });
}