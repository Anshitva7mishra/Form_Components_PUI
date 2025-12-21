import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Check,
  MapPin,
  Printer,
  CreditCard,
  ChevronRight,
  Lock,
  User,
  Camera,
  QrCode,
  Loader2,
  Wifi,
  Trash2,
} from "lucide-react";
import classNames from "classnames";

// --- DATA CONSTANTS ---
const EVENTS = [
  {
    id: "nyc",
    city: "New York",
    venue: "Javits Center",
    date: "Aug 12-14",
    img: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&q=80",
    status: "Open",
  },
  {
    id: "ldn",
    city: "London",
    venue: "ExCeL London",
    date: "Sep 20-22",
    img: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&q=80",
    status: "Selling Fast",
  },
  {
    id: "sgp",
    city: "Singapore",
    venue: "Marina Bay",
    date: "Oct 05-07",
    img: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=600&q=80",
    status: "Waitlist",
  },
];

const TICKETS = [
  {
    id: "student",
    title: "Student",
    price: 99,
    features: "Expo Entry • Keynotes",
  },
  {
    id: "standard",
    title: "Standard",
    price: 249,
    tag: "POPULAR",
    features: "Workshops • After-Party",
  },
  { id: "vip", title: "VIP", price: 399, features: "VIP Lounge • Dinner" },
];

const ADDONS = [
  { id: "w1", title: "Workshop", price: 79 },
  { id: "m1", title: "Merch Pack", price: 45 },
];

const formatMoney = (val) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(val);

