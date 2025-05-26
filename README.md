# Authenticate, Please – Phishing Detection Training Game

A cybersecurity training game that simulates real-world phishing scenarios. Players act as email security verifiers, making critical decisions about incoming emails while learning to identify phishing attempts.

## 🎮 Features

### Email Verification Tasks
- **Login Verification**
  - Assess login request emails
  - +5 points for legitimate login
  - Immediate game over for phishing login

- **Download Verification**
  - Evaluate file download requests
  - +5 points for legitimate downloads
  - Immediate game over for malicious downloads

- **Survey Verification**
  - Review survey participation requests
  - Pre-filled forms with user data
  - +5 points for legitimate surveys
  - -30 points for phishing surveys
  - Game continues unless score drops below zero

### Game Mechanics
- **Email Management**
  - Real-time email arrival system
  - Time limits for each decision
  - Ignore feature for temporary email storage
  - Points system with various rewards/penalties

- **Security Features**
  - Secure user authentication
  - Password hashing with bcrypt
  - Session management
  - No sensitive data stored client-side

- **Statistics & Progress**
  - Detailed per-game statistics
  - All-time performance tracking
  - Accuracy calculations
  - Response time monitoring
  - CSV export functionality
  - Statistics reset option

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository
```bash
git clone https://github.com/B4SEE/AuthenticatePlease
cd AuthenticatePlease/authpls
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Production Deployment

Build the production version:
```bash
npm run build
npm start
```

## 🎯 How to Play

1. **Start a Game**
   - Log in or create an account
   - Click "Start Game" from the dashboard

2. **Handle Emails**
   - Review incoming emails carefully
   - Check sender addresses and domains
   - Assess content for phishing indicators
   - Make decisions before time runs out

3. **Available Actions**
   - **Allow**: Process legitimate emails
   - **Report**: Flag suspicious emails
   - **Ignore**: Store emails for later (limited slots)
   - **Download**: Handle file attachments
   - **Complete Survey**: Respond to survey requests

4. **Scoring System**
   - +10 points: Correctly reporting phishing
   - +5 points: Correctly handling legitimate emails
   - -5 points: False positives (reporting legitimate)
   - -30 points: Completing phishing surveys
   - Game over: Falling for phishing or downloading malicious files

## 📊 Statistics

Track your progress with detailed statistics:
- Games played
- Accuracy rate
- Average response time
- False positives/negatives
- Phishing detection rate
- Export data to CSV

## 🔒 Security Features

- Secure password storage using bcrypt
- Iron Session for secure authentication
- No sensitive data in client storage
- User-specific statistics tracking
- Safe credential simulation

## 🛠️ Technologies

- Next.js 13+ (App Router)
- React 18
- TypeScript
- TailwindCSS
- Iron Session
- bcrypt.js