import styled from 'styled-components';

import App from './App';
import { Provider, ErrorBoundary } from '@rollbar/react';

const rollbarConfig = {
  accessToken: '4fee9a37ad0a4505b4ae7f5edccac33b',
  environment: 'testenv',
};

function RootApp() {
  return (
    <Provider config={rollbarConfig}>
      <ErrorBoundary>
        <Wrapper
          className='wrapper-class'
          onCopy={(event) => {
            event.preventDefault();
          }}
        >
          {/* Zustand doesn't require a Provider wrapper */}
          <App />
        </Wrapper>
      </ErrorBoundary>
    </Provider>
  );
}
export default RootApp;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;

  @media (min-height: 1024px) and (min-width: 1024px) {
    height: 100vh;
    align-items: center;
  }
`;
