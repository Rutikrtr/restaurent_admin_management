// App.js
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import Management from './pages/Management';
import { Provider } from 'react-redux';
import { store, persistor } from './app/store';
import ProtectedRoute from './components/ProtectedRoute';
import { Navigate } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import Dashboard from './superadmin/Dashboard';
// import RestaurantDashboard from './pages/RestaurantDashboard';
function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Navigate to="/login" replace />} />
            <Route path='/login' element={<Login />} />
            <Route path="*" element={<Navigate to="/login" replace />} />

            {/* Management route - only for restaurant accounts */}
            <Route
              path="/management"
              element={
                <ProtectedRoute allowedRoles={['restaurant']}>
                  <Management/>
                </ProtectedRoute>
              }
            />

            {/* Dashboard route - only for superadmin accounts */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={['superadmin']}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

           
          </Routes>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  );
}

export default App;