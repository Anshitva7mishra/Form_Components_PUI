# Modern Dark-Themed PUI Appointment Form

A robust, single-file React component for scheduling appointments. It features a modern "Cyber/Glassmorphism" dark aesthetic, smooth animations, validation, and a responsive design.

## 🌟 Features

* **UI/UX:** Dark mode with glassmorphism effects, neon accents, and smooth micro-interactions.
* **Animations:** powered by `framer-motion` (entrance effects, hover states, selection pulses).
* **functionality:** Custom calendar implementation, time slot selection, and timezone display.
* **Validation:** Client-side validation for required fields, email format, and phone numbers.
* **Accessibility:** Keyboard navigation support, proper aria labels, and visual feedback.
* **Portable:** Single-file architecture with injected styles for scrollbar hiding (no external CSS files needed).

## 🛠 Prerequisites

Ensure your React project is set up with **Tailwind CSS**. If you haven't initialized Tailwind yet, follow the [official guide](https://tailwindcss.com/docs/guides/create-react-app).

## 📦 Installation

1.  **Install Dependencies**
    Run the following command in your terminal to install the required logic and animation libraries:

    ```bash
    npm install framer-motion lucide-react date-fns classnames
    # or
    yarn add framer-motion lucide-react date-fns classnames
    ```

2.  **Add the Component**
    Create a new file named `AppointmentForm.jsx` in your `src` or `components` folder and paste the provided code into it.

## 🚀 Usage

Import and use the component in your main application (e.g., `App.js` or `App.jsx`).

```jsx
import React from 'react';
import AppointmentForm from './components/AppointmentForm';

function App() {
  return (
    <div className="App">
      <AppointmentForm />
    </div>
  );
}

export default App;
```

## ⚙️ Configuration & Customization
Since this is a single-file component, all logic is contained within AppointmentForm.jsx. You can easily customize it by finding the relevant sections:

1. Changing Time Slots
Locate the timeSlots array near the top of the component to modify available times:
```bash
const timeSlots = [
  "09:00 AM", "10:00 AM", "11:00 AM", // Add your specific slots here
  "2:00 PM", "4:00 PM"
];
```
2. Handling Form Submission
The handleSubmit function currently logs data to the console. Replace the console.log with your actual API call:
```bash
const handleSubmit = (e) => {
  e.preventDefault();
  if (validate()) {
    // REPLACE THIS:
    // console.log("Form Submitted:", ...);
    
    // WITH YOUR LOGIC:
    // await fetch('/api/book', { method: 'POST', body: ... })
    
    setIsSubmitted(true); // Triggers the success screen
  }
};
```
3. Changing Colors (Tailwind)
The component uses standard Tailwind colors (Slate, Violet, Emerald).

a) Backgrounds: bg-slate-950, bg-slate-900

b) Primary Accents: text-violet-500, bg-violet-600

c) Success Accents: text-emerald-400, bg-emerald-500


### To change the theme to Blue, for example, simply find/replace violet with blue and emerald with blue in your editor.


# 📄 License(PUI)
Free to use for personal and commercial projects.