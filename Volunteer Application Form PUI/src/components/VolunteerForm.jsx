import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Mail,
  Phone,
  Check,
  ChevronDown,
  X,
  User,
  Briefcase,
  GraduationCap,
  PenTool,
  Eraser,
  Calendar,
  Heart,
} from "lucide-react";
import classNames from "classnames";

const DAYS_OF_WEEK = [
  "Mondays",
  "Tuesdays",
  "Wednesdays",
  "Thursdays",
  "Fridays",
  "Saturdays",
  "Sundays",
];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 100 }, (_, i) => CURRENT_YEAR - i);
const DAYS_IN_MONTH = Array.from({ length: 31 }, (_, i) => i + 1);

const ACTIVITY_OPTIONS = [
  "Event Planning",
  "Fundraising",
  "Mentoring",
  "Administrative Support",
  "Teaching/Tutoring",
  "Food Distribution",
  "Community Outreach",
  "Medical/Health Aid",
];

const INITIAL_DATA = {
  prefix: "Mr.",
  firstName: "",
  lastName: "",
  birthMonth: "",
  birthDay: "",
  birthYear: "",
  email: "",
  phone: "",
  street1: "",
  street2: "",
  city: "",
  state: "",
  zip: "",
  college: "",
  dept: "",
  company: "",
  position: "",
  interests: [],
  experience: "",
  availabilityDays: [],
  timeFromHH: "",
  timeFromMM: "",
  timeFromAMPM: "AM",
  timeToHH: "",
  timeToMM: "",
  timeToAMPM: "PM",
  notes: "",
  agreedToTerms: false,
  signatureDate: "",
};

const InputLabel = ({ htmlFor, children, required }) => (
  <label
    htmlFor={htmlFor}
    className="block text-sm font-bold text-teal-900 mb-2 ml-1 cursor-pointer"
  >
    {children} {required && <span className="text-teal-600">*</span>}
  </label>
);

const HelperText = ({ children }) => (
  <p className="text-[10px] text-slate-400 mt-1.5 ml-1 uppercase tracking-wider font-semibold">
    {children}
  </p>
);

const ErrorMsg = ({ message }) => (
  <motion.div
    initial={{ opacity: 0, height: 0 }}
    animate={{ opacity: 1, height: "auto" }}
    className="flex items-center gap-1.5 mt-2 ml-1"
  >
    <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
    <p className="text-xs text-rose-500 font-bold">{message}</p>
  </motion.div>
);

const SignaturePad = ({ onEnd, hasSignature, setHasSignature, error }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateSize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        const rect = parent.getBoundingClientRect();
        const ratio = window.devicePixelRatio || 1;
        canvas.width = rect.width * ratio;
        canvas.height = rect.height * ratio;
        const ctx = canvas.getContext("2d");
        ctx.scale(ratio, ratio);
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = "#0f766e";
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const getPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const startDrawing = (e) => {
    if (e.cancelable) e.preventDefault();
    setIsDrawing(true);
    const { x, y } = getPos(e);
    const ctx = canvasRef.current.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    if (e.cancelable) e.preventDefault();
    const { x, y } = getPos(e);
    const ctx = canvasRef.current.getContext("2d");
    ctx.lineTo(x, y);
    ctx.stroke();
    if (!hasSignature) setHasSignature(true);
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      onEnd();
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  return (
    <div className="relative group cursor-pointer touch-none">
      <div
        className={classNames(
          "relative w-full h-40 bg-slate-50 border-2 rounded-2xl overflow-hidden cursor-crosshair transition-all duration-300",
          error
            ? "border-rose-300 ring-4 ring-rose-50/50"
            : "border-slate-200 hover:border-teal-400 focus-within:ring-4 focus-within:ring-teal-50"
        )}
      >
        {!hasSignature && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-40 p-4 text-center">
            <PenTool size={24} className="mb-2 text-teal-700" />
            <span className="text-sm font-handwriting text-teal-800 font-medium">
              Draw signature here
            </span>
          </div>
        )}
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="absolute inset-0 w-full h-full touch-none z-10"
        />
        <div className="absolute bottom-10 left-6 right-6 h-0.5 bg-slate-200 rounded-full z-0" />
      </div>

      {hasSignature && (
        <button
          type="button"
          onClick={clearCanvas}
          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur shadow-sm rounded-lg text-slate-500 hover:text-rose-500 hover:bg-rose-50 transition-all z-20 cursor-pointer"
        >
          <Eraser size={16} />
        </button>
      )}
    </div>
  );
};

