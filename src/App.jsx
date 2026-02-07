import React, { useState } from 'react';
import MerchantForm from './pages/MerchantForm';
import LandingPage from './pages/LandingPage';
import EmailVerification from './pages/EmailVerification';
import BankCheck from './pages/BankCheck';
import './App.css';

function App() {
  const [isStarted, setIsStarted] = useState(() => {
    // Check navigation type to determine if this is a fresh visit or a reload
    const navEntry = performance.getEntriesByType("navigation")[0];
    const isStrictReload = navEntry && navEntry.type === 'reload';

    if (isStrictReload) {
      return sessionStorage.getItem('onboardingStarted') === 'true';
    }

    // Reset on new session
    sessionStorage.removeItem('onboardingStarted');
    sessionStorage.removeItem('isEmailVerified');
    sessionStorage.removeItem('isBankVerified');
    sessionStorage.removeItem('merchantFormData');
    sessionStorage.removeItem('merchantFormStep');
    return false;
  });

  const [isEmailVerified, setIsEmailVerified] = useState(() => {
    const navEntry = performance.getEntriesByType("navigation")[0];
    const isStrictReload = navEntry && navEntry.type === 'reload';
    if (isStrictReload) {
      return sessionStorage.getItem('isEmailVerified') === 'true';
    }
    return false;
  });

  const handleStart = () => {
    sessionStorage.setItem('onboardingStarted', 'true');
    setIsStarted(true);
  };

  const handleVerified = () => {
    sessionStorage.setItem('isEmailVerified', 'true');
    setIsEmailVerified(true);
  };

  const [isBankVerified, setIsBankVerified] = useState(() => {
    const navEntry = performance.getEntriesByType("navigation")[0];
    const isStrictReload = navEntry && navEntry.type === 'reload';
    if (isStrictReload) {
      return sessionStorage.getItem('isBankVerified') === 'true';
    }
    return false;
  });

  const handleBankVerified = (accountNumber) => {
    sessionStorage.setItem('isBankVerified', 'true');
    setIsBankVerified(true);
  };

  return (
    <>
      {!isStarted ? (
        <LandingPage onStart={handleStart} />
      ) : !isEmailVerified ? (
        <EmailVerification onVerified={handleVerified} />
      ) : !isBankVerified ? (
        <BankCheck onVerified={handleBankVerified} />
      ) : (
        <MerchantForm />
      )}
    </>
  );
}

export default App;
