# Authenticate, Please – Phishing Detection Training Game

A cybersecurity training game that simulates real-world phishing scenarios. Players act as email security verifiers, making critical decisions about incoming emails while learning to identify phishing attempts.

## 📋 Project Documentation

### Requirements and Implementation Status
For a detailed overview of project requirements and their implementation status, see [requirements.md](requirements.md).

### Initial Vision
The project started with a clear vision for a modern, cyberpunk-themed phishing detection game:

- **Initial Design**: View [initial mockup](AuthenticatePlease.png).
- **Design Evolution**: The final implementation follows the initial vision while adding additional features like.

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

## 🚀 Running the Project

### Production Build (For Teacher Review)
A production build is included in the repository for easy review:

1. Clone the repository
2. Navigate to the project directory:
   ```bash
   cd authpls
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the production server:
   ```bash
   npm start
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

The production build is already included in the `.next` directory, so there's no need to run `npm run build`.

### Development Mode
To run the project in development mode:

1. Follow steps 1-3 above
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000) in your browser

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

- Next.js 14
- React
- Tailwind CSS
- TypeScript
- Node.js