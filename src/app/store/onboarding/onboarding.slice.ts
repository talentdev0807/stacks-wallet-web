import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface OnboardingState {
  hasCompletedExploreAppsStep: boolean;
  hasHiddenSuggestedFirstSteps: boolean;
  hasSkippedFundAccount: boolean;
}

const initialState: OnboardingState = {
  hasCompletedExploreAppsStep: false,
  hasHiddenSuggestedFirstSteps: false,
  hasSkippedFundAccount: false,
};

export const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState,
  reducers: {
    userHasCompletedExploreAppsStep(state, action: PayloadAction<boolean>) {
      state.hasCompletedExploreAppsStep = action.payload;
    },
    hideSuggestedFirstSteps(state, action: PayloadAction<boolean>) {
      state.hasHiddenSuggestedFirstSteps = action.payload;
    },
    userSkippedFundingAccount(state, action: PayloadAction<boolean>) {
      state.hasSkippedFundAccount = action.payload;
    },
  },
});
