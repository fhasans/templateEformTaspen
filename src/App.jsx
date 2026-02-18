import React, { useState } from 'react';
import MerchantForm from './pages/MerchantForm';
import LandingPage from './pages/LandingPage';
import EmailVerification from './pages/EmailVerification';
import BankCheck from './pages/BankCheck';
import './App.css';
import { secureStorage } from './utils/secureStorage';

function App() {
  // Initialize state from sessionStorage to persist across refreshes
  const [isStarted, setIsStarted] = useState(() => {
    return sessionStorage.getItem('onboardingStarted') === 'true';
  });

  const [isEmailVerified, setIsEmailVerified] = useState(() => {
    return sessionStorage.getItem('isEmailVerified') === 'true';
  });

  const handleStart = () => {
    secureStorage.setItem('onboardingStarted', true);
    setIsStarted(true);
  };

  const [userEmail, setUserEmail] = useState(() => {
    return secureStorage.getItem('userEmail') || '';
  });

  const handleVerified = (email) => {
    secureStorage.setItem('isEmailVerified', true);
    setIsEmailVerified(true);
    if (email) {
      secureStorage.setItem('userEmail', email);
      setUserEmail(email);
    }
  };

  const [isBankVerified, setIsBankVerified] = useState(() => {
    return secureStorage.getItem('isBankVerified') === true;
  });

  const [verifiedAccountData, setVerifiedAccountData] = useState(() => {
    const stored = secureStorage.getItem('verifiedAccountData');
    return stored || null;
  });

  const handleBankVerified = (accountData) => {
    secureStorage.setItem('isBankVerified', true);
    secureStorage.setItem('verifiedAccountData', accountData);
    setIsBankVerified(true);
    setVerifiedAccountData(accountData);
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
        <MerchantForm userEmail={userEmail} verifiedAccountData={verifiedAccountData} />
      )}
    </>
  );
}

export default App;
