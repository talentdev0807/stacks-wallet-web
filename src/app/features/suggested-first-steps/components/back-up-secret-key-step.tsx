import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import BackUpSecretKeyFull from '@assets/images/onboarding/steps/backup-key-light.png';
import BackUpSecretKeyFullDone from '@assets/images/onboarding/steps/backup-key-light-done.png';
import BackUpSecretKeyPopup from '@assets/images/onboarding/steps/backup-key-light-sm.png';
import BackUpSecretKeyPopupDone from '@assets/images/onboarding/steps/backup-key-light-done-sm.png';
import { RouteUrls } from '@shared/route-urls';

import { SuggestedFirstStep } from './suggested-first-step';

const eventName = 'back_up_secret_key';

interface BackUpSecretKeyStepProps {
  isComplete: boolean;
  onComplete(): void;
}
export function BackUpSecretKeyStep({ isComplete, onComplete }: BackUpSecretKeyStepProps) {
  const analytics = useAnalytics();
  const navigate = useNavigate();

  const onSelectStep = useCallback(() => {
    onComplete();
    void analytics.track('select_next_step', { step: eventName });
    navigate(RouteUrls.ViewSecretKey);
  }, [analytics, navigate, onComplete]);

  return (
    <SuggestedFirstStep
      action="View secret key"
      body="Don't lose access to your account and crypto"
      imageFull={BackUpSecretKeyFull}
      imageFullDone={BackUpSecretKeyFullDone}
      imagePopup={BackUpSecretKeyPopup}
      imagePopupDone={BackUpSecretKeyPopupDone}
      isComplete={isComplete}
      key={eventName}
      onClick={onSelectStep}
      title="Back up secret key"
    />
  );
}
