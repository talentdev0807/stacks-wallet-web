import { useCallback, useState } from 'react';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useAppDispatch } from '@app/store';
import { onboardingActions } from '@app/store/onboarding/onboarding.actions';
import {
  useExploreAppsStepStatus,
  useHideSuggestedFirstSteps,
} from '@app/store/onboarding/onboarding.selectors';
import { useAccounts } from '@app/store/accounts/account.hooks';

import { SuggestedFirstStepsLayout } from './suggested-first-steps.layout';
import { AddFundsStep } from './components/add-funds-step';
import { BackUpSecretKeyStep } from './components/back-up-secret-key-step';
import { ExploreAppsStep } from './components/explore-apps-step';
import { BuyNftStep } from './components/buy-nft-step';

export function SuggestedFirstSteps() {
  const [hasCompletedBackUpSecretKeyStep, setHasCompletedBackUpSecretKeyStep] = useState(true);
  const [hasCompletedAddFundsStep, setHasCompletedAddFundsStep] = useState(false);
  const [hasCompletedBuyNftStep, setHasCompletedBuyNftStep] = useState(false);
  const hasCompletedExploreAppsStep = useExploreAppsStepStatus();
  const hasHiddenSuggestedFirstSteps = useHideSuggestedFirstSteps();
  const accounts = useAccounts();
  const analytics = useAnalytics();
  const dispatch = useAppDispatch();

  const onDismissSteps = useCallback(() => {
    void analytics.track('dismiss_suggested_first_steps');
    dispatch(onboardingActions.hideSuggestedFirstSteps(true));
  }, [analytics, dispatch]);

  const completeBackUpSecretKeyStep = () => setHasCompletedBackUpSecretKeyStep(true);
  const completeAddFundsStep = () => setHasCompletedAddFundsStep(true);
  const completeExploreAppsStep = () =>
    dispatch(onboardingActions.userHasCompletedExploreAppsStep(true));
  const completeBuyNftStep = () => setHasCompletedBuyNftStep(true);

  const hasCompletedSuggestedFirstSteps =
    hasCompletedBackUpSecretKeyStep &&
    hasCompletedAddFundsStep &&
    hasCompletedExploreAppsStep &&
    hasCompletedBuyNftStep;

  if (
    !accounts ||
    accounts?.length > 1 ||
    hasHiddenSuggestedFirstSteps ||
    hasCompletedSuggestedFirstSteps
  )
    return null;

  return (
    <SuggestedFirstStepsLayout onDismissSteps={onDismissSteps}>
      <BackUpSecretKeyStep
        isComplete={hasCompletedBackUpSecretKeyStep}
        onComplete={completeBackUpSecretKeyStep}
      />
      <AddFundsStep isComplete={hasCompletedAddFundsStep} onComplete={completeAddFundsStep} />
      <ExploreAppsStep
        isComplete={hasCompletedExploreAppsStep}
        onComplete={completeExploreAppsStep}
      />
      <BuyNftStep isComplete={hasCompletedBuyNftStep} onComplete={completeBuyNftStep} />
    </SuggestedFirstStepsLayout>
  );
}
