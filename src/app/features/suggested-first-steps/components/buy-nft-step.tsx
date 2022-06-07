import { useCallback, useEffect } from 'react';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { openInNewTab } from '@app/common/utils/open-in-new-tab';
import BuyNftFull from '@assets/images/onboarding/steps/buy-nft-light.png';
import BuyNftFullDone from '@assets/images/onboarding/steps/buy-nft-light-done.png';
import BuyNftPopup from '@assets/images/onboarding/steps/buy-nft-light-sm.png';
import BuyNftPopupDone from '@assets/images/onboarding/steps/buy-nft-light-done-sm.png';
import { useCurrentAccountUnanchoredBalances } from '@app/query/balance/balance.hooks';

import { SuggestedFirstStep } from './suggested-first-step';

const buyNftExternalRoute = 'https://www.hiro.so/wallet-faq/nfts';
const eventName = 'buy_nft';

interface BuyNftStepStepProps {
  isComplete: boolean;
  onComplete(): void;
}
export function BuyNftStep({ isComplete, onComplete }: BuyNftStepStepProps) {
  const analytics = useAnalytics();
  const { data: balances } = useCurrentAccountUnanchoredBalances();

  useEffect(() => {
    if (balances && Object.keys(balances?.non_fungible_tokens).length > 0) onComplete();
  }, [balances, balances?.non_fungible_tokens, onComplete]);

  const onSelectStep = useCallback(() => {
    void analytics.track('select_next_step', { step: eventName });
    openInNewTab(buyNftExternalRoute);
  }, [analytics]);

  return (
    <SuggestedFirstStep
      action="Find NFT"
      body="Collect and trade NFTs secured by Bitcoin"
      imageFull={BuyNftFull}
      imageFullDone={BuyNftFullDone}
      imagePopup={BuyNftPopup}
      imagePopupDone={BuyNftPopupDone}
      isComplete={isComplete}
      isExternalRoute
      key={eventName}
      onClick={onSelectStep}
      title="Buy an NFT"
    />
  );
}
