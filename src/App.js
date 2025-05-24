// App.js
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import Management from './pages/Management';
import Superlogin from './pages/SuperLogin';

import { Provider } from 'react-redux';
import { store,persistor  } from './app/store';
import ProtectedRoute from './components/ProtectedRoute';
import { Navigate } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react'
function App() {
  return (
    <Provider store={store}>
     <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Navigate to="/login" replace />} />
          <Route path='/login' element={<Login />} />
          <Route path="*" element={<Navigate to="/login" replace />} />

          <Route
            path="/management"
            element={
              <ProtectedRoute>
                <Management />
              </ProtectedRoute>
            }
          />

          <Route path='/superlogin' element={<Superlogin />} />
        </Routes>
      </BrowserRouter>
      </PersistGate>
    </Provider>
  );
}

export default App;
