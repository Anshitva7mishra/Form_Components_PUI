# PUI Job Application Form

A modern, responsive, and accessible job application form component built with React, Tailwind CSS, and Framer Motion. This component features client-side validation, drag-and-drop file uploads, auto-save functionality, and a printable PDF-ready summary.

## Features

- **Responsive Design:** Mobile-first layout that adapts gracefully to tablets and desktops.
- **Client-Side Validation:** Instant feedback for required fields and email formats.
- **Drag & Drop Uploads:** Intuitive interface for uploading Resumes and Portfolio items.
- **Auto-Save:** Automatically persists form data to `localStorage` to prevent data loss.
- **Print Optimization:** Generates a clean, branded summary sheet when printing (Ctrl+P) after submission.
- **No Scrollbars:** Clean UI with hidden scrollbars for horizontal scrolling sections (Skills, Portfolio).
- **Animations:** Smooth transitions using Framer Motion.

## Prerequisites

Ensure your project is set up with:
- **React** (v16.8+)
- **Tailwind CSS** (v3.0+)

## Installation

1.  **Install Dependencies:**
    Run the following command in your project terminal:

    ```bash
    npm install framer-motion lucide-react classnames date-fns
    ```

2.  **Add the Component:**
    Copy the `JobApplicationForm.jsx` file into your project (e.g., `src/components/JobApplicationForm.jsx`).

3.  **Usage:**
    Import and use it in your page or parent component:

    ```jsx
    import JobApplicationForm from './components/JobApplicationForm';

    function App() {
      return (
        <div>
          <JobApplicationForm />
        </div>
      );
    }

    export default App;
    ```


## Customization

-   **Colors:** The form uses Tailwind's `blue-600` as the primary brand color. You can find and replace `blue-` with `indigo-`, `emerald-`, etc., to match your branding.
-   **Positions & Skills:** Edit the `POSITIONS` and `SUGGESTED_SKILLS` constant arrays at the top of the file to update the dropdowns and suggestions.
-   **Branding:** The logo text "PUI" can be changed in the `<header>` section and the footer.

## API Integration

Currently, the `handleSubmit` function simulates a network request with a timeout. To connect a real backend:

1.  Locate `handleSubmit` inside the component.
2.  Replace the `setTimeout` promise with your actual API call (e.g., using `fetch` or `axios`).
3.  Ensure you handle multipart form data if sending files to a server.

```javascript
// Example integration
const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validate()) return;

  setIsSubmitting(true);
  
  const formDataObj = new FormData();
  formDataObj.append('firstName', formData.firstName);
  // ... append other fields and files ...

  try {
    await fetch('/api/submit-application', { method: 'POST', body: formDataObj });
    setIsSubmitted(true);
    localStorage.removeItem('jobAppDraft');
  } catch (error) {
    console.error(error);
  } finally {
    setIsSubmitting(false);
  }
};
```

# 📄 License(PUI)
Free to use for personal and commercial projects.