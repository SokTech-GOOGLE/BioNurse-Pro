import React, { useState } from 'react';
import { User } from 'firebase/auth';
import { ViewState } from './types';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ChatInterface from './components/ChatInterface';
import LearningCenter from './components/LearningCenter';
import Profile from './components/Profile';
import Donate from './components/Donate';

// Mock Guest User to bypass authentication
const GUEST_USER: any = {
  uid: 'guest-user-id',
  displayName: 'Guest User',
  email: 'guest@bionurse.pro',
  photoURL: null,
  emailVerified: true,
  isAnonymous: true,
  metadata: {},
  providerData: [],
};

const App: React.FC = () => {
  // Automatically set user to Guest, removing the need for Signup/Login
  const [user] = useState<User | null>(GUEST_USER);
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);

  // Loading state is no longer needed as we have instant access
  
  const renderView = () => {
    switch (currentView) {
      case ViewState.DASHBOARD:
        return <Dashboard />;
      case ViewState.CHAT:
        return <ChatInterface />;
      case ViewState.LEARNING:
        return <LearningCenter />;
      case ViewState.PROFILE:
        return <Profile user={user!} />;
      case ViewState.DONATE:
        return <Donate />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout user={user!} currentView={currentView} setView={setCurrentView}>
      {renderView()}
    </Layout>
  );
};

export default App;