import React from 'react';
import '../../style/Services.css';

const Services = () => {
  return (
    <div className="services-container" style={{ color: '#ffa', margin: '2rem' }}>
      <h1>Our Services</h1>
      <p>We offer a variety of services designed to help you take control of your finances.</p>

      <div className="services-list">
        <div className="service">
          <h2>Real-time Bank Sync</h2>
          <p>Sync your bank accounts automatically to track your spending in real time.</p>
        </div>

        <div className="service">
          <h2>Customizable Budgeting</h2>
          <p>Build budgets tailored to your unique financial situation and goals.</p>
        </div>

        <div className="service">
          <h2>Smart Notifications</h2>
          <p>Get reminders and tips to stay on track with your financial goals.</p>
        </div>

        <div className="service">
          <h2>Expense Tracking</h2>
          <p>Track your expenses with ease and spot trends to save more money.</p>
        </div>
      </div>
    </div>
  );
}

export default Services;
