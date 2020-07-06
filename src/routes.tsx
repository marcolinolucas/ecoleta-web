import React from 'react';
import { Route, BrowserRouter } from 'react-router-dom';

import Home from './pages/Home';
import CreatePoint from './pages/CreatePoint';

const Routes = () => (
  <BrowserRouter>
    <Route component={Home} path="/" exact />
    <Route component={CreatePoint} path="/cadastro" exact />
  </BrowserRouter>
);

export default Routes;
