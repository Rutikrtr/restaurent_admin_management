import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardOverview from './components/DashboardOverview';
import AllRestaurants from './components/AllRestaurants';
import PendingRestaurants from './components/PendingRestaurants';
import Settings from './components/Settings';
import { restaurantService } from './services/restaurantService';
import { useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { logoutRestaurant } from '../features/auth/authApi';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [restaurants, setRestaurants] = useState([]);
  const [pendingRestaurants, setPendingRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const data = await logoutRestaurant();
    if (data.success) {
      dispatch(logout());
      toast.success("Logout successful");
      navigate("/login");
    } else {
      toast.error("Logout failed");
    }
  };

  const fetchAllRestaurants = async () => {
    setLoading(true);
    try {
      const data = await restaurantService.getAllRestaurants();
      setRestaurants(data);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      toast.error('Failed to fetch restaurants');
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingRestaurants = async () => {
    setLoading(true);
    try {
      const data = await restaurantService.getPendingRestaurants();
      setPendingRestaurants(data);
    } catch (error) {
      console.error('Error fetching pending restaurants:', error);
      toast.error('Failed to fetch pending restaurants');
    } finally {
      setLoading(false);
    }
  };

  // For pending restaurants - uses updateRestaurantApproval endpoint (only approved/rejected)
  const changePendingRestaurantStatus = async (restaurantId, status) => {
    // Validate status for pending restaurants (only approved/rejected allowed)
    if (!['approved', 'rejected'].includes(status)) {
      toast.error('Invalid status for pending restaurant. Only approved/rejected allowed.');
      return;
    }

    try {
      await restaurantService.changePendingRestaurantStatus(restaurantId, status);

      // Remove the restaurant from pending list immediately for better UX
      setPendingRestaurants(prev =>
        prev.filter(restaurant => restaurant._id !== restaurantId)
      );

      // If status is approved, refresh all restaurants for dashboard
      if (status === 'approved' && (activeTab === 'dashboard' || activeTab === 'restaurants')) {
        fetchAllRestaurants();
      }

      const statusMessage = status === 'approved' ? 'approved' : 'rejected';
      toast.success(`Restaurant ${statusMessage} successfully`);
    } catch (error) {
      console.error('Error changing restaurant status:', error);
      toast.error('Failed to update restaurant status');
    }
  };

  // For existing restaurants - uses changeRestaurantStatus endpoint (supports approved, rejected, stop)
  const changeRestaurantStatusDirect = async (restaurantId, status) => {
    // Validate status on frontend as well
    if (!['approved', 'rejected', 'stop'].includes(status)) {
      toast.error('Invalid status provided');
      return;
    }

    try {
      await restaurantService.changeRestaurantStatus(restaurantId, status);

      // Update the restaurant in the list immediately for better UX
      setRestaurants(prev =>
        prev.map(restaurant =>
          restaurant._id === restaurantId
            ? { ...restaurant, approvalStatus: status }
            : restaurant
        )
      );

      // Also refresh dashboard data if we're on dashboard
      if (activeTab === 'dashboard') {
        fetchAllRestaurants();
        fetchPendingRestaurants();
      }

      let statusMessage;
      switch (status) {
        case 'approved':
          statusMessage = 'approved';
          break;
        case 'rejected':
          statusMessage = 'rejected';
          break;
        case 'stop':
          statusMessage = 'stopped';
          break;
        default:
          statusMessage = 'updated';
      }

      toast.success(`Restaurant ${statusMessage} successfully`);
    } catch (error) {
      console.error('Error changing restaurant status:', error);
      toast.error('Failed to update restaurant status');
    }
  };

  // Fetch data when activeTab changes
  useEffect(() => {
    if (activeTab === 'restaurants' || activeTab === 'dashboard') {
      fetchAllRestaurants();
    }
    if (activeTab === 'pending-restaurants' || activeTab === 'dashboard') {
      fetchPendingRestaurants();
    }
  }, [activeTab]);

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardOverview
            restaurants={restaurants}
            pendingRestaurants={pendingRestaurants}
            setActiveTab={setActiveTab}
          />
        );
      case 'restaurants':
        return (
          <AllRestaurants
            restaurants={restaurants}
            loading={loading}
            onStatusChange={changeRestaurantStatusDirect}
          />
        );
      case 'pending-restaurants':
        return (
          <PendingRestaurants
            pendingRestaurants={pendingRestaurants}
            loading={loading}
            onStatusChange={changePendingRestaurantStatus}
          />
        );
      case 'settings':
        return <Settings />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 ">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      />

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          activeTab={activeTab}
          pendingCount={pendingRestaurants.length}
          user={user.fullname}
        />

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          {renderActiveComponent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;