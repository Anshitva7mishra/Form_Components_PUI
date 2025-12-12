# PUI Basketball Order Form Component

A high-performance, responsive React component designed for sports merchandise ordering. It features a "dark glass" aesthetic, live T-shirt visualization with custom logo upload, and integrated validation.

## Features

- **Glassmorphism UI**: Modern, dark-themed frosted glass effect using Tailwind CSS.
- **Live Product Preview**: Upload a logo and position/scale it directly onto the T-shirt mockup.
- **Client-side Export**: Download the customized jersey preview as a PNG using HTML5 Canvas.
- **Responsive Design**: Fully responsive layout that adapts from mobile to desktop.
- **Animations**: Smooth entrance and interaction animations using Framer Motion.
- **Validation**: Built-in form validation for required fields and email formats.

## Prerequisites

Ensure your project is set up with **React** and **Tailwind CSS**.

### Install Dependencies

Install the required packages for animations and icons:

```bash
npm install framer-motion lucide-react
```
## Usage
1. Copy the BasketballOrderForm.jsx file into your project (e.g., src/components/BasketballOrderForm.jsx).

2. Import and use it in your page or parent component:

```bash
import BasketballOrderForm from './components/BasketballOrderForm';

function App() {
  return (
    <div className="App">
      <BasketballOrderForm />
    </div>
  );
}

export default App;
```

## Customization
a) Assets: Modify the ASSETS constant at the top of the file to change the background image, T-shirt base image, or default logo.

b) Colors: The component heavily relies on orange-500 for the basketball theme. You can perform a find-and-replace to switch this to your team's primary color (e.g., blue-600).

c) Print Area: If you change the T-shirt image, adjust the printArea coordinates in the downloadPreview function to ensure the generated PNG aligns with the visual CSS positioning.

# License(PUI)
Free to use for personal and commercial projects.