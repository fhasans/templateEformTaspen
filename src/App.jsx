import React, { useState } from 'react';
import MerchantForm from './pages/MerchantForm';
import LandingPage from './pages/LandingPage';
import './App.css';

function App() {
  const [isStarted, setIsStarted] = useState(() => {
    // Check navigation type to determine if this is a fresh visit or a reload
    const navEntry = performance.getEntriesByType("navigation")[0];
    // STRICT: Only persist on explicit RELOAD. 
    // 'back_forward' is typically used when Reopening Closed Tabs, so we exclude it to force a clear.
    const isStrictReload = navEntry && navEntry.type === 'reload';

    if (isStrictReload) {
      return sessionStorage.getItem('onboardingStarted') === 'true';
    }

    // If it's NOT a reload (navigate, back_forward, etc.), clear session storage
    sessionStorage.removeItem('onboardingStarted');
    sessionStorage.removeItem('merchantFormData');
    sessionStorage.removeItem('merchantFormStep');
    return false;
  });

  const handleStart = () => {
    sessionStorage.setItem('onboardingStarted', 'true');
    setIsStarted(true);
  };

  return (
    <>
      {!isStarted ? (
        <LandingPage onStart={handleStart} />
      ) : (
        <MerchantForm />
      )}
    </>
  );
}

export default App;
