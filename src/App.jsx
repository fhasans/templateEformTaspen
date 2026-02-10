import React, { useState } from 'react';
import MerchantForm from './pages/MerchantForm';
import LandingPage from './pages/LandingPage';
import EmailVerification from './pages/EmailVerification';
import BankCheck from './pages/BankCheck';
import './App.css';

function App() {
  // Initialize state from sessionStorage to persist across refreshes
  const [isStarted, setIsStarted] = useState(() => {
    return sessionStorage.getItem('onboardingStarted') === 'true';
  });

  const [isEmailVerified, setIsEmailVerified] = useState(() => {
    return sessionStorage.getItem('isEmailVerified') === 'true';
  });

  const handleStart = () => {
    sessionStorage.setItem('onboardingStarted', 'true');
    setIsStarted(true);
  };

  const [userEmail, setUserEmail] = useState(() => {
    return sessionStorage.getItem('userEmail') || '';
  });

  const handleVerified = (email) => {
    sessionStorage.setItem('isEmailVerified', 'true');
    setIsEmailVerified(true);
    if (email) {
      sessionStorage.setItem('userEmail', email);
      setUserEmail(email);
    }
  };

  const [isBankVerified, setIsBankVerified] = useState(() => {
    return sessionStorage.getItem('isBankVerified') === 'true';
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
        <MerchantForm userEmail={userEmail} />
      )}
    </>
  );
}

export default App;
