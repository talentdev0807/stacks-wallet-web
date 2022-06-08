import { getPayloadFromToken } from '@app/store/transactions/utils';

import { formatPostConditionState } from '@app/store/transactions/post-conditions';
import { FungibleConditionCode, parsePrincipalString } from '@stacks/transactions';
import { HEYSTACK_HEY_TX_REQUEST, HEYSTACK_HEY_TX_REQUEST_DECODED } from '@tests/mocks';

describe(formatPostConditionState.name, () => {
  it('formats the post condition correctly', () => {
    const payload = getPayloadFromToken(HEYSTACK_HEY_TX_REQUEST);
    const result = formatPostConditionState(payload, 'ST2PHCPANVT8DVPSY5W2ZZ81M285Q5Z8Y6DQMZE7Z');
    expect(result).toBeTruthy();
    expect(result!.length).toEqual(1);
    expect(result![0].conditionCode).toEqual(FungibleConditionCode.Equal);
    expect(result![0].principal).toEqual(
      parsePrincipalString(HEYSTACK_HEY_TX_REQUEST_DECODED.stxAddress)
    );
    expect((result![0] as any).assetInfo.contractName.content).toEqual('hey-token');
  });
});
