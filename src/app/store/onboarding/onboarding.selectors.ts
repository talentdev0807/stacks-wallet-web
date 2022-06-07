import { createSelector } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';

import { RootState } from '@app/store';

const selectOnboarding = (state: RootState) => state.onboarding;

const selectExploreAppsStepStatus = createSelector(
  selectOnboarding,
  state => state.hasCompletedExploreAppsStep
);

const selectHideSuggestedFirstSteps = createSelector(
  selectOnboarding,
  state => state.hasHiddenSuggestedFirstSteps
);

const selectSkipFundAccount = createSelector(
  selectOnboarding,
  state => state.hasSkippedFundAccount
);

export function useExploreAppsStepStatus() {
  return useSelector(selectExploreAppsStepStatus);
}

export function useHideSuggestedFirstSteps() {
  return useSelector(selectHideSuggestedFirstSteps);
}

export function useSkipFundAccount() {
  return useSelector(selectSkipFundAccount);
}
