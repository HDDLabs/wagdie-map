import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";

function writeToContract(
  contractAddress,
  contractAbi,
  functionName,
  args,
  handling,
  enabled
) {
  const { config: config } = usePrepareContractWrite({
    address: contractAddress,
    abi: contractAbi,
    functionName: functionName,
    args: args,
  });

  const { data: data, write: write } = useContractWrite({
    ...config,
    onSuccess: handling.onSuccess,
    onError: handling.onError,
  });

  const { isLoading: isLoading, isSuccess: isSuccess } = useWaitForTransaction({
    hash: data?.hash,
    confirmations: 1,
  });

  return {
    write,
    isLoading,
    isSuccess,
  };
}

export { writeToContract };
