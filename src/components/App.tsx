import * as React from 'react';
import {Routes, Route} from 'react-router-dom';

import Header from './Header';
import Welcome from './Welcome';

function App() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Welcome />} />
      </Routes>
    </div>
  );
}

export default App;