export default function VolunteerForm() {
  const [submitted, setSubmitted] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [formData, setFormData] = useState(INITIAL_DATA);
  const [errors, setErrors] = useState({});

  const formatPhone = (value) => {
    if (!value) return value;
    const phoneNumber = value.replace(/[^\d]/g, "");
    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 7) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    }
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(
      3,
      6
    )}-${phoneNumber.slice(6, 10)}`;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let finalValue = type === "checkbox" ? checked : value;
    if (name === "phone") finalValue = formatPhone(value);
    setFormData((prev) => ({ ...prev, [name]: finalValue }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleMultiSelect = (item) => {
    setFormData((prev) => {
      const exists = prev.interests.includes(item);
      return {
        ...prev,
        interests: exists
          ? prev.interests.filter((i) => i !== item)
          : [...prev.interests, item],
      };
    });
  };

  const handleDayToggle = (day) => {
    setFormData((prev) => {
      const exists = prev.availabilityDays.includes(day);
      return {
        ...prev,
        availabilityDays: exists
          ? prev.availabilityDays.filter((d) => d !== day)
          : [...prev.availabilityDays, day],
      };
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email))
      newErrors.email = "Valid email required";
    if (!formData.birthMonth || !formData.birthDay || !formData.birthYear)
      newErrors.birthDate = "Incomplete date";
    if (!formData.agreedToTerms)
      newErrors.agreedToTerms = "Term acceptance required";
    if (!hasSignature) newErrors.signature = "Signature required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const firstError = document.querySelector('[aria-invalid="true"]');
      if (firstError)
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleReset = () => {
    setFormData(INITIAL_DATA);
    setHasSignature(false);
    setErrors({});
    setSubmitted(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl shadow-xl p-8 md:p-12 max-w-md w-full text-center border-t-8 border-teal-500"
        >
          <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-6 text-teal-600">
            <Check size={40} strokeWidth={4} />
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-800 mb-4">
            Application Sent!
          </h2>
          <p className="text-slate-500 mb-8 font-medium">
            We have received your details securely. Thank you for offering your
            time to help our cause.
          </p>
          <button
            onClick={handleReset}
            className="w-full bg-teal-900 text-white py-4 rounded-xl font-bold hover:bg-teal-800 transition-all active:scale-95 cursor-pointer"
          >
            Start New Application
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 py-4 md:py-10 px-3 md:px-6 font-sans flex justify-center">
      <style>{`
        ::-webkit-scrollbar { display: none; }
        html, body { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl bg-white rounded-3xl md:rounded-[2.5rem] shadow-xl overflow-hidden ring-1 ring-slate-900/5"
      >
        <div className="relative bg-teal-700 min-h-70 md:h-100 flex flex-col md:flex-row items-center justify-between overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-teal-600 via-teal-700 to-emerald-800 z-0"></div>
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] bg-size-[20px_20px] z-0"></div>

          <div className="relative z-10 w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center items-center md:items-start text-center md:text-left order-2 md:order-1">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2 mb-4 bg-teal-800/40 px-4 py-1.5 rounded-full border border-teal-500/30 backdrop-blur-sm"
            >
              <Heart size={14} className="text-teal-300 fill-teal-300" />
              <span className="text-teal-50 font-bold text-xs uppercase tracking-widest">
                Join the Cause
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-6xl font-black text-white leading-tight mb-2 md:mb-0"
            >
              Volunteer <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-teal-200 to-emerald-200">
                Application
              </span>
            </motion.h1>
          </div>

          <div className="relative z-10 w-full md:w-1/2 h-48 md:h-full order-1 md:order-2 flex items-end justify-center md:justify-end">
            <div className="relative w-full h-full md:mask-gradient">
              <img
                src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                alt="Volunteers"
                className="w-full h-full object-cover object-center opacity-90 md:opacity-100"
              />
              <div className="absolute inset-0 bg-linear-to-t from-teal-700 via-transparent to-transparent md:bg-linear-to-l md:from-transparent md:to-teal-700"></div>
            </div>
          </div>
        </div>

        <div className="px-6 md:px-16 pt-10 pb-8 text-center max-w-3xl mx-auto">
          <p className="text-slate-600 font-serif italic text-lg md:text-xl leading-relaxed">
            "Example is a nonprofit organization that provides basic
            health-care, education, nutrition, job skills, and community
            development programs to those who have been deprived of basic living
            conditions."
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="px-5 md:px-16 pb-16 space-y-10"
        >
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b-2 border-slate-100 pb-4">
              <div className="p-2 bg-teal-50 text-teal-700 rounded-lg">
                <User size={20} strokeWidth={2.5} />
              </div>
              <h3 className="text-lg md:text-xl font-black text-teal-900 tracking-tight">
                Personal Information
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              <div className="md:col-span-2">
                <InputLabel htmlFor="prefix">Prefix</InputLabel>
                <div className="relative">
                  <select
                    id="prefix"
                    name="prefix"
                    value={formData.prefix}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 font-medium py-3.5 px-4 rounded-xl focus:ring-4 focus:ring-teal-50 focus:border-teal-500 outline-none appearance-none cursor-pointer hover:bg-white transition-all"
                  >
                    <option>Mr.</option>
                    <option>Ms.</option>
                    <option>Mx.</option>
                    <option>Mrs.</option>
                    <option>Dr.</option>
                  </select>
                  <ChevronDown
                    className="absolute right-3 top-4.5 text-slate-400 pointer-events-none"
                    size={16}
                  />
                </div>
              </div>

              <div className="md:col-span-5">
                <InputLabel htmlFor="firstName" required>
                  First Name
                </InputLabel>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  aria-invalid={!!errors.firstName}
                  className={classNames(
                    "w-full bg-slate-50 border py-3.5 px-4 rounded-xl font-medium focus:ring-4 outline-none transition-all cursor-text hover:bg-white",
                    errors.firstName
                      ? "border-rose-300 focus:ring-rose-50"
                      : "border-slate-200 focus:ring-teal-50 focus:border-teal-500"
                  )}
                />
                {errors.firstName && <ErrorMsg message={errors.firstName} />}
              </div>

              <div className="md:col-span-5">
                <InputLabel htmlFor="lastName" required>
                  Last Name
                </InputLabel>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  aria-invalid={!!errors.lastName}
                  className={classNames(
                    "w-full bg-slate-50 border py-3.5 px-4 rounded-xl font-medium focus:ring-4 outline-none transition-all cursor-text hover:bg-white",
                    errors.lastName
                      ? "border-rose-300 focus:ring-rose-50"
                      : "border-slate-200 focus:ring-teal-50 focus:border-teal-500"
                  )}
                />
                {errors.lastName && <ErrorMsg message={errors.lastName} />}
              </div>
            </div>

            <div>
              <InputLabel required>Birth Date</InputLabel>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {["Month", "Day", "Year"].map((field) => {
                  const name = `birth${field}`;
                  const options =
                    field === "Month"
                      ? MONTHS
                      : field === "Day"
                      ? DAYS_IN_MONTH
                      : YEARS;
                  return (
                    <div key={field} className="relative">
                      <select
                        name={name}
                        value={formData[name]}
                        onChange={handleChange}
                        className={classNames(
                          "w-full bg-slate-50 border py-3.5 px-4 rounded-xl font-medium focus:ring-4 outline-none appearance-none cursor-pointer hover:bg-white transition-all",
                          errors.birthDate && !formData[name]
                            ? "border-rose-300 focus:ring-rose-50"
                            : "border-slate-200 focus:ring-teal-50 focus:border-teal-500"
                        )}
                      >
                        <option value="">{field}</option>
                        {options.map((o) => (
                          <option key={o} value={o}>
                            {o}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        className="absolute right-3 top-4.5 text-slate-400 pointer-events-none"
                        size={16}
                      />
                      <HelperText>{field}</HelperText>
                    </div>
                  );
                })}
              </div>
              {errors.birthDate && <ErrorMsg message={errors.birthDate} />}
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b-2 border-slate-100 pb-4">
              <div className="p-2 bg-teal-50 text-teal-700 rounded-lg">
                <MapPin size={20} strokeWidth={2.5} />
              </div>
              <h3 className="text-lg md:text-xl font-black text-teal-900 tracking-tight">
                Contact Details
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <InputLabel htmlFor="email" required>
                  Email
                </InputLabel>
                <div className="relative group">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="example@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={classNames(
                      "w-full bg-slate-50 border py-3.5 pl-11 pr-4 rounded-xl font-medium focus:ring-4 outline-none transition-all cursor-text hover:bg-white",
                      errors.email
                        ? "border-rose-300 focus:ring-rose-50"
                        : "border-slate-200 focus:ring-teal-50 focus:border-teal-500"
                    )}
                  />
                  <Mail
                    className="absolute left-4 top-4 text-slate-400 group-focus-within:text-teal-600 transition-colors"
                    size={18}
                  />
                </div>
                {errors.email && <ErrorMsg message={errors.email} />}
              </div>

              <div>
                <InputLabel htmlFor="phone">Phone Number</InputLabel>
                <div className="relative group">
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="(555) 000-0000"
                    value={formData.phone}
                    onChange={handleChange}
                    maxLength={14}
                    className="w-full bg-slate-50 border border-slate-200 py-3.5 pl-11 pr-4 rounded-xl font-medium focus:ring-4 focus:ring-teal-50 focus:border-teal-500 outline-none transition-all cursor-text hover:bg-white"
                  />
                  <Phone
                    className="absolute left-4 top-4 text-slate-400 group-focus-within:text-teal-600 transition-colors"
                    size={18}
                  />
                </div>
              </div>
            </div>

            <div>
              <InputLabel>Address</InputLabel>
              <div className="space-y-4">
                <input
                  type="text"
                  name="street1"
                  placeholder="Street Address"
                  value={formData.street1}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 py-3.5 px-4 rounded-xl font-medium focus:ring-4 focus:ring-teal-50 focus:border-teal-500 outline-none transition-all cursor-text hover:bg-white"
                />
                <input
                  type="text"
                  name="street2"
                  placeholder="Apartment, Suite, etc."
                  value={formData.street2}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 py-3.5 px-4 rounded-xl font-medium focus:ring-4 focus:ring-teal-50 focus:border-teal-500 outline-none transition-all cursor-text hover:bg-white"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-200 py-3.5 px-4 rounded-xl font-medium focus:ring-4 focus:ring-teal-50 focus:border-teal-500 outline-none transition-all cursor-text hover:bg-white"
                    />
                    <HelperText>City</HelperText>
                  </div>
                  <div>
                    <input
                      type="text"
                      name="state"
                      placeholder="State / Province"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-200 py-3.5 px-4 rounded-xl font-medium focus:ring-4 focus:ring-teal-50 focus:border-teal-500 outline-none transition-all cursor-text hover:bg-white"
                    />
                    <HelperText>State / Province</HelperText>
                  </div>
                </div>
                <div>
                  <input
                    type="text"
                    name="zip"
                    placeholder="Postal / Zip Code"
                    value={formData.zip}
                    onChange={handleChange}
                    className="w-full md:w-1/2 bg-slate-50 border border-slate-200 py-3.5 px-4 rounded-xl font-medium focus:ring-4 focus:ring-teal-50 focus:border-teal-500 outline-none transition-all cursor-text hover:bg-white"
                  />
                  <HelperText>Postal / Zip Code</HelperText>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b-2 border-slate-100 pb-4">
              <div className="p-2 bg-teal-50 text-teal-700 rounded-lg">
                <GraduationCap size={20} strokeWidth={2.5} />
              </div>
              <h3 className="text-lg md:text-xl font-black text-teal-900 tracking-tight">
                Background
              </h3>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1">
                  <InputLabel htmlFor="college">College/School</InputLabel>
                  <input
                    type="text"
                    id="college"
                    name="college"
                    value={formData.college}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 py-3.5 px-4 rounded-xl font-medium focus:ring-4 focus:ring-teal-50 focus:border-teal-500 outline-none transition-all cursor-text hover:bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <InputLabel htmlFor="dept">Department/Field</InputLabel>
                  <input
                    type="text"
                    id="dept"
                    name="dept"
                    value={formData.dept}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 py-3.5 px-4 rounded-xl font-medium focus:ring-4 focus:ring-teal-50 focus:border-teal-500 outline-none transition-all cursor-text hover:bg-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1">
                  <InputLabel htmlFor="company">Current Company</InputLabel>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 py-3.5 px-4 rounded-xl font-medium focus:ring-4 focus:ring-teal-50 focus:border-teal-500 outline-none transition-all cursor-text hover:bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <InputLabel htmlFor="position">Position/Role</InputLabel>
                  <input
                    type="text"
                    id="position"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 py-3.5 px-4 rounded-xl font-medium focus:ring-4 focus:ring-teal-50 focus:border-teal-500 outline-none transition-all cursor-text hover:bg-white"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b-2 border-slate-100 pb-4">
              <div className="p-2 bg-teal-50 text-teal-700 rounded-lg">
                <Briefcase size={20} strokeWidth={2.5} />
              </div>
              <h3 className="text-lg md:text-xl font-black text-teal-900 tracking-tight">
                Interests & Availability
              </h3>
            </div>

            <div>
              <InputLabel>
                Which volunteering activities interest you?
              </InputLabel>
              <div className="flex flex-wrap gap-2 mb-3">
                <AnimatePresence>
                  {formData.interests.map((item) => (
                    <motion.span
                      key={item}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-teal-100 text-teal-800 border border-teal-200 text-sm font-bold shadow-sm"
                    >
                      {item}
                      <button
                        type="button"
                        onClick={() => handleMultiSelect(item)}
                        className="hover:bg-teal-200 rounded-full p-0.5 transition-colors cursor-pointer"
                      >
                        <X size={14} />
                      </button>
                    </motion.span>
                  ))}
                </AnimatePresence>
              </div>
              <div className="relative">
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      handleMultiSelect(e.target.value);
                      e.target.value = "";
                    }
                  }}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 font-medium py-3.5 px-4 rounded-xl focus:ring-4 focus:ring-teal-50 focus:border-teal-500 outline-none appearance-none cursor-pointer hover:bg-white transition-all"
                >
                  <option value="">Select items...</option>
                  {ACTIVITY_OPTIONS.filter(
                    (o) => !formData.interests.includes(o)
                  ).map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="absolute right-3 top-4.5 text-slate-400 pointer-events-none"
                  size={16}
                />
              </div>
            </div>

            <div className="border-t border-slate-100 pt-6">
              <InputLabel>Select your available days</InputLabel>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                {DAYS_OF_WEEK.map((day) => (
                  <label
                    key={day}
                    className="flex items-center gap-3 cursor-pointer group p-3 hover:bg-slate-50 rounded-xl transition-all border border-transparent hover:border-slate-200 bg-white"
                  >
                    <div className="relative flex items-center justify-center">
                      <input
                        type="checkbox"
                        checked={formData.availabilityDays.includes(day)}
                        onChange={() => handleDayToggle(day)}
                        className="peer sr-only"
                      />
                      <div className="w-5 h-5 border-2 border-slate-300 rounded-md bg-white peer-checked:bg-teal-600 peer-checked:border-teal-600 transition-all shadow-sm"></div>
                      <Check
                        size={12}
                        strokeWidth={3}
                        className="absolute text-white opacity-0 peer-checked:opacity-100 transition-opacity"
                      />
                    </div>
                    <span className="text-slate-600 font-medium group-hover:text-teal-900">
                      {day}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <InputLabel htmlFor="notes">Additional notes</InputLabel>
              <textarea
                id="notes"
                name="notes"
                rows="3"
                value={formData.notes}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 py-3.5 px-4 rounded-xl font-medium focus:ring-4 focus:ring-teal-50 focus:border-teal-500 outline-none resize-none transition-all cursor-text hover:bg-white"
              ></textarea>
            </div>
          </section>

          <section className="pt-8 border-t-2 border-slate-100 space-y-8">
            <div className="flex items-start gap-3 bg-teal-50/50 p-4 md:p-5 rounded-2xl border border-teal-100 hover:border-teal-200 transition-colors">
              <div className="relative flex items-center mt-0.5">
                <input
                  type="checkbox"
                  id="terms"
                  name="agreedToTerms"
                  checked={formData.agreedToTerms}
                  onChange={handleChange}
                  className="peer sr-only"
                />
                <label
                  htmlFor="terms"
                  className={classNames(
                    "w-6 h-6 border-2 rounded-md transition-all flex items-center justify-center cursor-pointer shadow-sm",
                    errors.agreedToTerms
                      ? "border-rose-400 bg-rose-50"
                      : "border-slate-300 bg-white peer-checked:bg-teal-600 peer-checked:border-teal-600"
                  )}
                >
                  <Check
                    size={16}
                    strokeWidth={3}
                    className="text-white opacity-0 peer-checked:opacity-100"
                  />
                </label>
              </div>
              <div>
                <label
                  htmlFor="terms"
                  className="text-slate-700 text-sm md:text-base font-medium cursor-pointer select-none"
                >
                  I agree to the{" "}
                  <a
                    href="#"
                    className="text-teal-700 hover:text-teal-800 underline underline-offset-4 decoration-teal-300 font-bold"
                  >
                    terms & conditions
                  </a>{" "}
                  of membership.
                </label>
                {errors.agreedToTerms && (
                  <p className="text-xs text-rose-500 font-bold mt-1">
                    Acceptance required
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <InputLabel htmlFor="sigDate">Today's Date</InputLabel>
                <div className="relative">
                  <input
                    type="date"
                    id="sigDate"
                    name="signatureDate"
                    value={formData.signatureDate}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 py-3.5 px-4 rounded-xl font-medium focus:ring-4 focus:ring-teal-50 focus:border-teal-500 outline-none text-slate-700 cursor-pointer hover:bg-white transition-all"
                  />
                  <Calendar
                    className="absolute right-4 top-4 text-slate-400 pointer-events-none"
                    size={20}
                  />
                </div>
              </div>

              <div>
                <InputLabel required>Digital Signature</InputLabel>
                <SignaturePad
                  hasSignature={hasSignature}
                  setHasSignature={setHasSignature}
                  onEnd={() => {
                    if (errors.signature)
                      setErrors((prev) => ({ ...prev, signature: null }));
                  }}
                  error={errors.signature}
                />
                {errors.signature && <ErrorMsg message={errors.signature} />}
              </div>
            </div>

            <div className="flex justify-center pt-8 pb-4">
              <motion.button
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 20px 25px -5px rgba(13, 148, 136, 0.4)",
                }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full md:w-auto min-w-70 bg-linear-to-r from-teal-700 to-emerald-600 text-white font-black text-lg px-8 py-4 rounded-full shadow-2xl shadow-teal-600/20 hover:from-teal-800 hover:to-emerald-700 transition-all uppercase tracking-widest flex items-center justify-center gap-3 cursor-pointer group"
              >
                Submit Application
                <Check className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </motion.button>
            </div>
          </section>
        </form>
      </motion.div>
    </div>
  );
}
