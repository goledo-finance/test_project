import { InterestRate } from '@aave/contract-helpers';
import { createContext, useContext, useState } from 'react';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { TxErrorType } from 'src/ui-config/errorMapping';

export enum ModalType {
  Supply,
  Withdraw,
  Borrow,
  Repay,
  CollateralChange,
  RateSwitch,
  Stake,
  Unstake,
  StakeCooldown,
  StakeRewardClaim,
  ClaimRewards,
  Emode,
  Faucet,
  Swap,
  GovDelegation,
  GovVote,
  Deposite,
}

export interface ModalArgsType {
  underlyingAsset?: string;
  proposalId?: number;
  support?: boolean;
  power?: string;
  icon?: string;
  stakeAssetName?: string;
  currentRateMode?: InterestRate;
  type?: 'lock' | 'stake';
}

export type TxStateType = {
  txHash?: string;
  // txError?: string;
  loading?: boolean;
  success?: boolean;
};

export interface ModalContextType<T extends ModalArgsType> {
  openSupply: (underlyingAsset: string) => void;
  openWithdraw: (underlyingAsset: string) => void;
  openDeposit: (underlyingAsset: string) => void;
  openBorrow: (underlyingAsset: string) => void;
  openRepay: (underlyingAsset: string, currentRateMode: InterestRate) => void;
  openCollateralChange: (underlyingAsset: string) => void;
  openRateSwitch: (underlyingAsset: string, currentRateMode: InterestRate) => void;
  openStake: (type: 'lock' | 'stake') => void;
  openUnstake: (type: 'lock' | 'stake') => void;
  openStakeCooldown: (stakeAssetName: string) => void;
  openStakeRewardsClaim: (stakeAssetName: string) => void;
  openClaimRewards: () => void;
  openEmode: () => void;
  openFaucet: (underlyingAsset: string) => void;
  openSwap: (underlyingAsset: string) => void;
  openGovDelegation: () => void;
  openGovVote: (proposalId: number, support: boolean, power: string) => void;
  close: () => void;
  type?: ModalType;
  args: T;
  mainTxState: TxStateType;
  approvalTxState: TxStateType;
  setApprovalTxState: (data: TxStateType) => void;
  setMainTxState: (data: TxStateType) => void;
  gasLimit: string;
  setGasLimit: (limit: string) => void;
  loadingTxns: boolean;
  setLoadingTxns: (loading: boolean) => void;
  txError: TxErrorType | undefined;
  setTxError: (error: TxErrorType | undefined) => void;
  retryWithApproval: boolean;
  setRetryWithApproval: (permit: boolean) => void;
}

export const ModalContext = createContext<ModalContextType<ModalArgsType>>(
  {} as ModalContextType<ModalArgsType>
);

export const ModalContextProvider: React.FC = ({ children }) => {
  const { setSwitchNetworkError } = useWeb3Context();
  // contains the current modal open state if any
  const [type, setType] = useState<ModalType>();
  // contains arbitrary key-value pairs as a modal context
  const [args, setArgs] = useState<ModalArgsType>({});
  const [approvalTxState, setApprovalTxState] = useState<TxStateType>({});
  const [retryWithApproval, setRetryWithApproval] = useState<boolean>(false);
  const [mainTxState, setMainTxState] = useState<TxStateType>({});
  const [gasLimit, setGasLimit] = useState<string>('');
  const [loadingTxns, setLoadingTxns] = useState(false);
  const [txError, setTxError] = useState<TxErrorType>();

  return (
    <ModalContext.Provider
      value={{
        openSupply: (underlyingAsset) => {
          setType(ModalType.Supply);
          setArgs({ underlyingAsset });
        },
        openWithdraw: (underlyingAsset) => {
          setType(ModalType.Withdraw);
          setArgs({ underlyingAsset });
        },
        openDeposit: (underlyingAsset) => {
          setType(ModalType.Deposite);
          setArgs({ underlyingAsset });
        },
        openBorrow: (underlyingAsset) => {
          setType(ModalType.Borrow);
          setArgs({ underlyingAsset });
        },
        openRepay: (underlyingAsset, currentRateMode) => {
          setType(ModalType.Repay);
          setArgs({ underlyingAsset, currentRateMode });
        },
        openCollateralChange: (underlyingAsset) => {
          setType(ModalType.CollateralChange);
          setArgs({ underlyingAsset });
        },
        openRateSwitch: (underlyingAsset, currentRateMode) => {
          setType(ModalType.RateSwitch);
          setArgs({ underlyingAsset, currentRateMode });
        },
        openStake: (type) => {
          setType(ModalType.Stake);
          setArgs({ type });
        },
        openUnstake: (type) => {
          setType(ModalType.Unstake);
          setArgs({ type });
        },
        openStakeCooldown: (stakeAssetName) => {
          setType(ModalType.StakeCooldown);
          setArgs({ stakeAssetName });
        },
        openStakeRewardsClaim: (stakeAssetName) => {
          setType(ModalType.StakeRewardClaim);
          setArgs({ stakeAssetName });
        },
        openClaimRewards: () => {
          setType(ModalType.ClaimRewards);
        },
        openEmode: () => {
          setType(ModalType.Emode);
        },
        openFaucet: (underlyingAsset) => {
          setType(ModalType.Faucet);
          setArgs({ underlyingAsset });
        },
        openSwap: (underlyingAsset) => {
          setType(ModalType.Swap);
          setArgs({ underlyingAsset });
        },
        openGovDelegation: () => {
          setType(ModalType.GovDelegation);
        },
        openGovVote: (proposalId, support, power) => {
          setType(ModalType.GovVote);
          setArgs({ proposalId, support, power });
        },
        close: () => {
          setType(undefined);
          setArgs({});
          setMainTxState({});
          setApprovalTxState({});
          setGasLimit('');
          setTxError(undefined);
          setSwitchNetworkError(undefined);
          setRetryWithApproval(false);
        },
        type,
        args,
        approvalTxState,
        mainTxState,
        setApprovalTxState,
        setMainTxState,
        gasLimit,
        setGasLimit,
        loadingTxns,
        setLoadingTxns,
        txError,
        setTxError,
        retryWithApproval,
        setRetryWithApproval,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModalContext = () => {
  const context = useContext(ModalContext);

  if (context === undefined) {
    throw new Error('useModalContext must be used within a ModalProvider');
  }

  return context;
};
