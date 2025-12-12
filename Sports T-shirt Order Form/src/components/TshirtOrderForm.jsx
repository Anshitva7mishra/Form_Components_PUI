import { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  Upload,
  X,
  Check,
  ShoppingBag,
  CreditCard,
  Loader2,
  Download,
  Maximize,
  Minimize,
  AlertCircle,
  ChevronDown,
} from "lucide-react";

const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];
const BASE_PRICE = 25.0;

const ASSETS = {
  background:
    "https://images.unsplash.com/photo-1546519638-68e109498bb0?q=80&w=2090&auto=format&fit=crop",
  shirtBase:
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000&auto=format&fit=crop",
  logo: "https://cdn-icons-png.flaticon.com/512/889/889455.png",
};

const InputGroup = ({
  label,
  id,
  error,
  required,
  children,
  className = "",
}) => (
  <div className={`flex flex-col gap-1.5 ${className}`}>
    <label
      htmlFor={id}
      className="text-xs font-bold text-orange-50 uppercase tracking-wider flex items-center gap-1"
    >
      {label} {required && <span className="text-orange-500">*</span>}
    </label>
    {children}
    {error && (
      <span className="text-xs text-red-400 flex items-center gap-1 mt-1 font-medium">
        <AlertCircle size={12} /> {error}
      </span>
    )}
  </div>
);

const RadioCard = ({
  id,
  name,
  value,
  checked,
  onChange,
  label,
  icon: Icon,
}) => (
  <label
    htmlFor={id}
    className={`
      relative flex items-center justify-center gap-2 p-4 rounded-xl cursor-pointer transition-all duration-300
      ${
        checked
          ? "bg-orange-600/20 border-orange-500 shadow-[0_0_15px_rgba(234,88,12,0.3)]"
          : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
      }
      border backdrop-blur-md group
    `}
  >
    <input
      type="radio"
      id={id}
      name={name}
      value={value}
      checked={checked}
      onChange={onChange}
      className="hidden"
    />
    {Icon && (
      <Icon
        size={18}
        className={`transition-colors ${
          checked
            ? "text-orange-400"
            : "text-gray-400 group-hover:text-gray-200"
        }`}
      />
    )}
    <span
      className={`font-bold text-sm transition-colors ${
        checked ? "text-orange-100" : "text-gray-400 group-hover:text-gray-200"
      }`}
    >
      {label}
    </span>
    {checked && (
      <motion.div
        layoutId="activeRadio"
        className="absolute inset-0 border-2 border-orange-500 rounded-xl pointer-events-none"
        initial={false}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    )}
  </label>
);

