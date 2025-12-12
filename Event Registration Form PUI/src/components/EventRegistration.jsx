import { useState } from "react";
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
} from "lucide-react";
import classNames from "classnames";

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

const CitySelection = ({ onSelect }) => (
  <div className="flex flex-col h-full w-full">
    <div className="text-center mb-6 shrink-0">
      <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-[0.2em]">
        Select Destination
      </h3>
    </div>
    <div className="flex-1 space-y-4">
      {EVENTS.map((evt, i) => (
        <motion.div
          key={evt.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          onClick={() => evt.status !== "Waitlist" && onSelect(evt)}
          className={classNames(
            "group relative h-24 rounded-xl overflow-hidden border transition-all w-full",
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
              <div className="flex items-center gap-2 mb-1">
                <MapPin size={12} className="text-cyan-400" />
                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">
                  {evt.venue}
                </span>
              </div>
              <h3 className="text-2xl font-black text-white leading-none tracking-tight">
                {evt.city}
              </h3>
              <span className="text-xs text-slate-400 font-mono mt-1 block">
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
                <Lock size={14} />
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
  setStep,
  total,
  selectedEvent,
  goNext,
}) => {
  const update = (k, v) => setData((p) => ({ ...p, [k]: v }));

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      update("avatar", imageUrl);
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="shrink-0 mb-6 flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <button
            onClick={() => setStep((s) => s - 1)}
            className="text-[10px] font-bold text-slate-500 hover:text-white uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer mb-1"
          >
            <ArrowLeft size={12} /> Back
          </button>
          <h2 className="text-2xl font-bold text-white leading-none">
            {selectedEvent.city}
          </h2>
        </div>
        <div className="flex gap-1.5">
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

      <div className="space-y-6">
        {step === 0 && (
          <div className="space-y-3">
            {TICKETS.map((t) => (
              <div
                key={t.id}
                onClick={() => update("ticketId", t.id)}
                className={classNames(
                  "relative p-4 rounded-xl border transition-all flex items-center justify-between w-full cursor-pointer group",
                  data.ticketId === t.id
                    ? "bg-cyan-500/10 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                    : "bg-transparent border-slate-800 hover:border-slate-600"
                )}
              >
                <div>
                  <div className="flex items-center gap-3">
                    <span
                      className={classNames(
                        "text-base font-bold",
                        data.ticketId === t.id ? "text-white" : "text-slate-300"
                      )}
                    >
                      {t.title}
                    </span>
                    {t.tag && (
                      <span className="text-[9px] font-bold bg-amber-500 text-black px-2 py-0.5 rounded uppercase">
                        {t.tag}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{t.features}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-mono font-bold text-white">
                    ${t.price}
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border ml-auto mt-2 flex items-center justify-center transition-colors ${
                      data.ticketId === t.id
                        ? "bg-cyan-500 border-cyan-500"
                        : "border-slate-700 group-hover:border-slate-500"
                    }`}
                  >
                    {data.ticketId === t.id && (
                      <Check size={12} className="text-black" strokeWidth={4} />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6">
            <div className="space-y-3">
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
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

            <div className="space-y-4 pt-4 border-t border-white/5">
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Attendee Details
                </h4>
                <p className="text-[10px] text-slate-500">* Required</p>
              </div>

              <div className="flex items-center gap-5">
                <label className="relative w-16 h-16 rounded-full bg-slate-800 border border-slate-700 hover:border-cyan-500 cursor-pointer overflow-hidden flex items-center justify-center transition-all group shrink-0 ring-4 ring-black">
                  {data.avatar ? (
                    <img
                      src={data.avatar}
                      alt="User"
                      className="w-full h-full object-cover"
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
                  <p className="text-xs text-white font-bold uppercase mb-1">
                    Upload Photo ID
                  </p>
                  <p className="text-[10px] text-slate-500 leading-relaxed">
                    Please upload a clear headshot for your event badge.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input
                  placeholder="FIRST NAME"
                  value={data.firstName}
                  onChange={(e) => update("firstName", e.target.value)}
                  className="w-full bg-[#0F1116] border border-slate-800 rounded-lg p-3 text-sm text-white outline-none focus:border-cyan-500 placeholder:text-slate-600 font-bold transition-colors"
                />
                <input
                  placeholder="LAST NAME"
                  value={data.lastName}
                  onChange={(e) => update("lastName", e.target.value)}
                  className="w-full bg-[#0F1116] border border-slate-800 rounded-lg p-3 text-sm text-white outline-none focus:border-cyan-500 placeholder:text-slate-600 font-bold transition-colors"
                />
              </div>
              <input
                placeholder="EMAIL ADDRESS"
                value={data.email}
                onChange={(e) => update("email", e.target.value)}
                className="w-full bg-[#0F1116] border border-slate-800 rounded-lg p-3 text-sm text-white outline-none focus:border-cyan-500 placeholder:text-slate-600 font-bold transition-colors"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="bg-[#0F1116] border border-white/10 rounded-xl p-6 space-y-4">
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

              <div className="space-y-2">
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
            <div className="flex items-center gap-2 justify-center text-[10px] text-slate-600 font-bold uppercase tracking-widest">
              <CreditCard size={12} /> Payment Secured via Stripe
            </div>
          </div>
        )}
      </div>

      <div className="shrink-0 mt-8 pt-6 border-t border-white/5">
        <button
          onClick={goNext}
          className="w-full group relative flex items-center justify-center gap-3 py-4 bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase tracking-widest text-sm rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] cursor-pointer"
        >
          {step === 2 ? "Confirm Payment" : "Continue"}{" "}
          <ArrowRight
            size={16}
            className="group-hover:translate-x-1 transition-transform"
          />
        </button>
      </div>
    </div>
  );
};

const PremiumTicket = ({ event, ticket, user, orderId }) => (
  <div className="flex flex-col items-center justify-center w-full h-full">
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="relative w-full max-w-sm bg-[#1a1d24] rounded-2xl overflow-hidden shadow-2xl border border-white/5"
    >
      <div className="h-2 w-full bg-linear-to-r from-cyan-400 via-purple-500 to-cyan-400 animate-pulse" />

      <div className="p-6 relative">
        <div className="absolute top-5 right-5 animate-pulse">
          <Sparkles size={20} className="text-cyan-400" />
        </div>
        <div className="inline-block px-2.5 py-1 rounded border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-[9px] font-bold uppercase tracking-widest mb-4">
          Confirmed
        </div>
        <h1 className="text-4xl font-black text-white leading-none mb-2 uppercase italic tracking-tighter">
          {event.city}
        </h1>
        <div className="flex items-center gap-3 text-sm text-slate-400 font-mono">
          <span>{event.date}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
          <span>{event.venue}</span>
        </div>
      </div>

      <div className="relative flex items-center justify-between px-4 opacity-50">
        <div className="w-8 h-8 rounded-full bg-[#09090b] -ml-8" />
        <div className="flex-1 border-t-2 border-dashed border-slate-700" />
        <div className="w-8 h-8 rounded-full bg-[#09090b] -mr-8" />
      </div>

      <div className="p-6 pt-6 space-y-6">
        <div className="flex items-center gap-5 bg-[#13151b] p-4 rounded-xl border border-white/5">
          <div className="w-16 h-16 rounded-xl bg-slate-800 border-2 border-slate-700 overflow-hidden shrink-0 shadow-lg">
            {user.avatar ? (
              <img
                src={user.avatar}
                className="w-full h-full object-cover"
                alt="ID"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-600">
                <User size={24} />
              </div>
            )}
          </div>
          <div className="overflow-hidden">
            <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">
              Attendee
            </label>
            <div className="text-lg font-bold text-white truncate leading-tight">
              {user.firstName} {user.lastName}
            </div>
            <div className="text-[10px] text-cyan-400 font-mono mt-1">
              REF: {orderId}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">
              Class
            </label>
            <div className="text-sm font-bold text-white mt-1">
              {ticket.title.toUpperCase()}
            </div>
          </div>
          <div className="text-right">
            <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">
              Admit
            </label>
            <div className="text-sm font-bold text-white mt-1">01</div>
          </div>
        </div>

        <div>
          <div className="h-10 w-full bg-white rounded flex items-end justify-between px-3 pb-1 overflow-hidden">
            {[...Array(40)].map((_, i) => (
              <div
                key={i}
                className="bg-black"
                style={{
                  width: Math.random() > 0.5 ? 2 : 4,
                  height: Math.random() * 70 + 30 + "%",
                }}
              />
            ))}
          </div>
          <div className="text-center text-[9px] text-slate-600 font-mono mt-2 tracking-[0.4em]">
            SCAN ENTRY
          </div>
        </div>
      </div>
    </motion.div>

    <div className="mt-8 flex gap-4 no-print">
      <button
        onClick={() => window.print()}
        className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-wider cursor-pointer"
      >
        <Printer size={16} /> Print
      </button>
      <button
        onClick={() => window.location.reload()}
        className="text-xs font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-wider cursor-pointer"
      >
        Close
      </button>
    </div>

    <style>{`
      @media print {
        body { background: #000; }
        .no-print { display: none; }
        * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
      }
    `}</style>
  </div>
);

export default function EventRegistration() {
  const [view, setView] = useState("landing");
  const [step, setStep] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [data, setData] = useState({
    ticketId: "standard",
    addons: [],
    firstName: "",
    lastName: "",
    email: "",
    avatar: null,
  });

  const ticket = TICKETS.find((t) => t.id === data.ticketId);
  const addonTotal = data.addons.reduce(
    (sum, id) => sum + (ADDONS.find((a) => a.id === id)?.price || 0),
    0
  );
  const total = ticket ? ticket.price + addonTotal : 0;

  const handleNext = () => {
    if (step === 2) setView("success");
    else {
      if (step === 1 && (!data.firstName || !data.email)) {
        alert("Details required");
        return;
      }
      setStep((s) => s + 1);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#020617] flex items-center justify-center p-4 font-sans text-slate-200 overflow-hidden">
      <div className="relative w-full max-w-lg">
        <div className="absolute top-10 left-4 right-4 bottom-0 bg-linear-to-b from-cyan-500 via-purple-600 to-amber-500 rounded-[2.5rem] blur-[80px] opacity-40 animate-pulse"></div>

        <div className="relative w-full bg-[#09090b] rounded-4xl border border-white/10 shadow-2xl flex flex-col overflow-hidden z-10 transition-all duration-300">
          <div className="shrink-0 h-20 flex items-center justify-center bg-[#09090b] z-20 border-b border-white/5">
            <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase drop-shadow-md">
              PUI Event
            </h1>
          </div>

          <div className="p-8">
            <AnimatePresence mode="wait">
              {view === "landing" && (
                <motion.div
                  key="landing"
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
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <TicketForm
                    data={data}
                    setData={setData}
                    step={step}
                    setStep={setStep}
                    total={total}
                    selectedEvent={selectedEvent}
                    goNext={handleNext}
                  />
                </motion.div>
              )}

              {view === "success" && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <PremiumTicket
                    event={selectedEvent}
                    ticket={ticket}
                    user={data}
                    orderId="8X-99"
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
