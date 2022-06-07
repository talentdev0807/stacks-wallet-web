import { useQueries, useQuery } from 'react-query';

import { useCurrentNetwork } from '@app/common/hooks/use-current-network';
import { SoftwareWalletAccountWithAddress } from '@app/store/accounts/account.models';
import { Api, useApi } from '@app/store/common/api-clients.hooks';

function fetchNonFungibleTokenHoldings(api: Api) {
  return (address?: string) => async () => {
    if (!address) return;
    return api.nonFungibleTokensApi.getNftHoldings({ principal: address, limit: 50 });
  };
}

export function useGetNonFungibleTokenHoldingsQuery(address: string | undefined) {
  const api = useApi();
  const network = useCurrentNetwork();

  return useQuery({
    queryKey: ['get-nft-holdings', address, network.url],
    queryFn: fetchNonFungibleTokenHoldings(api)(address),
  });
}

export function useGetNonFungibleTokenHoldingsListQuery(
  accounts: SoftwareWalletAccountWithAddress[] | undefined
) {
  const api = useApi();
  const network = useCurrentNetwork();

  return useQueries(
    (accounts || []).map(account => ({
      queryKey: ['get-ft-metadata', account.address, network.url],
      queryFn: fetchNonFungibleTokenHoldings(api)(account.address),
    }))
  );
}
