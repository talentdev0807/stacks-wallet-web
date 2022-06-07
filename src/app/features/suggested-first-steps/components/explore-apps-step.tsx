import { useCallback } from 'react';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { openInNewTab } from '@app/common/utils/open-in-new-tab';
import ExploreAppsFull from '@assets/images/onboarding/steps/explore-apps-light.png';
import ExploreAppsFullDone from '@assets/images/onboarding/steps/explore-apps-light-done.png';
import ExploreAppsPopup from '@assets/images/onboarding/steps/explore-apps-light-sm.png';
import ExploreAppsPopupDone from '@assets/images/onboarding/steps/explore-apps-light-done-sm.png';

import { SuggestedFirstStep } from './suggested-first-step';

const exploreAppsExternalRoute = 'https://www.stacks.co/explore/discover-apps#apps';
const eventName = 'explore_apps';

interface ExploreAppsStepProps {
  isComplete: boolean;
  onComplete(): void;
}
export function ExploreAppsStep({ isComplete, onComplete }: ExploreAppsStepProps) {
  const analytics = useAnalytics();

  const onSelectStep = useCallback(() => {
    onComplete();
    void analytics.track('select_next_step', { step: eventName });
    openInNewTab(exploreAppsExternalRoute);
  }, [analytics, onComplete]);

  return (
    <SuggestedFirstStep
      action="Find apps"
      body="Try Stacks apps for finance, NFTs, blogging and more"
      imageFull={ExploreAppsFull}
      imageFullDone={ExploreAppsFullDone}
      imagePopup={ExploreAppsPopup}
      imagePopupDone={ExploreAppsPopupDone}
      isComplete={isComplete}
      isExternalRoute
      key={eventName}
      onClick={onSelectStep}
      title="Explore apps"
    />
  );
}
