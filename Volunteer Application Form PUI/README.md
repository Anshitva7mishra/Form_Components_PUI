# PUI Volunteer Application Form Component

A production-ready, mobile-responsive volunteer application form built with **React**, **Tailwind CSS**, and **Framer Motion**. 

This component features a modern "Teal & Emerald" aesthetic, built-in validation, a digital signature pad, and smooth micro-interactions.

## ✨ Features

* **📱 Fully Responsive:** Optimized layout for mobile, tablet, and desktop (collapsing grids, touch-friendly inputs).
* **✍️ Digital Signature:** Integrated HTML5 Canvas signature pad with mouse and touch support.
* **✅ Form Validation:** Built-in validation for required fields, email formats, and terms acceptance.
* **✨ UX Enhancements:** * Auto-formatting phone number input `(555) 000-0000`.
    * Hidden scrollbars for a cleaner aesthetic.
    * Smooth entry animations and hover states.
* **🎨 Modern Design:** Glassmorphism effects, gradient banners, and accessible focus states.

## 🛠️ Prerequisites

This component relies on a few lightweight libraries for icons, animations, and class merging.

### Install Dependencies

Run the following command in your project root:

```bash
npm install framer-motion lucide-react classnames
```

## 🚀 Usage
1. Create a file named VolunteerForm.jsx in your components directory (e.g., src/components/VolunteerForm.jsx).

2. Paste the full component code into that file.

3. Import and use it in your page or parent component:

```bash
import React from 'react';
import VolunteerForm from './components/VolunteerForm';

export default function App() {
  return (
    <div className="App">
      <VolunteerForm />
    </div>
  );
}
```
## ⚙️ Customization
### Handling Form Submission
Currently, the form logs data to the console and shows a success state. To connect it to your backend:

1. Locate the handleSubmit function inside VolunteerForm.jsx.

2. Replace the console.log with your API call.

```bash
const handleSubmit = async (e) => {
  e.preventDefault();
  if (validate()) {
    // Example API call
    // await fetch('/api/volunteer', { method: 'POST', body: JSON.stringify(formData) });
    
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } 
  // ...
};
```
### Changing the Color Scheme
The component primarily uses teal (primary), slate (text/bg), and rose (errors). To change the theme to Blue, for example, use your IDE's "Find and Replace" feature:

-> Replace teal- with blue-

-> Replace emerald- with indigo-

### Images
The component uses an external Unsplash image for the header. You can replace the src in the <img> tag with your own local asset or URL.

```bash
<img 
  src="/path/to/your/local-image.jpg" 
  alt="Volunteers" 
  className="object-cover w-full h-full"
/>
```
## 📄 License(PUI)
This component is open-source. Feel free to use it in personal or commercial projects.