# Authenticate, Please – Phishing Emails Verification Game

## Project Overview

**Authenticate, Please** is an interactive web application inspired by the gameplay of *Papers, Please*. In this simulation, the user acts as a cybersecurity verifier who must assess incoming emails. The core mechanic involves deciding whether to **allow** or **report** each email based on subtle phishing cues. If an email is allowed, the user is prompted to click a link and enter credentials (using a provided, randomly generated login form). Any misstep—such as reporting a legitimate email or engaging with a phishing link—results in point deductions or immediate game over, respectively.

## Key Features
  
- **Decision-Based Workflow:** 
  - *Allow Emails:* When an email is allowed, the user can follow a link that navigates to a secure login form. Entering credentials (generated dynamically) simulates the risk of interacting with phishing elements (if the email was malicious).
  - *Report Emails:* Reporting an email skips it, but wrongly reporting a valid email results in a points penalty.
  - *Instant Failure:* Interacting with a phishing link or entering credentials for a phishing email triggers an immediate point loss or game termination.

- **Scoring and Feedback:** A real-time score system provides immediate visual and audio feedback based on the user’s actions. A well-designed history mechanism allows users to navigate through previous decisions, fostering a learning experience.
