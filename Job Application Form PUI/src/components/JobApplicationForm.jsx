import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Briefcase,
  GraduationCap,
  Upload,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  FileText,
  ChevronDown,
  Save,
  Send,
  X,
  Paperclip,
  Loader2,
  Zap,
  PenTool,
} from "lucide-react";
import classNames from "classnames";
import { format } from "date-fns";

const POSITIONS = [
  "Senior Frontend Engineer",
  "Backend Developer",
  "Product Designer",
  "Project Manager",
  "DevOps Specialist",
];

const SUGGESTED_SKILLS = [
  "React",
  "TypeScript",
  "Node.js",
  "Tailwind CSS",
  "Figma",
  "AWS",
  "GraphQL",
  "Docker",
  "Python",
  "Agile",
];

const genId = () => Math.random().toString(36).substr(2, 9);

const SectionHeading = ({ icon: Icon, title, subtitle }) => (
  <div className="mb-6 mt-10 border-b border-slate-100 pb-4 first:mt-0 break-inside-avoid">
    <div className="flex items-center gap-3 text-slate-800 mb-1">
      <div className="bg-blue-50 text-blue-600 p-2 rounded-lg border border-blue-100">
        {Icon && <Icon size={20} strokeWidth={2.5} />}
      </div>
      <h2 className="text-xl font-bold tracking-tight">{title}</h2>
    </div>
    {subtitle && (
      <p className="text-slate-500 text-sm ml-13 leading-relaxed">
        {subtitle}
      </p>
    )}
  </div>
);

