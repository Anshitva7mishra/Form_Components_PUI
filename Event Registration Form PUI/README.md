# PUI Cyberpunk Event Registration

A premium, high-contrast, animated event registration component built with React, Framer Motion, and Tailwind CSS. Features a "holographic" ticket receipt, glowing UI elements, and a smooth multi-step wizard.

## Features

- 🎨 **Cyberpunk Aesthetic:** Deep black backgrounds with glowing cyan/purple gradients.
- 🧙‍♂️ **Multi-step Wizard:** Seamless transitions between event selection, ticketing, details, and review.
- 🎫 **Holographic Ticket:** Generates a printable, physical-style pass with a "tear-off" stub and barcode.
- 📸 **Photo Upload:** Includes a live image preview for attendee ID badges.
- 📱 **Mobile Responsive:** Fully adaptive layout that works on all screen sizes.
- 🖨️ **Print Ready:** Optimized CSS for printing the final ticket.

## Dependencies

Ensure you have the following installed in your React project:

```bash
npm install framer-motion lucide-react classnames
```

## Installation
Copy the code from EventRegistration.jsx into your project (e.g., src/components/EventRegistration.jsx).

Import and use it in your main application file.

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

## Customization
1) Events Data: Modify the EVENTS constant to change cities, dates, and background images.

2) Ticket Tiers: Edit the TICKETS constant to adjust pricing and features.

3) Colors: The component uses Tailwind classes (e.g., bg-cyan-500, bg-[#020617]). You can find-and-replace these to match your brand palette.

---

# 📄 License(PUI)
Free to use for personal and commercial projects.