export default function BasketballOrderForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    areaCode: "",
    phoneNumber: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    paymentMethod: "card",
  });

  const [product, setProduct] = useState({
    selected: true,
    quantity: 1,
    size: "L",
    customImage: null,
    imgTransform: { scale: 1, x: 0, y: 0 },
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleProductChange = (field, value) => {
    setProduct((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size too large. Limit 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        handleProductChange("customImage", ev.target.result);
        handleProductChange("imgTransform", { scale: 1, x: 0, y: 0 });
      };
      reader.readAsDataURL(file);
    }
  };

  const updateTransform = (key, val) => {
    setProduct((prev) => ({
      ...prev,
      imgTransform: { ...prev.imgTransform, [key]: val },
    }));
  };

  const downloadPreview = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const shirtImg = new Image();
    const overlayImg = new Image();

    shirtImg.crossOrigin = "anonymous";
    shirtImg.src = ASSETS.shirtBase;

    shirtImg.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(shirtImg, 0, 0, canvas.width, canvas.height);

      if (product.customImage) {
        overlayImg.src = product.customImage;
        overlayImg.onload = () => {
          const printArea = { x: 160, y: 140, w: 180, h: 220 };

          ctx.save();
          ctx.beginPath();
          ctx.rect(printArea.x, printArea.y, printArea.w, printArea.h);
          ctx.clip();

          const w = printArea.w * product.imgTransform.scale;
          const h = (overlayImg.height / overlayImg.width) * w;
          const x =
            printArea.x + (printArea.w - w) / 2 + product.imgTransform.x;
          const y =
            printArea.y + (printArea.h - h) / 2 + product.imgTransform.y;

          ctx.drawImage(overlayImg, x, y, w, h);
          ctx.restore();

          const link = document.createElement("a");
          link.download = "jersey-preview.png";
          link.href = canvas.toDataURL();
          link.click();
        };
      }
    };
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = "Required";
    if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email))
      newErrors.email = "Invalid email";
    if (!formData.phoneNumber) newErrors.phoneNumber = "Required";
    if (!formData.address1) newErrors.address1 = "Required";
    if (!formData.city) newErrors.city = "Required";
    if (!formData.zip) newErrors.zip = "Required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
    }, 1500);
  };

  const totalPrice = product.selected
    ? (product.quantity * BASE_PRICE).toFixed(2)
    : "0.00";

  const inputClass = `
    w-full px-4 py-3 bg-white/10 border border-white/10 rounded-lg text-white placeholder-gray-400
    focus:bg-white/20 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 
    outline-none transition-all duration-200 backdrop-blur-sm
  `;

  if (submitSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 font-sans relative overflow-hidden bg-black">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{ backgroundImage: `url(${ASSETS.background})` }}
        />
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative z-10 bg-black/60 backdrop-blur-xl border border-white/10 p-12 rounded-3xl shadow-2xl max-w-md w-full text-center"
        >
          <div className="w-24 h-24 bg-linear-to-tr from-orange-500 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-orange-500/30">
            <Check size={48} strokeWidth={3} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            You're in the game!
          </h2>
          <p className="text-gray-300 mb-8">
            Order received for {formData.firstName}. Get ready to dominate the
            court.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="w-full py-4 bg-white text-black rounded-xl hover:bg-gray-200 transition-all font-bold text-lg cursor-pointer"
          >
            New Order
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full font-sans text-gray-100 relative overflow-x-hidden selection:bg-orange-500/30 selection:text-orange-200">
      <style>{`
        ::-webkit-scrollbar { display: none; }
        * { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${ASSETS.background})` }}
      />
      <div className="fixed inset-0 z-0 bg-linear-to-b from-gray-900/80 via-gray-900/60 to-black/90 backdrop-blur-[2px]" />

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center py-8 px-4 sm:px-6">
        <motion.form
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-6xl bg-black/40 backdrop-blur-2xl rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden flex flex-col lg:flex-row"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="flex-1 p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-white/10">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-14 h-14 bg-linear-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-900/50">
                <img
                  src={ASSETS.logo}
                  alt="Logo"
                  className="w-8 h-8 object-contain brightness-0 invert"
                />
              </div>
              <div>
                <h1 className="text-2xl font-black text-white uppercase tracking-tight italic">
                  Court<span className="text-orange-500">Side</span> Gear
                </h1>
                <p className="text-sm text-gray-400 font-medium tracking-wide">
                  OFFICIAL TEAM MERCHANDISE
                </p>
              </div>
            </div>

            <div className="space-y-8">
              <section className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex items-center gap-3 text-orange-500 mb-2">
                  <span className="text-xs font-bold uppercase tracking-widest bg-orange-500/10 px-2 py-1 rounded">
                    Step 01
                  </span>
                  <h3 className="text-lg font-bold text-white">
                    Player Details
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputGroup
                    label="First Name"
                    id="firstName"
                    required
                    error={errors.firstName}
                  >
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={inputClass}
                      placeholder="LeBron"
                    />
                  </InputGroup>
                  <InputGroup label="Last Name" id="lastName">
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={inputClass}
                      placeholder="James"
                    />
                  </InputGroup>
                </div>

                <InputGroup
                  label="Email"
                  id="email"
                  required
                  error={errors.email}
                >
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={inputClass}
                    placeholder="king@court.com"
                  />
                </InputGroup>

                <div className="grid grid-cols-3 gap-4">
                  <InputGroup label="Code" id="areaCode">
                    <input
                      type="tel"
                      name="areaCode"
                      value={formData.areaCode}
                      onChange={handleInputChange}
                      className={`${inputClass} text-center`}
                      placeholder="+1"
                    />
                  </InputGroup>
                  <InputGroup
                    label="Phone Number"
                    id="phoneNumber"
                    required
                    error={errors.phoneNumber}
                    className="col-span-2"
                  >
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className={inputClass}
                    />
                  </InputGroup>
                </div>
              </section>

              <section className="space-y-5 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                <div className="flex items-center gap-3 text-orange-500 mb-2">
                  <span className="text-xs font-bold uppercase tracking-widest bg-orange-500/10 px-2 py-1 rounded">
                    Step 02
                  </span>
                  <h3 className="text-lg font-bold text-white">Shipping</h3>
                </div>

                <InputGroup
                  label="Street Address"
                  id="address1"
                  required
                  error={errors.address1}
                >
                  <input
                    type="text"
                    name="address1"
                    value={formData.address1}
                    onChange={handleInputChange}
                    className={inputClass}
                  />
                </InputGroup>

                <div className="grid grid-cols-2 gap-4">
                  <InputGroup
                    label="City"
                    id="city"
                    required
                    error={errors.city}
                  >
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={inputClass}
                    />
                  </InputGroup>
                  <InputGroup
                    label="Postal Code"
                    id="zip"
                    required
                    error={errors.zip}
                  >
                    <input
                      type="text"
                      name="zip"
                      value={formData.zip}
                      onChange={handleInputChange}
                      className={inputClass}
                    />
                  </InputGroup>
                </div>
              </section>
            </div>
          </div>

          <div className="lg:w-120 bg-linear-to-b from-white/5 to-transparent p-8 lg:p-10 flex flex-col relative">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <ShoppingBag size={20} className="text-orange-500" />
                Your Kit
              </h3>
              <span className="bg-orange-500 text-black text-xs font-black px-2 py-1 rounded uppercase">
                Premium Fit
              </span>
            </div>

            <div className="relative w-full aspect-4/5 bg-linear-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-white/10 flex items-center justify-center overflow-hidden mb-6 group shadow-2xl">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-orange-500/10 via-transparent to-transparent opacity-50"></div>

              <img
                src={ASSETS.shirtBase}
                alt="Jersey Mockup"
                className="relative z-10 w-[90%] h-auto object-contain drop-shadow-xl contrast-110"
              />

              <div className="absolute z-20 top-[22%] left-[50%] -translate-x-1/2 w-[38%] h-[42%] overflow-hidden mix-blend-multiply pointer-events-none">
                {product.customImage && (
                  <img
                    src={product.customImage}
                    alt="Custom Print"
                    style={{
                      transform: `translate(${product.imgTransform.x}px, ${product.imgTransform.y}px) scale(${product.imgTransform.scale})`,
                      transformOrigin: "center",
                    }}
                    className="w-full h-full object-contain"
                  />
                )}
              </div>

              {!product.customImage && (
                <div className="absolute z-30 inset-0 flex flex-col items-center justify-center pointer-events-none text-white/30 space-y-2">
                  <div className="border-2 border-dashed border-white/20 rounded-lg w-32 h-40"></div>
                  <span className="text-xs font-medium tracking-widest uppercase">
                    Print Area
                  </span>
                </div>
              )}

              <button
                type="button"
                onClick={downloadPreview}
                className="absolute top-4 right-4 z-40 p-2 bg-black/50 hover:bg-orange-600 rounded-full text-white backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 cursor-pointer border border-white/10"
              >
                <Download size={18} />
              </button>
            </div>

            <div className="space-y-6 flex-1">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 transition-all hover:bg-white/10">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                    Team Logo
                  </label>
                  {product.customImage && (
                    <button
                      type="button"
                      onClick={() => handleProductChange("customImage", null)}
                      className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer"
                    >
                      <X size={12} /> Clear
                    </button>
                  )}
                </div>

                {!product.customImage ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="h-24 border-2 border-dashed border-white/20 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-orange-500 hover:text-orange-500 transition-all cursor-pointer group"
                  >
                    <Upload
                      size={20}
                      className="mb-2 group-hover:scale-110 transition-transform"
                    />
                    <span className="text-xs font-bold">UPLOAD IMAGE</span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Minimize size={14} className="text-gray-500" />
                      <input
                        type="range"
                        min="0.5"
                        max="1.5"
                        step="0.05"
                        value={product.imgTransform.scale}
                        onChange={(e) =>
                          updateTransform("scale", parseFloat(e.target.value))
                        }
                        className="flex-1 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-orange-500"
                      />
                      <Maximize size={14} className="text-gray-500" />
                    </div>
                    <div className="flex justify-center gap-2">
                      {["←", "↑", "↓", "→"].map((arrow, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => {
                            const axis = i === 0 || i === 3 ? "x" : "y";
                            const val = i === 0 || i === 1 ? -5 : 5;
                            updateTransform(
                              axis,
                              product.imgTransform[axis] + val
                            );
                          }}
                          className="w-8 h-8 flex items-center justify-center bg-white/5 hover:bg-orange-500/20 rounded-lg text-gray-300 hover:text-orange-400 border border-white/10 cursor-pointer"
                        >
                          {arrow}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase">
                    Size
                  </label>
                  <div className="relative">
                    <select
                      value={product.size}
                      onChange={(e) =>
                        handleProductChange("size", e.target.value)
                      }
                      className="w-full appearance-none bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white font-medium focus:border-orange-500 outline-none cursor-pointer"
                    >
                      {SIZES.map((s) => (
                        <option key={s} value={s} className="bg-gray-900">
                          {s}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={16}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={product.quantity}
                    onChange={(e) =>
                      handleProductChange(
                        "quantity",
                        Math.max(1, parseInt(e.target.value) || 1)
                      )
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white font-medium focus:border-orange-500 outline-none"
                  />
                </div>
              </div>

              <div className="mt-auto pt-6 border-t border-white/10 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <RadioCard
                    id="pay-card"
                    name="payment"
                    value="card"
                    checked={formData.paymentMethod === "card"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        paymentMethod: e.target.value,
                      })
                    }
                    label="Card"
                    icon={CreditCard}
                  />
                  <RadioCard
                    id="pay-paypal"
                    name="payment"
                    value="paypal"
                    checked={formData.paymentMethod === "paypal"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        paymentMethod: e.target.value,
                      })
                    }
                    label="PayPal"
                  />
                </div>

                <div className="flex items-end justify-between py-2">
                  <div className="text-sm text-gray-400">Total Estimate</div>
                  <div className="text-3xl font-black text-white italic tracking-tight">
                    ${totalPrice}
                  </div>
                </div>

                <motion.button
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0 0 20px rgba(234, 88, 12, 0.4)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isSubmitting}
                  className={`
                    w-full py-4 rounded-xl font-black text-lg tracking-wide uppercase flex items-center justify-center gap-2 cursor-pointer
                    ${
                      isSubmitting
                        ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                        : "bg-linear-to-r from-orange-600 to-orange-500 text-white shadow-lg shadow-orange-900/40"
                    }
                    transition-all duration-300
                  `}
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Place Order"
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.form>
      </div>

      <canvas ref={canvasRef} width={500} height={600} className="hidden" />
    </div>
  );
}
