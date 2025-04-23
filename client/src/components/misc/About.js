import React from 'react';
import Topbar from '../layout/Topbar';

const About = () => {
  return (
    <>
      <div style={{ color: '#ffa', margin: '2rem' }}>
        <h1>About</h1>
        <p><strong>Take control of your money. Stay focused on your future.</strong></p>
        <p>
          Our budget app was built with a simple mission: <strong>make managing your money effortless, powerful, and personal.</strong>
        </p>
        <p>
          We know what it’s like to feel out of sync with your finances—overwhelmed by spending, unsure of what’s safe to splurge, or struggling to stay on track. That’s why we created a tool that does more than just track your expenses. It <strong>connects to your bank accounts, helps you plan ahead, and keeps you accountable—without the clutter.</strong>
        </p>
        
        <h2>What Makes Us Different (Apparently) </h2>
        <ul>
          <li><strong>Real-time syncing</strong> with your accounts</li>
          <li><strong>Custom budgets</strong> built around your life</li>
          <li><strong>Clean, distraction-free design</strong></li>
          <li><strong>Smart notifications</strong> that support your goals, not nag you</li>
        </ul>
        
        <p>
          Whether you’re saving for a dream trip, paying off debt, or just trying to feel peace of mind when you check your balance, we’re here to help you make money decisions with confidence.
        </p>
        
        <p>
          You shouldn’t need a finance degree to feel in control of your money. We’ve built something simple, so you can build something strong: your future.
        </p>
      </div>
    </>
  );
}

export default About;