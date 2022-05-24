import { IS_TEST_ENV } from '@shared/constants';
import { useHasAllowedDiagnostics } from './store/onboarding/onboarding.hooks';

type Props = {};

const WebRequestWrapper: React.FC<Props> = ({ children }) => {
  const [userHasAllowedDiagnosticsKey] = useHasAllowedDiagnostics();

  let shouldSetReferrer = !IS_TEST_ENV && userHasAllowedDiagnosticsKey;
  shouldSetReferrer = true; // todo: remove

  if (shouldSetReferrer) {
    chrome.webRequest.onBeforeSendHeaders.addListener(
      details => {
        console.log('🐶 APP', details); // todo: remove console.log
        const headers = details.requestHeaders;

        if (details.initiator === `chrome-extension://${chrome.runtime.id}`) {
          headers?.push({ name: 'Referer', value: details.initiator });
        }
        return { requestHeaders: headers };
      },
      {
        urls: ['*://*/*'], // todo: change to 'https://*.stacks.co/*' or similar
      },
      ['requestHeaders', 'blocking', 'extraHeaders'] // permissions
    );
  }

  return <>{children}</>;
};

export default WebRequestWrapper;