const generateOrderId = () => {
  const timestamp = Date.now().toString(36).toUpperCase().slice(-4);
  const random = Math.random().toString(36).toUpperCase().slice(-4);
  return `PUI-${timestamp}-${random}`;
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

const CitySelection = ({ onSelect }) => (
  <div className="flex flex-col w-full h-full">
    <div className="text-center mb-8 shrink-0">
      <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-[0.2em]">
        Select Destination
      </h3>
    </div>
    <div className="space-y-4">
      {EVENTS.map((evt, i) => (
        <motion.div
          key={evt.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          onClick={() => evt.status !== "Waitlist" && onSelect(evt)}
          className={classNames(
            "group relative h-32 rounded-2xl overflow-hidden border transition-all w-full shrink-0",
            evt.status === "Waitlist"
              ? "border-white/5 opacity-60 grayscale cursor-not-allowed"
              : "border-white/10 hover:border-cyan-500 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] cursor-pointer"
          )}
        >
          <img
            src={evt.img}
            className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700"
            alt=""
          />
          <div className="absolute inset-0 bg-linear-to-r from-black via-black/60 to-transparent" />

          <div className="absolute inset-0 p-6 flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <MapPin size={14} className="text-cyan-400" />
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  {evt.venue}
                </span>
              </div>
              <h3 className="text-3xl font-black text-white leading-none tracking-tight">
                {evt.city}
              </h3>
              <span className="text-sm text-slate-400 font-mono mt-1 block">
                {evt.date}
              </span>
            </div>

            <div
              className={classNames(
                "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                evt.status === "Waitlist"
                  ? "bg-white/5 text-slate-500"
                  : "bg-white/10 group-hover:bg-cyan-500 group-hover:text-black text-white"
              )}
            >
              {evt.status === "Waitlist" ? (
                <Lock size={16} />
              ) : (
                <ChevronRight size={20} />
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

const TicketForm = ({
  data,
  setData,
  step,
  total,
  selectedEvent,
  goNext,
  goBack,
  errors,
}) => {
  const update = (k, v) => setData((p) => ({ ...p, [k]: v }));

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        update("avatar", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col w-full h-full">
      <div className="shrink-0 mb-6 flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <button
            onClick={goBack}
            className="text-xs font-bold text-slate-500 hover:text-white uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer mb-1"
          >
            <ArrowLeft size={14} /> Back
          </button>
          <h2 className="text-3xl font-bold text-white leading-none">
            {selectedEvent.city}
          </h2>
        </div>
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                step >= i ? "w-8 bg-cyan-500" : "w-2 bg-slate-800"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="space-y-6 flex-1">
        {step === 0 && (
          <div className="space-y-3">
            {TICKETS.map((t) => (
              <div
                key={t.id}
                onClick={() => update("ticketId", t.id)}
                className={classNames(
                  "relative p-5 rounded-xl border transition-all flex items-center justify-between w-full cursor-pointer group",
                  data.ticketId === t.id
                    ? "bg-cyan-500/10 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                    : "bg-transparent border-slate-800 hover:border-slate-600"
                )}
              >
                <div>
                  <div className="flex items-center gap-3">
                    <span
                      className={classNames(
                        "text-lg font-bold",
                        data.ticketId === t.id ? "text-white" : "text-slate-300"
                      )}
                    >
                      {t.title}
                    </span>
                    {t.tag && (
                      <span className="text-[10px] font-bold bg-amber-500 text-black px-2 py-0.5 rounded uppercase">
                        {t.tag}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{t.features}</p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-mono font-bold text-white">
                    ${t.price}
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full border ml-auto mt-2 flex items-center justify-center transition-colors ${
                      data.ticketId === t.id
                        ? "bg-cyan-500 border-cyan-500"
                        : "border-slate-700 group-hover:border-slate-500"
                    }`}
                  >
                    {data.ticketId === t.id && (
                      <Check size={14} className="text-black" strokeWidth={4} />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {step === 1 && (
          <div className="space-y-8">
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                Enhance Your Pass
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ADDONS.map((a) => {
                  const active = data.addons.includes(a.id);
                  return (
                    <div
                      key={a.id}
                      onClick={() =>
                        update(
                          "addons",
                          active
                            ? data.addons.filter((x) => x !== a.id)
                            : [...data.addons, a.id]
                        )
                      }
                      className={`flex justify-between items-center p-4 rounded-xl border transition-all w-full cursor-pointer ${
                        active
                          ? "bg-cyan-500/10 border-cyan-500"
                          : "bg-transparent border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <span className="text-sm font-bold text-slate-200">
                        {a.title}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-mono text-cyan-400">
                          +${a.price}
                        </span>
                        <div
                          className={`w-5 h-5 rounded border flex items-center justify-center ${
                            active
                              ? "bg-cyan-500 border-cyan-500"
                              : "border-slate-700"
                          }`}
                        >
                          {active && <Check size={12} className="text-black" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-5 pt-4 border-t border-white/5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                  Attendee Details
                </h4>
                <p className="text-xs text-slate-500">* Required</p>
              </div>

              <div className="flex items-center gap-5">
                <label className="relative w-20 h-20 rounded-2xl bg-slate-800 border border-slate-700 hover:border-cyan-500 cursor-pointer overflow-hidden flex items-center justify-center transition-all group shrink-0 ring-4 ring-black">
                  {data.avatar ? (
                    <img
                      src={data.avatar}
                      alt="User"
                      className="w-full h-full object-cover object-top"
                    />
                  ) : (
                    <Camera
                      size={24}
                      className="text-slate-500 group-hover:text-cyan-400 transition-colors"
                    />
                  )}
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
                <div className="flex-1">
                  <p className="text-sm text-white font-bold uppercase mb-1">
                    Upload Photo ID
                  </p>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Please upload a clear headshot for your event badge. This
                    will be printed on your pass.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input
                  placeholder="FIRST NAME"
                  value={data.firstName}
                  onChange={(e) => update("firstName", e.target.value)}
                  className={`w-full bg-[#0F1116] border rounded-xl p-4 text-sm text-white outline-none placeholder:text-slate-600 font-bold transition-colors ${
                    errors.firstName
                      ? "border-red-500 focus:border-red-500 animate-shake"
                      : "border-slate-800 focus:border-cyan-500"
                  }`}
                />
                <input
                  placeholder="LAST NAME"
                  value={data.lastName}
                  onChange={(e) => update("lastName", e.target.value)}
                  className="w-full bg-[#0F1116] border border-slate-800 rounded-xl p-4 text-sm text-white outline-none focus:border-cyan-500 placeholder:text-slate-600 font-bold transition-colors"
                />
              </div>
              <div className="relative">
                <input
                  type="email"
                  placeholder="EMAIL ADDRESS (name@example.com)"
                  value={data.email}
                  onChange={(e) => update("email", e.target.value)}
                  className={`w-full bg-[#0F1116] border rounded-xl p-4 text-sm text-white outline-none placeholder:text-slate-600 font-bold transition-colors ${
                    errors.email
                      ? "border-red-500 focus:border-red-500 animate-shake"
                      : "border-slate-800 focus:border-cyan-500"
                  }`}
                />
                {errors.email && (
                  <p className="absolute right-0 -bottom-5 text-xs text-red-400">
                    * Invalid Email
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="bg-[#0F1116] border border-white/10 rounded-xl p-8 space-y-6">
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <div>
                  <div className="text-sm font-bold text-white uppercase">
                    {TICKETS.find((t) => t.id === data.ticketId).title} Pass
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {selectedEvent.city} • {selectedEvent.date}
                  </div>
                </div>
                <div className="font-mono text-xl text-white font-bold">
                  ${TICKETS.find((t) => t.id === data.ticketId).price}
                </div>
              </div>

              <div className="space-y-3">
                {data.addons.map((id) => (
                  <div
                    key={id}
                    className="flex justify-between text-xs text-slate-400"
                  >
                    <span>+ {ADDONS.find((a) => a.id === id).title}</span>
                    <span className="font-mono">
                      ${ADDONS.find((a) => a.id === id).price}
                    </span>
                  </div>
                ))}
                
                {data.addons.length === 0 && (
                  <p className="text-xs text-slate-600 italic">
                    No add-ons selected
                  </p>
                )}
              </div>

              <div className="pt-4 flex justify-between items-center text-cyan-400 font-bold border-t border-white/5">
                <span className="text-xs uppercase tracking-widest">
                  Total Due
                </span>
                <span className="text-2xl font-mono">{formatMoney(total)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="shrink-0 mt-8 pt-4 border-t border-white/5">
        <button
          onClick={goNext}
          className="w-full group relative flex items-center justify-center gap-3 py-4 bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase tracking-widest text-sm rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] cursor-pointer"
        >
          {step === 2 ? "Proceed to Payment" : "Continue"}{" "}
          <ArrowRight
            size={16}
            className="group-hover:translate-x-1 transition-transform"
          />
        </button>
      </div>
    </div>
  );
};

const PaymentGateway = ({ total, onComplete }) => {
  const [processing, setProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      onComplete();
    }, 2500);
  };

  const handleExpiryChange = (e) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length >= 2) {
      val = val.slice(0, 2) + "/" + val.slice(2, 4);
    }
    setExpiry(val);
  };

  const isFormValid =
    cardNumber.length === 16 && expiry.length === 5 && cvc.length === 3;

  const cardDisplay = cardNumber.padEnd(16, "•").replace(/(.{4})/g, "$1 ");
  const expiryDisplay = expiry || "MM/YY";

  return (
    <div className="h-full flex flex-col w-full">
      <div className="text-center mb-8">
        <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-[0.2em]">
          Secure Checkout
        </h3>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center space-y-10">
        <div className="w-full max-w-85 aspect-[1.586] rounded-2xl bg-linear-to-br from-slate-800 to-black border border-white/10 relative overflow-hidden shadow-2xl group perspective-1000 transition-transform duration-500 hover:scale-105">
          <div className="absolute inset-0 bg-linear-to-tr from-cyan-500/10 to-purple-500/10 opacity-50" />
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-500/20 blur-3xl rounded-full" />

          <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
            <div className="flex justify-between items-start">
              <div className="w-12 h-7 rounded bg-yellow-500/80 overflow-hidden flex items-center justify-center gap-0.5 shadow-sm">
                <div className="w-full h-full border border-yellow-600/50 opacity-50" />
              </div>
              <Wifi size={24} className="text-slate-500 rotate-90 opacity-50" />
            </div>

            <div className="space-y-4">
              <div className="font-mono text-2xl text-white tracking-widest drop-shadow-md">
                {cardDisplay}
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                <div>
                  <div className="mb-1 opacity-50">Card Holder</div>
                  <div className="text-slate-200">John Doe</div>
                </div>
                <div className="text-right">
                  <div className="mb-1 opacity-50">Expires</div>
                  <div className="text-slate-200">{expiryDisplay}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full space-y-4 max-w-sm mx-auto">
          <div className="relative group">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <CreditCard size={18} className="text-slate-500" />
            </div>
            <input
              type="text"
              maxLength="16"
              placeholder="0000 0000 0000 0000"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ""))}
              className="w-full bg-[#0F1116] border border-slate-800 rounded-xl py-4 pl-10 pr-4 text-sm text-white font-mono placeholder:text-slate-700 outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="MM/YY"
              maxLength="5"
              value={expiry}
              onChange={handleExpiryChange}
              className="bg-[#0F1116] border border-slate-800 rounded-xl p-4 text-sm text-white font-mono placeholder:text-slate-700 outline-none focus:border-cyan-500 transition-colors text-center"
            />
            <input
              type="text"
              placeholder="CVC"
              maxLength="3"
              value={cvc}
              onChange={(e) => setCvc(e.target.value.replace(/\D/g, ""))}
              className="bg-[#0F1116] border border-slate-800 rounded-xl p-4 text-sm text-white font-mono placeholder:text-slate-700 outline-none focus:border-cyan-500 transition-colors text-center"
            />
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-white/5">
        <button
          onClick={handlePay}
          disabled={processing || !isFormValid}
          className="w-full group relative flex items-center justify-center gap-2 py-4 bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-800 disabled:text-slate-500 text-black font-black uppercase tracking-widest text-sm rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] disabled:shadow-none cursor-pointer overflow-hidden"
        >
          {processing ? (
            <div className="flex items-center gap-2">
              <Loader2 size={18} className="animate-spin" />
              Processing...
            </div>
          ) : (
            <>
              Pay {formatMoney(total)}
              {!isFormValid ? (
                <Lock size={16} className="opacity-50" />
              ) : (
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              )}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

const PremiumTicket = ({ event, ticket, user, orderId, onReset }) => {
  const qrData = JSON.stringify({
    id: orderId,
    n: `${user.firstName} ${user.lastName}`,
    e: event.city,
    t: ticket.title,
  });
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
    qrData
  )}&bgcolor=FFFFFF&color=000000&margin=10&ecc=Q`;

  return (
    <div className="flex flex-col items-center justify-center w-full h-full py-6">
      <motion.div
        initial={{ rotateY: 90, opacity: 0 }}
        animate={{ rotateY: 0, opacity: 1 }}
        transition={{ type: "spring", damping: 15 }}
        className="relative w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl perspective-1000 transform origin-top"
      >
        <div
          className="absolute inset-0 z-20 pointer-events-none opacity-20 mix-blend-overlay"
          style={{
            backgroundImage: `url("https://grainy-gradients.vercel.app/noise.svg")`,
            backgroundSize: "cover",
          }}
        />
        <div className="absolute inset-0 z-10 bg-linear-to-br from-transparent via-white/10 to-transparent opacity-0 animate-shimmer pointer-events-none" />

        <div className="bg-[#1a1d24] border border-white/10 h-full relative z-0">
          <div className="h-2 w-full bg-linear-to-r from-cyan-400 via-purple-500 to-cyan-400 bg-size-[200%_auto] animate-gradient" />

          <div className="p-8 relative">
            <div className="absolute top-6 right-6 flex flex-col items-end">
              <Sparkles
                size={24}
                className="text-cyan-400 animate-pulse mb-1"
              />
              <span className="text-[10px] text-cyan-500 font-mono tracking-widest border border-cyan-500/30 px-1.5 py-0.5 rounded bg-cyan-500/5">
                OFFICIAL
              </span>
            </div>

            <div className="inline-block px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-[10px] font-black uppercase tracking-widest mb-4 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
              Confirmed Access
            </div>

            <h1 className="text-5xl font-black text-transparent bg-clip-text bg-linear-to-b from-white to-slate-400 leading-[0.8] mb-3 uppercase italic tracking-tighter drop-shadow-sm">
              {event.city}
            </h1>

            <div className="flex items-center gap-3 text-sm text-slate-400 font-mono border-l-2 border-cyan-500 pl-3">
              <span className="font-bold text-white">{event.date}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
              <span>{event.venue}</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 py-4 opacity-50">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-slate-500" />
            ))}
          </div>

          <div className="p-8 space-y-6 bg-[#15181e]">
            <div className="flex items-center gap-5">
              <div className="relative w-16 h-16 rounded-2xl bg-slate-800 border-2 border-slate-700/50 overflow-hidden shrink-0 shadow-lg group">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    className="w-full h-full object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-500"
                    alt="ID"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-600">
                    <User size={24} />
                  </div>
                )}
                <div className="absolute inset-0 bg-linear-to-tr from-cyan-500/20 to-purple-500/20 mix-blend-overlay" />
              </div>

              <div className="overflow-hidden">
                <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">
                  Attendee
                </label>
                <div className="text-xl font-bold text-white truncate leading-none tracking-tight">
                  {user.firstName} {user.lastName}
                </div>
                <div className="text-[10px] text-cyan-400 font-mono mt-1 flex items-center gap-1">
                  ID: <span className="text-white">{orderId}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-6">
              <div>
                <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">
                  Access Level
                </label>
                <div className="text-sm font-black text-white mt-1 uppercase italic">
                  {ticket.title}
                </div>
              </div>
              <div className="text-right">
                <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">
                  Gate Status
                </label>
                <div className="text-xs font-bold text-green-400 mt-1 flex items-center justify-end gap-1">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  ACTIVE
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.5)] flex flex-col items-center gap-3">
              <div className="shrink-0 relative">
                <img
                  src={qrUrl}
                  alt="Entry QR"
                  className="w-32 h-32 object-contain"
                />
              </div>
              <div className="flex items-center gap-2">
                <QrCode size={14} className="text-black" />
                <span className="text-[10px] font-bold text-black uppercase tracking-widest">
                  Scan for Entry
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="mt-8 flex gap-4 no-print">
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-wider cursor-pointer"
        >
          <Printer size={16} /> Print Pass
        </button>
        <button
          onClick={onReset}
          className="flex items-center gap-2 text-xs font-bold text-red-400 hover:text-red-300 transition-colors uppercase tracking-wider cursor-pointer"
        >
          <Trash2 size={16} /> New Order
        </button>
      </div>
    </div>
  );
};

export default function EventRegistration() {
  const [view, setView] = useState(() => {
    return localStorage.getItem("pui_view") || "landing";
  });
  const [step, setStep] = useState(() => {
    return parseInt(localStorage.getItem("pui_step") || "0");
  });
  const [selectedEvent, setSelectedEvent] = useState(() => {
    const saved = localStorage.getItem("pui_event");
    return saved ? JSON.parse(saved) : null;
  });
  const [orderId, setOrderId] = useState(() => {
    return localStorage.getItem("pui_order") || "";
  });
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem("pui_data");
    return saved
      ? JSON.parse(saved)
      : {
          ticketId: "standard",
          addons: [],
          firstName: "",
          lastName: "",
          email: "",
          avatar: null,
        };
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    localStorage.setItem("pui_view", view);
    localStorage.setItem("pui_step", step);
    localStorage.setItem("pui_event", JSON.stringify(selectedEvent));
    localStorage.setItem("pui_order", orderId);
    localStorage.setItem("pui_data", JSON.stringify(data));
  }, [view, step, selectedEvent, orderId, data]);

  const handleReset = () => {
    localStorage.clear();
    setView("landing");
    setStep(0);
    setSelectedEvent(null);
    setOrderId("");
    setData({
      ticketId: "standard",
      addons: [],
      firstName: "",
      lastName: "",
      email: "",
      avatar: null,
    });
  };

  const ticket = TICKETS.find((t) => t.id === data.ticketId);
  const addonTotal = data.addons.reduce(
    (sum, id) => sum + (ADDONS.find((a) => a.id === id)?.price || 0),
    0
  );
  const total = ticket ? ticket.price + addonTotal : 0;

  const validateStep1 = () => {
    const newErrors = {};
    if (!data.firstName.trim()) newErrors.firstName = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
      newErrors.email = true;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 2) {
      setView("payment");
    } else {
      if (step === 1 && !validateStep1()) {
        return;
      }
      setStep((s) => s + 1);
    }
  };

  const handlePaymentComplete = () => {
    setOrderId(generateOrderId());
    setView("success");
  };

  const handleBack = () => {
    if (step === 0) {
      setView("landing");
    } else {
      setStep((s) => s - 1);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#020617] flex items-center justify-center p-4 font-sans text-slate-200 overflow-y-auto no-scrollbar">
      <GlobalStyles />
      <div className="relative w-full max-w-md h-auto min-h-162.5 my-10">
        <div className="absolute top-10 left-4 right-4 bottom-0 bg-linear-to-b from-cyan-500 via-purple-600 to-amber-500 rounded-[2.5rem] blur-[80px] opacity-40 animate-pulse"></div>
        <div className="relative w-full h-full bg-[#09090b] rounded-3xl border border-white/10 shadow-2xl flex flex-col overflow-hidden z-10 transition-all duration-300">
          <div className="shrink-0 h-20 flex items-center justify-center bg-[#09090b] z-20 border-b border-white/5">
            <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase drop-shadow-md">
              PUI Event
            </h1>
          </div>
          <div className="p-8 flex-1 relative flex flex-col">
            <AnimatePresence mode="wait">
              {view === "landing" && (
                <motion.div
                  key="landing"
                  className="h-full flex flex-col"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <CitySelection
                    onSelect={(evt) => {
                      setSelectedEvent(evt);
                      setView("wizard");
                    }}
                  />
                </motion.div>
              )}
              {view === "wizard" && (
                <motion.div
                  key="wizard"
                  className="h-full flex flex-col"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <TicketForm
                    data={data}
                    setData={setData}
                    step={step}
                    total={total}
                    selectedEvent={selectedEvent}
                    goNext={handleNext}
                    goBack={handleBack}
                    errors={errors}
                  />
                </motion.div>
              )}
              {view === "payment" && (
                <motion.div
                  key="payment"
                  className="h-full flex flex-col"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <PaymentGateway
                    total={total}
                    onComplete={handlePaymentComplete}
                  />
                </motion.div>
              )}
              {view === "success" && (
                <motion.div
                  key="success"
                  className="h-full flex flex-col"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <PremiumTicket
                    event={selectedEvent}
                    ticket={ticket}
                    user={data}
                    orderId={orderId}
                    onReset={handleReset}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
