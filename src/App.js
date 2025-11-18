import React from 'react';
import useSocket from './hooks/useSocket';

import MainPage from './MainPage';

function App() {
  useSocket();
  return <MainPage />;
}
export default App;
