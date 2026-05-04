import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import api from '../utils/api';

const Pricing = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [transactionId, setTransactionId] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setScreenshot(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitPayment = async (e) => {
    e.preventDefault();
    if (!screenshotPreview) return setMessage('Please upload a payment screenshot.');
    
    setIsSubmitting(true);
    try {
      await api.post('/auth/submit-payment', {
        plan: selectedPlan.id,
        transactionId,
        screenshotUrl: screenshotPreview, // Sending base64
      });
      setMessage('Payment submitted successfully! Your account is now active.');
      setSelectedPlan(null);
      setScreenshot(null);
      setScreenshotPreview('');
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        window.location.href = '/'; 
      }, 2000);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Failed to submit payment.');
    } finally {
      setIsSubmitting(false);
    }
  };
  const plans = [
    {
      id: 'starter',
      name: 'Starter Plan',
      price: '1,500',
      period: 'month',
      description: 'Ideal for small Instagram & Facebook stores.',
      features: [
        'Up to 500 Order Scans',
        'Basic Fraud Detection',
        'Email Alerts',
        'Single Store Integration'
      ],
      buttonText: 'Select Starter',
      isPopular: false
    },
    {
      id: 'growth',
      name: 'Growth Plan',
      price: '4,500',
      period: 'month',
      description: 'Best for established Shopify & WooCommerce stores.',
      features: [
        'Unlimited Order Scans',
        'Advanced Risk Scoring',
        'WhatsApp & SMS OTPs',
        'Priority Support',
        'Custom Webhooks'
      ],
      buttonText: 'Select Growth',
      isPopular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '12,000',
      period: 'month',
      description: 'For large platforms like Daraz or Multi-vendor sites.',
      features: [
        'Dedicated Fraud Engine',
        'White-label Dashboard',
        'API Rate Limit Increase',
        '24/7 Account Manager',
        'On-premise Deployment'
      ],
      buttonText: 'Select Enterprise',
      isPopular: false
    }
  ];


  return (
    <DashboardLayout>
      <div className="animate-slide-up" style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <header className="mb-12 text-center">
          <span className="badge badge-success mb-3">Subscription Plans</span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.04em', marginBottom: '1rem' }}>Protect Your Store Today</h1>
          <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>Transparent pricing designed to scale with your business in Pakistan.</p>
        </header>

        {message && (
          <div className="card mb-8" style={{ background: message.includes('successfully') ? 'var(--success-bg)' : 'var(--danger-bg)', borderColor: message.includes('successfully') ? 'var(--success)' : 'var(--danger)', textAlign: 'center', padding: '1rem', color: message.includes('successfully') ? 'var(--success)' : 'var(--danger)', fontWeight: 600 }}>
            {message}
          </div>
        )}

        {!selectedPlan ? (
          <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {plans.map((plan, i) => (
              <div 
                key={i} 
                className="card" 
                style={{ 
                  padding: '2.5rem', 
                  display: 'flex', 
                  flexDirection: 'column',
                  background: '#FFFFFF',
                  border: plan.isPopular ? '2px solid var(--brand-primary)' : '1px solid var(--border)',
                  position: 'relative',
                  transform: plan.isPopular ? 'scale(1.05)' : 'none',
                  zIndex: plan.isPopular ? 1 : 0
                }}
              >
                {plan.isPopular && (
                  <div style={{ 
                    position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)',
                    background: 'var(--brand-primary)', color: '#fff', 
                    padding: '4px 14px', borderRadius: '20px', 
                    fontSize: '0.75rem', fontWeight: 700,
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)'
                  }}>
                    MOST POPULAR
                  </div>
                )}
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>{plan.name}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>{plan.description}</p>
                
                <div className="flex items-baseline gap-1 mb-8">
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Rs</span>
                  <span style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.02em' }}>{plan.price}</span>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>/{plan.period}</span>
                </div>

                <div className="flex flex-col gap-4 mb-10" style={{ flexGrow: 1 }}>
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div style={{ background: 'var(--success-bg)', padding: '4px', borderRadius: '50%', display: 'flex' }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--brand-primary)" strokeWidth="4"><polyline points="20 6 9 17 4 12"/></svg>
                      </div>
                      <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{feature}</span>
                    </div>
                  ))}
                </div>

                <button 
                  className={`btn ${plan.isPopular ? 'btn-primary' : 'btn-outline'} w-full py-4`}
                  onClick={() => setSelectedPlan(plan)}
                  style={{ fontSize: '0.9375rem' }}
                >
                  {plan.buttonText}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="card animate-slide-up" style={{ padding: '3rem', maxWidth: '600px', margin: '0 auto' }}>
            <button className="btn btn-ghost mb-8" onClick={() => setSelectedPlan(null)} style={{ padding: 0 }}>
               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
               Back to Plans
            </button>
            
            <div className="mb-8">
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Subscription for {selectedPlan.name}</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>Follow the steps below to activate your account.</p>
            </div>

            <div style={{ background: 'var(--bg-main)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', marginBottom: '2rem' }}>
              <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '1rem', textTransform: 'uppercase' }}>Payment Instructions</p>
              <div className="flex flex-col gap-3">
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-secondary)' }}>Amount to Transfer:</span>
                  <span style={{ fontWeight: 800 }}>Rs {selectedPlan.price}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-secondary)' }}>Bank Name:</span>
                  <span style={{ fontWeight: 600 }}>Meezan Bank</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-secondary)' }}>Account Number:</span>
                  <span style={{ fontWeight: 600, fontFamily: 'var(--font-mono)' }}>1234-5678-9012</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-secondary)' }}>Account Title:</span>
                  <span style={{ fontWeight: 600 }}>E-Trust PK Solutions</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmitPayment} className="flex flex-col gap-6">
              <div className="input-group">
                <label className="input-label">Transaction ID / Reference Number</label>
                <input 
                  className="input" 
                  required 
                  placeholder="e.g. 882391023" 
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                />
              </div>
              <div className="input-group">
                <label className="input-label">Payment Screenshot</label>
                <div 
                  className="file-upload-container"
                  onClick={() => document.getElementById('fileInput').click()}
                  style={{
                    border: '2px dashed var(--border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '2rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    background: screenshotPreview ? 'none' : 'var(--bg-main)',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden',
                    minHeight: '120px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <input 
                    id="fileInput"
                    type="file" 
                    hidden 
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  {screenshotPreview ? (
                    <div style={{ position: 'relative', width: '100%' }}>
                      <img src={screenshotPreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: 'var(--radius-sm)' }} />
                      <div style={{ 
                        position: 'absolute', top: '0', right: '0', bottom: '0', left: '0',
                        background: 'rgba(0,0,0,0.4)', color: '#fff', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        opacity: 0, transition: 'opacity 0.3s ease'
                      }} className="hover-overlay">
                        Click to change image
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500 }}>Upload Payment Proof (JPG/PNG)</span>
                    </div>
                  )}
                </div>
              </div>
              <button className="btn btn-primary w-full py-4 mt-4" type="submit" disabled={isSubmitting}>
                {isSubmitting ? <div className="spinner"></div> : 'Confirm Payment Submission'}
              </button>
            </form>
          </div>
        )}

        <div className="mt-16 p-10 rounded-3xl bg-white border border-border text-center shadow-sm">
          <div style={{ background: 'var(--brand-light)', color: 'var(--brand-primary)', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '1.25rem' }}>
            ⏳
          </div>
          <h4 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.75rem' }}>Fast Verification Policy</h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', maxWidth: '500px', margin: '0 auto' }}>
            Payments are verified manually by our team. Verification usually takes 2-4 hours. Once approved, your API access will be activated immediately.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Pricing;
