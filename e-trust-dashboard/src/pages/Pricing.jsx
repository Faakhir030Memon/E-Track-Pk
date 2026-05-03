import React from 'react';
import DashboardLayout from '../components/DashboardLayout';

const Pricing = () => {
  const plans = [
    {
      name: 'Starter Plan',
      price: '5,000',
      period: 'month',
      description: 'Ideal for small Instagram & Facebook stores.',
      features: [
        'Up to 500 Order Scans',
        'Basic Fraud Detection',
        'Email Alerts',
        'Single Store Integration'
      ],
      buttonText: 'Subscribe Starter',
      isPopular: false
    },
    {
      name: 'Growth Plan',
      price: '15,000',
      period: 'month',
      description: 'Best for established Shopify & WooCommerce stores.',
      features: [
        'Unlimited Order Scans',
        'Advanced Risk Scoring',
        'WhatsApp & SMS OTPs',
        'Priority Support',
        'Custom Webhooks'
      ],
      buttonText: 'Get Started',
      isPopular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'quote',
      description: 'For large platforms like Daraz or Multi-vendor sites.',
      features: [
        'Dedicated Fraud Engine',
        'White-label Dashboard',
        'API Rate Limit Increase',
        '24/7 Account Manager',
        'On-premise Deployment'
      ],
      buttonText: 'Contact Sales',
      isPopular: false
    }
  ];

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        <header className="mb-10 text-center">
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Simple, Transparent Pricing</h1>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>Choose the plan that best fits your store's scale.</p>
        </header>

        <div className="grid gap-8" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          {plans.map((plan, i) => (
            <div 
              key={i} 
              className={`card ${plan.isPopular ? 'border-primary' : ''}`} 
              style={{ 
                padding: '2.5rem', 
                display: 'flex', 
                flexDirection: 'column',
                background: '#fff',
                color: '#1E293B',
                border: plan.isPopular ? '2px solid var(--brand-primary)' : '1px solid #E2E8F0',
                position: 'relative'
              }}
            >
              {plan.isPopular && (
                <div style={{ 
                  position: 'absolute', 
                  top: '12px', 
                  right: '12px', 
                  background: 'var(--brand-primary)', 
                  color: '#fff', 
                  padding: '4px 12px', 
                  borderRadius: '20px', 
                  fontSize: '0.75rem', 
                  fontWeight: 700 
                }}>
                  MOST POPULAR
                </div>
              )}
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{plan.name}</h3>
              <p style={{ fontSize: '0.875rem', color: '#64748B', marginBottom: '1.5rem' }}>{plan.description}</p>
              
              <div className="flex items-baseline gap-1 mb-8">
                <span style={{ fontSize: '2rem', fontWeight: 800 }}>Rs {plan.price}</span>
                <span style={{ fontSize: '0.875rem', color: '#64748B' }}>/{plan.period}</span>
              </div>

              <div className="flex-col gap-4 mb-8" style={{ flexGrow: 1 }}>
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--brand-primary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    <span style={{ fontSize: '0.875rem' }}>{feature}</span>
                  </div>
                ))}
              </div>

              <button className={`btn ${plan.isPopular ? 'btn-primary' : 'btn-outline'} w-full py-3`} style={{ borderRadius: '12px' }}>
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-12 p-8 rounded-2xl bg-white border border-slate-200 text-center">
          <h4 style={{ color: '#1E293B', marginBottom: '0.5rem' }}>Special Offer: Start with 1 Month Free Trial</h4>
          <p style={{ color: '#64748B', fontSize: '0.875rem' }}>"Only pay if your return percentage improves." No credit card required to start.</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Pricing;
