# PUI Cyberpunk Event Registration

A premium, high-contrast, animated event registration component built with React, Framer Motion, and Tailwind CSS. Features a "holographic" ticket receipt, glowing UI elements, and a smooth multi-step wizard.

## Features

- 🎨 **Cyberpunk Aesthetic:** Deep black backgrounds with glowing cyan/purple gradients and holographic noise textures.
- 🧙‍♂️ **Multi-step Wizard:** Seamless transitions between event selection, ticketing, details, and secure payment.
- 🎫 **Holographic Ticket:** Generates a printable, physical-style pass with a "tear-off" stub and **real scannable QR code**.
- 📸 **Photo Upload:** Includes a live image preview for attendee ID badges.
- 📱 **Mobile Responsive:** Fully adaptive layout that works on all screen sizes without ugly scrollbars.
- 🖨️ **Print Ready:** Optimized CSS for printing the final ticket exactly as it appears on screen.
- 💾 **State Persistence:** Automatically saves user progress and data to LocalStorage, ensuring no data loss on page refresh.
- 💳 **Smart Payment UI:** Realistic credit card entry with auto-formatting, validation, and processing animations.
- ✅ **Form Validation:** strict email regex checks and required field handling with visual error feedback.

## Dependencies

Ensure you have the following installed in your React project:

```bash
npm install framer-motion lucide-react classnames
```

## Installation

- 📦 **Install Dependencies:** Run `npm install framer-motion lucide-react classnames` to grab the required libraries.
- 📂 **Add Component:** Create a new file (e.g., `src/components/EventRegistration.jsx`) and paste the source code.
- 🎨 **Tailwind Setup:** Ensure your project has Tailwind CSS configured to handle the utility classes.
- 🔌 **Import & Usage:** Import `EventRegistration` in your main application file and render it.

## Usage

```bash
import React from 'react';
import EventRegistration from './components/EventRegistration';

function App() {
  return (
    <div>
      <EventRegistration />
    </div>
  );
}

export default App;
```


## 🚀 Production Integration Guide

- 💳 **Real Payments:** Replace the `setTimeout` simulation in `PaymentGateway` with your provider's SDK (Stripe, PayPal, etc.) to process actual transactions.
- 🔗 **Backend Connection:** In `handlePaymentComplete`, replace the local state update with a `POST` request to your API to securely store order details and user data.
- ☁️ **Cloud Storage:** Modify `handleImageUpload` to upload files to S3 or Cloudinary immediately and store the returned URL instead of using heavy Base64 strings.
- 🛡️ **Environment Variables:** Move sensitive keys (like API endpoints or payment public keys) to `.env` files instead of hardcoding them in the component.
- 📧 **Email Confirmation:** Trigger a server-side email service (like Resend or SendGrid) upon successful payment to send the digital ticket to the user.


## Customization
1) Events Data: Modify the EVENTS constant to change cities, dates, and background images.

2) Ticket Tiers: Edit the TICKETS constant to adjust pricing and features.

3) Colors: The component uses Tailwind classes (e.g., bg-cyan-500, bg-[#020617]). You can find-and-replace these to match your brand palette.

---

# 📄 License(PUI)
Free to use for personal and commercial projects.