import { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar as CalendarIcon,
  Clock,
  Globe,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
} from "date-fns";
import classNames from "classnames";

const cn = (...classes) => classNames(classes);

const INITIAL_FORM_STATE = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  contactMethod: "",
  bestTime: "",
  helpText: "",
  notes: "",
};

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

const GlobalStyles = () => (
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
      background-image: linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
    }
    @keyframes shine {
      100% { left: 125%; }
    }
    .animate-shine {
      animation: shine 1s;
    }
  `}</style>
);

const InputField = ({
  label,
  id,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  subLabel,
  className,
  ...props
}) => (
  <motion.div
    variants={itemVariants}
    className={cn("flex flex-col space-y-2", className)}
  >
    <label
      htmlFor={id}
      className="text-sm font-medium text-slate-300 ml-1 cursor-pointer select-none"
    >
      {label}
    </label>
    <div className="relative group">
      <input
        id={id}
        type={type}
        value={value || ""}
        onChange={onChange}
        placeholder={placeholder}
        className={cn(
          "w-full px-4 py-3.5 rounded-xl border bg-slate-900/50 text-slate-100 placeholder:text-slate-600 outline-none transition-all duration-300",
          "hover:border-slate-500",
          "focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 focus:bg-slate-900",
          error ? "border-red-500/50 bg-red-500/5" : "border-slate-700/60"
        )}
        {...props}
      />
      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute right-3 top-3.5 pointer-events-none"
        >
          <AlertCircle className="h-5 w-5 text-red-400" />
        </motion.div>
      )}
    </div>
    <div className="flex justify-between px-1 h-4">
      {subLabel && <span className="text-xs text-slate-500">{subLabel}</span>}
      {error && (
        <span className="text-xs text-red-400 font-medium ml-auto">
          {error}
        </span>
      )}
    </div>
  </motion.div>
);

const SelectField = ({ label, id, options, value, onChange, className }) => (
  <motion.div
    variants={itemVariants}
    className={cn("flex flex-col space-y-2", className)}
  >
    <label
      htmlFor={id}
      className="text-sm font-medium text-slate-300 ml-1 cursor-pointer select-none"
    >
      {label}
    </label>
    <div className="relative group">
      <select
        id={id}
        value={value || ""}
        onChange={onChange}
        className="w-full px-4 py-3.5 rounded-xl border border-slate-700/60 bg-slate-900/50 text-slate-200 outline-none appearance-none cursor-pointer transition-all duration-300 focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 hover:border-slate-500 hover:bg-slate-900"
      >
        <option value="" disabled className="bg-slate-900 text-slate-500">
          Please Select
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt} className="bg-slate-900 text-slate-200">
            {opt}
          </option>
        ))}
      </select>
      <div className="absolute right-4 top-4 pointer-events-none text-slate-400 group-hover:text-violet-400 transition-colors">
        <ChevronLeft className="w-4 h-4 -rotate-90" />
      </div>
    </div>
  </motion.div>
);

const TextAreaField = ({
  label,
  id,
  placeholder,
  value,
  onChange,
  className,
}) => (
  <motion.div
    variants={itemVariants}
    className={cn("flex flex-col space-y-2", className)}
  >
    <label
      htmlFor={id}
      className="text-sm font-medium text-slate-300 ml-1 cursor-pointer select-none"
    >
      {label}
    </label>
    <textarea
      id={id}
      rows={4}
      value={value || ""}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-4 py-3 rounded-xl border border-slate-700/60 bg-slate-900/50 text-slate-200 placeholder:text-slate-600 outline-none resize-y transition-all duration-300 focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 focus:bg-slate-900 hover:border-slate-500 no-scrollbar"
    />
  </motion.div>
);

export default function AppointmentForm() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState({});

  const timeSlots = [
    "11:30 AM",
    "12:30 PM",
    "1:30 PM",
    "4:30 PM",
    "5:30 PM",
    "6:30 PM",
  ];

  const contactMethods = ["Phone Call", "Email", "WhatsApp / Text"];
  const bestTimes = [
    "Morning (9am - 12pm)",
    "Afternoon (12pm - 4pm)",
    "Evening (4pm - 8pm)",
  ];

  const handleDateClick = (day) => {
    setSelectedDate(day);
  };

  const handleTimeClick = (time) => {
    setSelectedTime(time === selectedTime ? null : time);
    if (errors.time) setErrors((prev) => ({ ...prev, time: null }));
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    const keyMap = {
      firstName: "firstName",
      lastName: "lastName",
      phone: "phone",
      email: "email",
      "contact-method": "contactMethod",
      "contact-time": "bestTime",
      "help-text": "helpText",
      notes: "notes",
    };

    const key = keyMap[id] || id;
    setFormData((prev) => ({ ...prev, [key]: value }));

    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = "Valid email is required";
    }

    const phoneRegex =
      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    if (!formData.phone || !phoneRegex.test(formData.phone)) {
      newErrors.phone = "Valid phone number is required";
    }

    if (!selectedTime) newErrors.time = "Please select a time slot";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log("Form Submitted:", {
        date: format(selectedDate, "yyyy-MM-dd"),
        time: selectedTime,
        ...formData,
      });
      setIsSubmitted(true);
    } else {
      const errorEl = document.querySelector(".text-red-400");
      if (errorEl)
        errorEl.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setFormData(INITIAL_FORM_STATE);
    setSelectedTime(null);
    setSelectedDate(new Date());
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  if (isSubmitted) {
    return (
      <div className="h-screen w-full overflow-y-auto bg-slate-950 bg-grid-pattern flex items-center justify-center p-4 font-sans text-slate-100 no-scrollbar">
        <GlobalStyles />
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          className="bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-violet-900/20 p-12 text-center max-w-md w-full border border-slate-700/50 relative overflow-hidden"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 150, damping: 15 }}
            className="w-24 h-24 bg-linear-to-tr from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-900/50"
          >
            <CheckCircle className="w-12 h-12 text-white" />
          </motion.div>

          <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
            Booking Confirmed!
          </h2>
          <p className="text-slate-400 mb-8 leading-relaxed">
            Your appointment is set for <br />
            <span className="text-emerald-400 font-semibold text-lg">
              {format(selectedDate, "MMM d, yyyy")}
            </span>{" "}
            at{" "}
            <span className="text-emerald-400 font-semibold text-lg">
              {selectedTime}
            </span>
            .
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleReset}
            className="px-8 py-3 rounded-full bg-slate-800 border border-slate-600 text-white font-medium hover:bg-slate-700 transition-colors cursor-pointer"
          >
            Book Another
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full overflow-y-auto bg-slate-950 bg-grid-pattern text-slate-200 flex justify-center font-sans selection:bg-violet-500/30 selection:text-violet-200 no-scrollbar">
      <GlobalStyles />

      <div className="py-12 px-4 sm:px-6 lg:px-8 w-full flex justify-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-5xl w-full"
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center justify-center p-2 mb-4 rounded-full bg-slate-900/50 border border-slate-800 backdrop-blur-sm cursor-default"
            >
              <Sparkles className="w-4 h-4 text-violet-400 mr-2" />
              <span className="text-xs font-semibold uppercase tracking-widest text-violet-300">
                Fast & Easy Booking
              </span>
            </motion.div>
            <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-white via-slate-200 to-slate-400 tracking-tight mb-4">
              Appointment Form
            </h1>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              Schedule a meeting with our experts. Select a convenient time and
              tell us a bit about your needs.
            </p>
          </motion.div>

          <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-white/5 shadow-2xl shadow-black/50 overflow-hidden">
            <form
              onSubmit={handleSubmit}
              className="p-6 md:p-10 lg:p-12 space-y-12"
            >
              <motion.section variants={itemVariants}>
                <div className="flex items-center mb-8 space-x-4">
                  <div className="h-px bg-linear-to-r from-transparent via-slate-700 to-transparent flex-1" />
                  <h2 className="text-xl font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-violet-500" />
                    Date & Time
                  </h2>
                  <div className="h-px bg-linear-to-r from-transparent via-slate-700 to-transparent flex-1" />
                </div>

                <div className="flex flex-col xl:flex-row gap-12">
                  <div className="flex-1 space-y-6">
                    <div className="flex items-center justify-between bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 shadow-inner group transition-all hover:bg-slate-800 cursor-default">
                      <div className="flex flex-col">
                        <span className="text-xs text-slate-500 uppercase tracking-wide font-bold">
                          Selected Date
                        </span>
                        <span className="text-xl font-semibold text-violet-300">
                          {format(selectedDate, "EEEE, MMMM do, yyyy")}
                        </span>
                      </div>
                    </div>

                    <div className="bg-slate-950/40 border border-white/5 rounded-2xl p-6 shadow-xl">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2 text-white font-bold text-lg select-none">
                          <span>{format(currentMonth, "MMMM yyyy")}</span>
                        </div>
                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{
                              scale: 1.1,
                              backgroundColor: "rgba(255,255,255,0.1)",
                            }}
                            whileTap={{ scale: 0.9 }}
                            type="button"
                            onClick={prevMonth}
                            className="p-2 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </motion.button>
                          <motion.button
                            whileHover={{
                              scale: 1.1,
                              backgroundColor: "rgba(255,255,255,0.1)",
                            }}
                            whileTap={{ scale: 0.9 }}
                            type="button"
                            onClick={nextMonth}
                            className="p-2 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </motion.button>
                        </div>
                      </div>

                      <div className="grid grid-cols-7 mb-4 text-center">
                        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(
                          (day) => (
                            <div
                              key={day}
                              className="text-xs font-bold text-slate-500 uppercase select-none"
                            >
                              {day}
                            </div>
                          )
                        )}
                      </div>

                      <div className="grid grid-cols-7 gap-2">
                        {calendarDays.map((day, idx) => {
                          const isSelected = isSameDay(day, selectedDate);
                          const isCurrentMonth = isSameMonth(day, currentMonth);
                          const isTodayDate = isToday(day);

                          return (
                            <motion.button
                              key={idx}
                              layout
                              type="button"
                              onClick={() => handleDateClick(day)}
                              className={cn(
                                "relative h-10 w-full rounded-xl flex items-center justify-center text-sm transition-all duration-300 cursor-pointer overflow-hidden",
                                !isCurrentMonth && "text-slate-700 opacity-50",
                                isCurrentMonth &&
                                  !isSelected &&
                                  "text-slate-300 hover:bg-slate-800 hover:text-white",
                                isSelected &&
                                  "bg-linear-to-br from-violet-600 to-indigo-600 text-white font-bold shadow-lg shadow-violet-500/20 scale-105 z-10",
                                isTodayDate &&
                                  !isSelected &&
                                  "border border-violet-500/50 text-violet-400 bg-violet-500/10"
                              )}
                            >
                              {isSelected && (
                                <motion.div
                                  layoutId="selectedDay"
                                  className="absolute inset-0 bg-white/10"
                                  initial={false}
                                  transition={{
                                    type: "spring",
                                    stiffness: 500,
                                    damping: 30,
                                  }}
                                />
                              )}
                              <span className="relative z-10">
                                {format(day, "d")}
                              </span>
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide select-none">
                        Available Slots
                      </h3>
                      {errors.time && (
                        <motion.span
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="text-xs text-red-400 font-medium flex items-center gap-1"
                        >
                          <AlertCircle className="w-3 h-3" /> Required
                        </motion.span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {timeSlots.map((time, i) => {
                        const isActive = selectedTime === time;
                        return (
                          <motion.button
                            key={time}
                            variants={itemVariants}
                            custom={i}
                            type="button"
                            onClick={() => handleTimeClick(time)}
                            whileHover={{ scale: 1.03, y: -2 }}
                            whileTap={{ scale: 0.97 }}
                            className={cn(
                              "relative py-4 px-6 rounded-2xl border text-sm font-semibold transition-all duration-300 cursor-pointer overflow-hidden group select-none",
                              isActive
                                ? "border-violet-500 text-white shadow-[0_0_20px_rgba(139,92,246,0.3)] bg-linear-to-r from-violet-600/90 to-indigo-600/90"
                                : "bg-slate-900/40 border-slate-700/50 text-slate-300 hover:border-violet-500/50 hover:bg-slate-800 hover:text-white"
                            )}
                          >
                            {!isActive && (
                              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shine" />
                            )}

                            <span className="relative z-10 flex items-center justify-center gap-2">
                              {isActive && <CheckCircle className="w-4 h-4" />}
                              {time}
                            </span>
                          </motion.button>
                        );
                      })}
                    </div>

                    <div className="mt-auto pt-8">
                      <div className="bg-slate-950/30 rounded-xl p-4 flex items-center justify-between border border-slate-800 select-none">
                        <div className="flex items-center text-slate-400 text-sm">
                          <Clock className="w-4 h-4 mr-2 text-violet-400" />
                          <span>Timezone</span>
                        </div>
                        <div className="flex items-center text-slate-200 text-sm font-medium">
                          <span>Asia/Calcutta (IST)</span>
                          <Globe className="w-4 h-4 ml-2 text-slate-600" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.section>

              <motion.section variants={itemVariants}>
                <div className="flex items-center mb-8 space-x-4">
                  <div className="h-px bg-linear-to-r from-transparent via-slate-700 to-transparent flex-1" />
                  <h2 className="text-xl font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
                    <ArrowRight className="w-5 h-5 text-emerald-500" />
                    Your Details
                  </h2>
                  <div className="h-px bg-linear-to-r from-transparent via-slate-700 to-transparent flex-1" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <InputField
                    id="firstName"
                    label="First Name"
                    placeholder="Jane"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    error={errors.firstName}
                  />
                  <InputField
                    id="lastName"
                    label="Last Name"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    error={errors.lastName}
                  />

                  <InputField
                    id="phone"
                    label="Phone Number"
                    subLabel="Ideally connected to WhatsApp"
                    placeholder="(555) 000-0000"
                    value={formData.phone}
                    onChange={handleInputChange}
                    error={errors.phone}
                  />
                  <InputField
                    id="email"
                    label="Email Address"
                    subLabel="We'll send the invite here"
                    type="email"
                    placeholder="jane@company.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    error={errors.email}
                  />

                  <SelectField
                    id="contact-method"
                    label="Preferred Contact Method"
                    options={contactMethods}
                    value={formData.contactMethod}
                    onChange={handleInputChange}
                  />
                  <SelectField
                    id="contact-time"
                    label="Best Time to Call"
                    options={bestTimes}
                    value={formData.bestTime}
                    onChange={handleInputChange}
                  />

                  <div className="md:col-span-2">
                    <TextAreaField
                      id="help-text"
                      label="How can we help you?"
                      placeholder="Briefly describe your requirements..."
                      value={formData.helpText}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <TextAreaField
                      id="notes"
                      label="Additional Notes"
                      placeholder="Any specific questions?"
                      value={formData.notes}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </motion.section>

              <motion.div
                variants={itemVariants}
                className="pt-6 border-t border-slate-800/50 flex flex-col items-center"
              >
                <motion.button
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0 0 30px rgba(16, 185, 129, 0.4)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="group relative w-full md:w-auto px-16 py-4 rounded-xl bg-linear-to-r from-emerald-500 to-teal-500 text-white text-lg font-bold shadow-lg shadow-emerald-500/20 transition-all duration-300 cursor-pointer overflow-hidden"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Confirm Appointment
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-linear-to-r from-transparent to-white opacity-20 group-hover:animate-shine" />
                </motion.button>

                <p className="mt-4 text-xs text-slate-500 select-none">
                  By clicking confirm, you agree to our Terms & Conditions.
                </p>
              </motion.div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