const InputGroup = ({ label, id, error, required, children, className }) => (
  <div className={classNames("flex flex-col gap-2 relative w-full", className)}>
    <label
      htmlFor={id}
      className="text-sm font-semibold text-slate-700 flex justify-between cursor-pointer select-none"
    >
      <span>
        {label} {required && <span className="text-blue-600">*</span>}
      </span>
    </label>
    {children}
    <AnimatePresence>
      {error && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="text-xs text-rose-500 flex items-center gap-1.5 font-medium mt-1 overflow-hidden"
        >
          <AlertCircle size={14} /> <span>{error}</span>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const ActionButton = ({
  onClick,
  variant = "primary",
  icon: Icon,
  children,
  type = "button",
  disabled,
  loading,
  className,
}) => {
  const base =
    "flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-[0.98] touch-manipulation select-none";
  const styles = {
    primary:
      "bg-blue-600 text-white shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-blue-300",
    secondary:
      "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-sm",
    ghost: "text-slate-500 hover:text-blue-600 hover:bg-blue-50",
    danger:
      "text-rose-600 bg-rose-50 border border-rose-100 hover:bg-rose-100 hover:border-rose-200",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={classNames(base, styles[variant], className)}
    >
      {loading ? (
        <Loader2 size={18} className="animate-spin" />
      ) : (
        Icon && <Icon size={18} />
      )}
      {children}
    </button>
  );
};

const PrintableSummary = ({ data }) => (
  <div className="hidden print:block p-8 bg-white text-slate-900 font-sans max-w-[210mm] mx-auto">
    <div className="mb-8 border-b pb-4">
      <h1 className="text-3xl font-bold text-blue-900 mb-2">
        PUI Job Application
      </h1>
      <p className="text-sm text-slate-500">
        Submitted on {format(new Date(), "PPpp")}
      </p>
    </div>

    <div className="space-y-6">
      <section>
        <h3 className="text-lg font-bold border-b border-slate-200 mb-3 pb-1">
          Candidate
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-semibold">Name:</span> {data.firstName}{" "}
            {data.lastName}
          </div>
          <div>
            <span className="font-semibold">Email:</span> {data.email}
          </div>
          <div>
            <span className="font-semibold">Phone:</span> {data.phone}
          </div>
          <div>
            <span className="font-semibold">Location:</span> {data.addressCity},{" "}
            {data.addressState}
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-lg font-bold border-b border-slate-200 mb-3 pb-1">
          Position
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-semibold">Role:</span> {data.position}
          </div>
          <div>
            <span className="font-semibold">Start Date:</span> {data.startDate}
          </div>
          <div>
            <span className="font-semibold">Auth:</span>{" "}
            {data.workAuth === "yes" ? "Authorized" : "Needs Sponsorship"}
          </div>
          <div>
            <span className="font-semibold">Relocation:</span>{" "}
            {data.relocation ? "Yes" : "No"}
          </div>
        </div>
      </section>

      {data.education.length > 0 && (
        <section>
          <h3 className="text-lg font-bold border-b border-slate-200 mb-3 pb-1">
            Education
          </h3>
          {data.education.map((edu, i) => (
            <div key={i} className="mb-2 text-sm">
              <div className="font-semibold">{edu.school}</div>
              <div className="text-slate-600">
                {edu.degree} ({edu.start} - {edu.end})
              </div>
            </div>
          ))}
        </section>
      )}

      {data.experience.length > 0 && (
        <section>
          <h3 className="text-lg font-bold border-b border-slate-200 mb-3 pb-1">
            Experience
          </h3>
          {data.experience.map((exp, i) => (
            <div key={i} className="mb-4 text-sm break-inside-avoid">
              <div className="font-semibold">
                {exp.role} at {exp.company}
              </div>
              <div className="text-xs text-slate-500 mb-1">
                {exp.start} - {exp.end}
              </div>
              <p className="whitespace-pre-wrap text-slate-700">{exp.desc}</p>
            </div>
          ))}
        </section>
      )}

      <section>
        <h3 className="text-lg font-bold border-b border-slate-200 mb-3 pb-1">
          Skills
        </h3>
        <div className="flex flex-wrap gap-2">
          {data.skills.map((s) => (
            <span
              key={s}
              className="px-2 py-1 bg-slate-100 rounded text-xs border"
            >
              {s}
            </span>
          ))}
        </div>
      </section>

      <div className="mt-8 pt-8 border-t-2 border-slate-900">
        <p className="text-sm">
          <strong>Electronic Signature:</strong>{" "}
          {data.signature ? `${data.firstName} ${data.lastName}` : "Not Signed"}
        </p>
      </div>
    </div>
  </div>
);

export default function JobApplicationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    addressStreet: "",
    addressCity: "",
    addressState: "",
    addressZip: "",
    position: "",
    startDate: "",
    workAuth: "yes",
    relocation: false,
    education: [],
    experience: [],
    skills: [],
    references: [{ id: genId(), name: "", relation: "", contact: "" }],
    resume: null,
    portfolio: [],
    coverLetter: "",
    termsAccepted: false,
    signature: false,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const saved = localStorage.getItem("jobAppDraft");
    if (saved) {
      try {
        setFormData(JSON.parse(saved));
        setLastSaved(new Date());
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      localStorage.setItem("jobAppDraft", JSON.stringify(formData));
      setLastSaved(new Date());
    }, 1500);
    return () => clearTimeout(handler);
  }, [formData]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const handleArrayChange = (arrayName, id, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [arrayName]: prev[arrayName].map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const handleFileDrop = (e, type) => {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(
      e.dataTransfer ? e.dataTransfer.files : e.target.files
    );
    if (files.length > 0) {
      if (type === "resume") {
        handleChange("resume", files[0]);
      } else {
        handleChange("portfolio", [...formData.portfolio, ...files]);
      }
    }
  };

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.firstName.trim()) newErrors.firstName = "Required";
    if (!formData.lastName.trim()) newErrors.lastName = "Required";
    if (!formData.email || !emailRegex.test(formData.email))
      newErrors.email = "Valid email required";
    if (!formData.phone.trim()) newErrors.phone = "Required";
    if (!formData.position) newErrors.position = "Required";
    if (!formData.resume) newErrors.resume = "Resume required";
    if (!formData.termsAccepted) newErrors.termsAccepted = "Accept terms";
    if (!formData.signature) newErrors.signature = "Signature required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      const firstError = document.querySelector('[aria-invalid="true"]');
      if (firstError) {
        firstError.focus();
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Submission Payload:", formData);
    setIsSubmitting(false);
    setIsSubmitted(true);
    localStorage.removeItem("jobAppDraft");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isSubmitted) {
    return (
      <>
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 print:hidden">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white max-w-lg w-full rounded-2xl shadow-xl p-8 md:p-12 text-center border border-slate-100"
          >
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <CheckCircle size={40} />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              Received!
            </h2>
            <p className="text-slate-600 mb-8 leading-relaxed">
              Thanks for applying to PUI. We've sent a confirmation to{" "}
              <span className="font-semibold text-slate-900">
                {formData.email}
              </span>
              .
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <ActionButton variant="secondary" onClick={() => window.print()}>
                Print Summary
              </ActionButton>
              <ActionButton onClick={() => window.location.reload()}>
                Return Home
              </ActionButton>
            </div>
          </motion.div>
        </div>
        <PrintableSummary data={formData} />
      </>
    );
  }

  const baseInputClass =
    "w-full h-12 px-4 rounded-lg border bg-white focus:ring-4 outline-none transition-all duration-200 text-base placeholder:text-slate-400 disabled:bg-slate-50 cursor-pointer text-slate-800";
  const getInputClass = (hasError) =>
    classNames(
      baseInputClass,
      hasError
        ? "border-rose-300 focus:border-rose-500 focus:ring-rose-100"
        : "border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-blue-50"
    );

  return (
    <div className="min-h-screen bg-slate-50 py-6 px-4 sm:px-6 font-sans text-slate-800 print:bg-white print:p-0 bg-grid-pattern">
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        html, body {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        body::-webkit-scrollbar {
          display: none;
        }
        .bg-grid-pattern {
          background-size: 40px 40px;
          background-image: linear-gradient(to right, rgba(0, 0, 0, 0.03) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(0, 0, 0, 0.03) 1px, transparent 1px);
        }
        @keyframes shine {
          100% { left: 125%; }
        }
        .animate-shine {
          animation: shine 1s;
        }
        input[type="date"]::-webkit-calendar-picker-indicator { cursor: pointer; opacity: 0.5; }
        input[type="date"]::-webkit-calendar-picker-indicator:hover { opacity: 1; }
        
        @media print {
          @page { margin: 1cm; }
          body { -webkit-print-color-adjust: exact; }
        }
      `}</style>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl shadow-slate-200 border border-slate-100 overflow-hidden print:hidden"
      >
        <header className="bg-white border-b border-slate-100 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-30">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-blue-600 text-white p-1.5 rounded-md shadow-sm">
                <Briefcase size={16} strokeWidth={3} />
              </div>
              <span className="font-bold tracking-wide text-blue-900 uppercase text-xs">
                PUI
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              Job Application
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {lastSaved && (
              <span className="text-xs text-slate-400 hidden sm:flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                <Save size={12} /> Saved {format(lastSaved, "h:mm a")}
              </span>
            )}
            <div className="px-4 py-1.5 bg-blue-50 rounded-full border border-blue-100 text-xs font-bold text-blue-700 uppercase tracking-wider">
              {formData.position || "Draft"}
            </div>
          </div>
        </header>

        <form
          onSubmit={handleSubmit}
          className="p-6 md:p-8 space-y-2"
          noValidate
        >
          <SectionHeading
            icon={User}
            title="Personal Details"
            subtitle="How can we reach you?"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
            <InputGroup
              label="First Name"
              id="firstName"
              required
              error={errors.firstName}
            >
              <input
                type="text"
                id="firstName"
                className={getInputClass(errors.firstName)}
                placeholder="Jane"
                value={formData.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                aria-invalid={!!errors.firstName}
              />
            </InputGroup>
            <InputGroup
              label="Last Name"
              id="lastName"
              required
              error={errors.lastName}
            >
              <input
                type="text"
                id="lastName"
                className={getInputClass(errors.lastName)}
                placeholder="Doe"
                value={formData.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                aria-invalid={!!errors.lastName}
              />
            </InputGroup>
            <InputGroup label="Email" id="email" required error={errors.email}>
              <input
                type="email"
                id="email"
                className={getInputClass(errors.email)}
                placeholder="jane@company.com"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                aria-invalid={!!errors.email}
              />
            </InputGroup>
            <InputGroup label="Phone" id="phone" required error={errors.phone}>
              <input
                type="tel"
                id="phone"
                className={getInputClass(errors.phone)}
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                aria-invalid={!!errors.phone}
              />
            </InputGroup>

            <div className="col-span-1 md:col-span-2 space-y-4 pt-2">
              <InputGroup label="Street Address" id="street">
                <input
                  type="text"
                  id="street"
                  className={getInputClass(false)}
                  placeholder="123 Main St"
                  value={formData.addressStreet}
                  onChange={(e) =>
                    handleChange("addressStreet", e.target.value)
                  }
                />
              </InputGroup>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="City"
                  className={getInputClass(false)}
                  value={formData.addressCity}
                  onChange={(e) => handleChange("addressCity", e.target.value)}
                />
                <input
                  type="text"
                  placeholder="State"
                  className={getInputClass(false)}
                  value={formData.addressState}
                  onChange={(e) => handleChange("addressState", e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Zip Code"
                  className={getInputClass(false)}
                  value={formData.addressZip}
                  onChange={(e) => handleChange("addressZip", e.target.value)}
                />
              </div>
            </div>
          </div>

          <SectionHeading icon={Briefcase} title="Role & Availability" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
            <InputGroup
              label="Position"
              id="position"
              required
              error={errors.position}
            >
              <div className="relative">
                <select
                  id="position"
                  className={classNames(
                    getInputClass(errors.position),
                    "appearance-none pr-10"
                  )}
                  value={formData.position}
                  onChange={(e) => handleChange("position", e.target.value)}
                  aria-invalid={!!errors.position}
                >
                  <option value="">Select...</option>
                  {POSITIONS.map((pos) => (
                    <option key={pos} value={pos}>
                      {pos}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  size={18}
                />
              </div>
            </InputGroup>

            <InputGroup label="Start Date" id="startDate">
              <input
                type="date"
                id="startDate"
                className={getInputClass(false)}
                value={formData.startDate}
                onChange={(e) => handleChange("startDate", e.target.value)}
              />
            </InputGroup>

            <div className="col-span-1 md:col-span-2 p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col md:flex-row gap-4 md:items-center justify-between">
              <div className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-slate-700">
                  Work Authorization
                </span>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <label className="flex items-center gap-2 cursor-pointer p-1">
                    <input
                      type="radio"
                      name="auth"
                      checked={formData.workAuth === "yes"}
                      onChange={() => handleChange("workAuth", "yes")}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-600 cursor-pointer"
                    />
                    <span className="text-sm text-slate-600">Authorized</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer p-1">
                    <input
                      type="radio"
                      name="auth"
                      checked={formData.workAuth === "no"}
                      onChange={() => handleChange("workAuth", "no")}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-600 cursor-pointer"
                    />
                    <span className="text-sm text-slate-600">
                      Need Sponsorship
                    </span>
                  </label>
                </div>
              </div>
              <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-200 mt-2 md:mt-0">
                <input
                  type="checkbox"
                  checked={formData.relocation}
                  onChange={(e) => handleChange("relocation", e.target.checked)}
                  className="w-5 h-5 rounded text-blue-600 focus:ring-blue-600 border-slate-300 cursor-pointer"
                />
                <span className="text-sm font-medium text-slate-700">
                  Willing to relocate
                </span>
              </label>
            </div>
          </div>

          <SectionHeading icon={GraduationCap} title="Education" />
          <div className="space-y-4 mb-8">
            <AnimatePresence>
              {formData.education.map((edu, index) => (
                <motion.div
                  key={edu.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-5 bg-white border border-slate-200 rounded-xl shadow-sm"
                >
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-bold text-slate-400 uppercase">
                      Education #{index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        handleChange(
                          "education",
                          formData.education.filter((e) => e.id !== edu.id)
                        )
                      }
                      className="text-slate-300 hover:text-rose-500 hover:bg-rose-50 p-2 rounded-lg cursor-pointer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      placeholder="School / University"
                      className={getInputClass(false)}
                      value={edu.school}
                      onChange={(e) =>
                        handleArrayChange(
                          "education",
                          edu.id,
                          "school",
                          e.target.value
                        )
                      }
                    />
                    <input
                      placeholder="Degree / Major"
                      className={getInputClass(false)}
                      value={edu.degree}
                      onChange={(e) =>
                        handleArrayChange(
                          "education",
                          edu.id,
                          "degree",
                          e.target.value
                        )
                      }
                    />
                    <div className="grid grid-cols-2 gap-3 md:col-span-2 lg:col-span-1">
                      <input
                        placeholder="Start Year"
                        className={getInputClass(false)}
                        value={edu.start}
                        onChange={(e) =>
                          handleArrayChange(
                            "education",
                            edu.id,
                            "start",
                            e.target.value
                          )
                        }
                      />
                      <input
                        placeholder="End Year"
                        className={getInputClass(false)}
                        value={edu.end}
                        onChange={(e) =>
                          handleArrayChange(
                            "education",
                            edu.id,
                            "end",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <ActionButton
              variant="secondary"
              icon={Plus}
              onClick={() =>
                handleChange("education", [
                  ...formData.education,
                  { id: genId(), school: "", degree: "", start: "", end: "" },
                ])
              }
            >
              Add Education
            </ActionButton>
          </div>

          <SectionHeading icon={Briefcase} title="Work Experience" />
          <div className="space-y-4 mb-8">
            <AnimatePresence>
              {formData.experience.map((exp) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="border border-slate-200 rounded-xl bg-white overflow-hidden shadow-sm"
                >
                  <div
                    className="p-4 flex justify-between items-center cursor-pointer hover:bg-slate-50 select-none"
                    onClick={() =>
                      handleArrayChange(
                        "experience",
                        exp.id,
                        "isOpen",
                        !exp.isOpen
                      )
                    }
                  >
                    <div className="flex items-center gap-3">
                      <ChevronDown
                        size={20}
                        className={classNames(
                          "text-slate-400 transition-transform",
                          exp.isOpen ? "rotate-180" : ""
                        )}
                      />
                      <div>
                        <div className="font-bold text-slate-800 text-sm md:text-base">
                          {exp.role || "New Position"}
                        </div>
                        <div className="text-xs text-slate-500">
                          {exp.company || "Company"}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleChange(
                          "experience",
                          formData.experience.filter((x) => x.id !== exp.id)
                        );
                      }}
                      className="text-slate-300 hover:text-rose-500 p-2 rounded-full cursor-pointer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  {exp.isOpen && (
                    <div className="p-4 border-t border-slate-100 bg-white grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        placeholder="Company Name"
                        className={getInputClass(false)}
                        value={exp.company}
                        onChange={(e) =>
                          handleArrayChange(
                            "experience",
                            exp.id,
                            "company",
                            e.target.value
                          )
                        }
                      />
                      <input
                        placeholder="Job Title"
                        className={getInputClass(false)}
                        value={exp.role}
                        onChange={(e) =>
                          handleArrayChange(
                            "experience",
                            exp.id,
                            "role",
                            e.target.value
                          )
                        }
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="month"
                          className={getInputClass(false)}
                          value={exp.start}
                          onChange={(e) =>
                            handleArrayChange(
                              "experience",
                              exp.id,
                              "start",
                              e.target.value
                            )
                          }
                        />
                        <input
                          type="month"
                          className={getInputClass(false)}
                          value={exp.end}
                          onChange={(e) =>
                            handleArrayChange(
                              "experience",
                              exp.id,
                              "end",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div className="md:col-span-2">
                        <textarea
                          rows={3}
                          placeholder="Responsibilities..."
                          className={classNames(
                            getInputClass(false),
                            "h-auto py-3 min-h-25"
                          )}
                          value={exp.desc}
                          onChange={(e) =>
                            handleArrayChange(
                              "experience",
                              exp.id,
                              "desc",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            <ActionButton
              variant="secondary"
              icon={Plus}
              onClick={() =>
                handleChange("experience", [
                  ...formData.experience,
                  {
                    id: genId(),
                    company: "",
                    role: "",
                    start: "",
                    end: "",
                    desc: "",
                    isOpen: true,
                  },
                ])
              }
            >
              Add Position
            </ActionButton>
          </div>

          <SectionHeading icon={Zap} title="Skills" />
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              {formData.skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 pl-3 pr-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-semibold border border-blue-100"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() =>
                      handleChange(
                        "skills",
                        formData.skills.filter((s) => s !== skill)
                      )
                    }
                    className="hover:bg-blue-200 rounded p-0.5 cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
              <input
                type="text"
                placeholder={
                  formData.skills.length === 0 ? "Type & Enter" : "Add..."
                }
                className="bg-transparent outline-none text-sm py-2 px-2 text-slate-700 placeholder:text-slate-400 flex-1 min-w-30"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const val = e.target.value.trim();
                    if (val && !formData.skills.includes(val)) {
                      handleChange("skills", [...formData.skills, val]);
                      e.target.value = "";
                    }
                  }
                  if (
                    e.key === "Backspace" &&
                    !e.target.value &&
                    formData.skills.length > 0
                  )
                    handleChange("skills", formData.skills.slice(0, -1));
                }}
              />
            </div>
            <div className="border-t border-slate-100 pt-3">
              <p className="text-xs font-bold text-slate-400 mb-2 uppercase">
                Suggested
              </p>
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                {SUGGESTED_SKILLS.map(
                  (s) =>
                    !formData.skills.includes(s) && (
                      <button
                        key={s}
                        type="button"
                        onClick={() =>
                          handleChange("skills", [...formData.skills, s])
                        }
                        className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 whitespace-nowrap cursor-pointer"
                      >
                        + {s}
                      </button>
                    )
                )}
              </div>
            </div>
          </div>

          <SectionHeading icon={Upload} title="Attachments" />
          <div className="grid grid-cols-1 gap-6 mb-8">
            <InputGroup
              label="Resume / CV"
              id="resume"
              required
              error={errors.resume}
            >
              <div
                className={classNames(
                  "relative border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 cursor-pointer",
                  errors.resume
                    ? "border-rose-300 bg-rose-50"
                    : formData.resume
                    ? "border-green-400 bg-green-50"
                    : "border-slate-300 hover:border-blue-400 hover:bg-slate-50"
                )}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.add("border-blue-500");
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove("border-blue-500");
                }}
                onDrop={(e) => handleFileDrop(e, "resume")}
                onClick={() => document.getElementById("resume-input").click()}
              >
                <input
                  type="file"
                  id="resume-input"
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileDrop(e, "resume")}
                />
                {formData.resume ? (
                  <div className="flex flex-col items-center">
                    <FileText size={32} className="text-green-600 mb-2" />
                    <span className="font-semibold text-sm">
                      {formData.resume.name}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleChange("resume", null);
                      }}
                      className="mt-2 text-xs text-rose-500 font-bold hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-slate-500">
                    <Upload size={24} className="mb-2" />
                    <span className="text-sm font-medium">
                      Click or Drag Resume
                    </span>
                    <span className="text-xs opacity-70 mt-1">PDF/DOCX</span>
                  </div>
                )}
              </div>
            </InputGroup>

            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 block">
                Portfolio (Optional)
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => document.getElementById("port-input").click()}
                  className="flex flex-col items-center justify-center w-20 h-20 border border-slate-200 rounded-xl bg-slate-50 hover:bg-white text-slate-400 hover:text-blue-500 cursor-pointer"
                >
                  <Paperclip size={20} />{" "}
                  <span className="text-[10px] mt-1">Add</span>
                </button>
                <input
                  type="file"
                  id="port-input"
                  className="hidden"
                  multiple
                  onChange={(e) => handleFileDrop(e, "portfolio")}
                />
                <div className="flex gap-3 overflow-x-auto no-scrollbar py-2">
                  {formData.portfolio.map((file, i) => (
                    <div
                      key={i}
                      className="min-w-20 w-20 h-20 bg-white rounded-xl border border-slate-200 flex flex-col items-center justify-center p-1 relative shadow-sm"
                    >
                      <FileText size={16} className="text-blue-400 mb-1" />
                      <span className="text-[9px] text-slate-600 truncate w-full text-center">
                        {file.name}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          handleChange(
                            "portfolio",
                            formData.portfolio.filter((_, idx) => idx !== i)
                          )
                        }
                        className="absolute -top-2 -right-2 bg-white text-rose-500 rounded-full p-0.5 border shadow cursor-pointer"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <SectionHeading icon={PenTool} title="Cover Letter" />
          <div className="relative mb-2">
            <textarea
              className={classNames(
                getInputClass(false),
                "h-40 py-3 resize-none font-normal leading-relaxed"
              )}
              placeholder="Why are you a good fit?"
              value={formData.coverLetter}
              onChange={(e) => handleChange("coverLetter", e.target.value)}
            />
            <span className="absolute bottom-2 right-2 text-[10px] text-slate-400 bg-white px-1 rounded">
              {formData.coverLetter.length} chars
            </span>
          </div>
          <button
            type="button"
            onClick={() =>
              handleChange(
                "coverLetter",
                "Dear Hiring Manager,\n\nI am writing to apply for this position..."
              )
            }
            className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1 cursor-pointer mb-8"
          >
            <FileText size={12} /> Use Template
          </button>

          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-8">
            <h3 className="font-bold text-slate-900 mb-4 text-base">
              Declaration
            </h3>
            <label className="flex items-start gap-3 cursor-pointer mb-4">
              <input
                type="checkbox"
                checked={formData.termsAccepted}
                onChange={(e) =>
                  handleChange("termsAccepted", e.target.checked)
                }
                className="mt-1 w-4 h-4 rounded text-blue-600 focus:ring-blue-600 border-slate-300 cursor-pointer"
              />
              <span
                className={classNames(
                  "text-sm",
                  errors.termsAccepted ? "text-rose-600" : "text-slate-600"
                )}
              >
                I declare the information provided is true. *
              </span>
            </label>
            <div
              className={classNames(
                "border rounded-lg p-4 bg-white",
                errors.signature
                  ? "border-rose-300 ring-1 ring-rose-200"
                  : "border-slate-200"
              )}
            >
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-500 uppercase mb-2 select-none">
                <input
                  type="checkbox"
                  checked={formData.signature}
                  onChange={(e) => handleChange("signature", e.target.checked)}
                  className="rounded cursor-pointer text-blue-600"
                />
                E-Signature *
              </label>
              <div className="h-12 bg-slate-50/50 border-b border-dashed border-slate-300 flex items-center justify-center">
                {formData.signature ? (
                  <span className="font-cursive text-xl text-blue-900 font-bold italic font-serif">
                    {formData.firstName} {formData.lastName}
                  </span>
                ) : (
                  <span className="text-slate-400 text-xs italic">
                    Tick box to sign
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse md:flex-row gap-3 pt-4 border-t border-slate-100">
            <ActionButton
              variant="ghost"
              onClick={() => {
                if (confirm("Clear form?")) {
                  localStorage.removeItem("jobAppDraft");
                  window.location.reload();
                }
              }}
              className="w-full md:w-auto"
            >
              Reset
            </ActionButton>
            <ActionButton
              type="submit"
              variant="primary"
              icon={Send}
              loading={isSubmitting}
              className="w-full md:flex-1"
            >
              Submit Application
            </ActionButton>
          </div>
        </form>
      </motion.div>
      <div className="text-center mt-8 text-slate-400 text-xs font-medium print:hidden">
        © {new Date().getFullYear()} PUI
      </div>
    </div>
  );
}
