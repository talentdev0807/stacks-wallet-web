import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import AddFundsFull from '@assets/images/onboarding/steps/add-funds-light.png';
import AddFundsFullDone from '@assets/images/onboarding/steps/add-funds-light-done.png';
import AddFundsPopup from '@assets/images/onboarding/steps/add-funds-light-sm.png';
import AddFundsPopupDone from '@assets/images/onboarding/steps/add-funds-light-done-sm.png';
import { RouteUrls } from '@shared/route-urls';
import { useCurrentAccountAvailableStxBalance } from '@app/store/accounts/account.hooks';

import { SuggestedFirstStep } from './suggested-first-step';

const eventName = 'add_funds';

interface AddFundsStepProps {
  isComplete: boolean;
  onComplete(): void;
}
export function AddFundsStep({ isComplete, onComplete }: AddFundsStepProps) {
  const analytics = useAnalytics();
  const navigate = useNavigate();
  const availableStxBalance = useCurrentAccountAvailableStxBalance();

  useEffect(() => {
    if (availableStxBalance?.isGreaterThan(0)) onComplete();
  }, [availableStxBalance, onComplete]);

  const onSelectStep = useCallback(() => {
    void analytics.track('select_next_step', { step: eventName });
    navigate(RouteUrls.Fund);
  }, [analytics, navigate]);

  return (
    <SuggestedFirstStep
      action="Get STX"
      body="Get some STX so you can start using apps"
      imageFull={AddFundsFull}
      imageFullDone={AddFundsFullDone}
      imagePopup={AddFundsPopup}
      imagePopupDone={AddFundsPopupDone}
      isComplete={isComplete}
      key={eventName}
      onClick={onSelectStep}
      title="Add funds"
    />
  );
}
