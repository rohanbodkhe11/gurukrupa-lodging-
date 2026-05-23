import React, { useState, useEffect } from 'react';
import { 
  Briefcase, User, Mail, Phone, Calendar, ClipboardCheck, XCircle, 
  Printer, Coins, ArrowRight, UserCheck, ShieldAlert, Sparkles, AlertCircle
} from 'lucide-react';
import { Booking, UserProfile } from '../types';

interface CustomerDashboardProps {
  user: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
  setCurrentTab: (tab: string) => void;
}

export default function CustomerDashboard({
  user,
  onUpdateUser,
  setCurrentTab
}: CustomerDashboardProps) {
  const [activeTab, setActiveTab] = useState<'bookings' | 'profile' | 'payments'>('bookings');
  
  // States
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileName, setProfileName] = useState(user.name);
  const [profilePhone, setProfilePhone] = useState(user.phone);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<Booking | null>(null);

  // Fetch guest's bookings
  const fetchBookings = async () => {
    setLoading(true);
    try {
      let data = [];
      try {
        const res = await fetch(`/api/bookings?email=${encodeURIComponent(user.email)}`);
        if (res.ok) {
          const contentType = res.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            data = await res.json();
          }
        }
      } catch (err) {
        console.warn("Express backend offline, falling back to local storage search", err);
      }

      if (!data || data.length === 0) {
        const cachedStr = localStorage.getItem('gurukrupa_bookings');
        if (cachedStr) {
          try {
            const allB = JSON.parse(cachedStr);
            if (Array.isArray(allB)) {
              data = allB.filter((b: any) => b && b.guestEmail && b.guestEmail.toLowerCase() === user.email.toLowerCase());
            }
          } catch (e) {
            console.warn("Corrupted bookings JSON loaded in CustomerDashboard retrieval path.", e);
          }
        }
      }

      setBookings(data || []);
    } catch (err) {
      console.error("Booking retrieval failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [user.email]);

  // Cancel reservation
  const handleCancelBooking = async (bookingId: string) => {
    const check = window.confirm("Are you sure you wish to request cancellation for this reservation? This step is permanent.");
    if (!check) return;

    let success = false;
    try {
      const res = await fetch(`/api/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Cancelled', paymentStatus: 'Refunded' })
      });
      if (res.ok) {
        success = true;
      }
    } catch (err) {
      console.warn("Backend offline during cancellation, updating client-side storage simulation", err);
    }

    // Always find and update client-side localStorage to remain perfectly congruent
    const cachedStr = localStorage.getItem('gurukrupa_bookings');
    if (cachedStr) {
      try {
        const allB = JSON.parse(cachedStr);
        if (Array.isArray(allB)) {
          const idx = allB.findIndex((b: any) => b.id === bookingId);
          if (idx !== -1) {
            allB[idx].status = 'Cancelled';
            allB[idx].paymentStatus = 'Refunded';
            localStorage.setItem('gurukrupa_bookings', JSON.stringify(allB));
            success = true;
          }
        }
      } catch (e) {
        console.warn("Could not parse bookings in cancellation caching update.", e);
      }
    }

    if (success) {
      setSuccessMsg("Reservation cancelled successfully. If paid, your refund will credit within 3 banking days.");
      fetchBookings();
      setTimeout(() => setSuccessMsg(''), 5000);
    } else {
      alert("Failed to cancel reservation.");
    }
  };

  // Update profile handler
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName.trim() || !profilePhone.trim()) {
      alert("Please provide valid information.");
      return;
    }

    setIsUpdatingProfile(true);
    try {
      const res = await fetch('/api/auth/register', { // Endpoint handles registration/overwrites safely
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: profileName,
          email: user.email,
          phone: profilePhone
        })
      });
      const data = await res.json();
      if (res.ok) {
        onUpdateUser(data.user);
        setSuccessMsg("Profile information updated successfully!");
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        alert(data.error || "Update failed.");
      }
    } catch (err) {
      alert("Server connection failed.");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed': return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20';
      case 'Checked-In': return 'bg-blue-500/15 text-blue-400 border-blue-500/20';
      case 'Completed': return 'bg-slate-500/15 text-slate-400 border-slate-700';
      case 'Cancelled': return 'bg-red-500/15 text-red-500 border-red-500/20';
      default: return 'bg-amber-500/15 text-amber-500 border-amber-500/20';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Greetings banner block */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-md mb-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 h-32 w-32 bg-amber-500/5 rounded-full blur-xl" />
        <div className="flex items-center gap-4 relative">
          <div className="h-14 w-14 rounded-full bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 text-xl font-bold font-serif shadow-md border border-amber-400/30">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-serif font-bold text-slate-100">Welcome back, {user.name}!</h1>
            <p className="text-xs text-slate-400 font-mono mt-0.5">Guest registry level • Member since {new Date(user.registeredAt).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={() => setCurrentTab('rooms')}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 text-xs font-bold rounded-lg shadow-md transition-all active:scale-95 flex items-center gap-1.5"
          >
            Book Another Room <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-lg flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Responsive layout bento grid splits */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Navigation panel */}
        <div className="md:col-span-1 bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2.5">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'bookings'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Briefcase className="h-4 w-4" />
            <span>My Reservations ({bookings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'profile'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <User className="h-4 w-4" />
            <span>Persisted Profile Info</span>
          </button>

          <button
            onClick={() => setActiveTab('payments')}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'payments'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Coins className="h-4 w-4" />
            <span>Payments History</span>
          </button>
        </div>

        {/* Content displays */}
        <div className="md:col-span-3">
          {activeTab === 'bookings' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-serif font-bold text-slate-200">Active Bookings ({bookings.length})</h3>
                <span className="text-[10px] text-slate-500 uppercase font-mono tracking-wider">Lodge Standard Checkin 12:00 PM</span>
              </div>

              {loading ? (
                <div className="p-12 text-center text-slate-500">Retrieving reservation histories...</div>
              ) : bookings.length === 0 ? (
                <div className="p-12 bg-slate-900/60 border border-slate-800/80 rounded-xl text-center text-slate-500">
                  <ShieldAlert className="h-8 w-8 text-slate-700 mx-auto mb-3" />
                  <p className="text-xs">No accommodations bookings logged yet.</p>
                  <button 
                    onClick={() => setCurrentTab('rooms')} 
                    className="mt-4 px-3.5 py-1.5 bg-amber-500 text-slate-950 rounded text-xs font-bold hover:bg-amber-400 transition-colors"
                  >
                    Reserving Room Now
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((b) => (
                    <div 
                      key={b.id}
                      className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-slate-700 transition-all shadow-md"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-mono font-bold text-amber-500 uppercase">{b.id}</span>
                          <span className={`text-[10px] uppercase font-mono border px-2 py-0.5 rounded-md ${getStatusColor(b.status)}`}>
                            {b.status}
                          </span>
                        </div>
                        <h4 className="font-serif font-bold text-slate-200 text-sm">
                          Room {b.roomNumber} &mdash; {b.roomName}
                        </h4>
                        <p className="text-xs text-slate-400 flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-amber-500" />
                          <span>Stay Span: {b.checkIn} to {b.checkOut} ({b.guestsCount} Guest(s))</span>
                        </p>
                      </div>

                      <div className="w-full md:w-auto flex md:flex-col items-end justify-between border-t md:border-t-0 border-slate-800/80 pt-3 md:pt-0 gap-3">
                        <div className="text-left md:text-right">
                          <p className="text-[10px] text-slate-500 font-mono">Total Transaction</p>
                          <p className="text-sm font-bold text-amber-400 font-mono">₹{b.totalAmount}</p>
                        </div>
                        <div className="flex gap-2.5">
                          <button 
                            onClick={() => setSelectedInvoice(b)}
                            className="p-1.5 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded text-xs flex items-center gap-1 transition-colors"
                            title="Print Tax Voucher"
                          >
                            <Printer className="h-3.5 w-3.5" />
                            <span>Invoice</span>
                          </button>
                          
                          {(b.status === 'Pending' || b.status === 'Confirmed') && (
                            <button 
                              onClick={() => handleCancelBooking(b.id)}
                              className="p-1.5 bg-red-950/20 text-red-400 hover:bg-red-500 hover:text-slate-950 border border-red-500/20 rounded text-xs flex items-center gap-1 transition-all"
                            >
                              <XCircle className="h-3.5 w-3.5" />
                              <span>Cancel Stay</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h3 className="text-base font-serif font-bold text-slate-200 border-b border-slate-800 pb-3 mb-5 flex items-center gap-1.5">
                <UserCheck className="h-5 w-5 text-amber-500" />
                <span>Update Registered Credentials</span>
              </h3>

              <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-lg font-sans">
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 font-bold uppercase font-mono tracking-wider">Account Identifier (Immutable)</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-600" />
                    <input 
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 pl-10 pr-4 text-xs text-slate-500 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-400 font-bold uppercase font-mono tracking-wider">Real Full Name</label>
                  <input 
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2.5 px-4 text-xs text-white focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-400 font-bold uppercase font-mono tracking-wider">Mobile Phone / WhatsApp Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3.5 h-3.5 w-3.5 text-amber-500" />
                    <input 
                      type="text"
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-amber-500"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isUpdatingProfile}
                  className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold rounded-lg text-xs hover:from-amber-400 shadow-md transition-all"
                >
                  {isUpdatingProfile ? "Saving Details..." : "Save Profile Details"}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <h3 className="text-base font-serif font-bold text-slate-200">Payment Transactions</h3>
              {bookings.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-6">No transaction statements available.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs font-mono">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-serif font-bold uppercase tracking-wider text-[10px]">
                        <th className="py-2.5">Booking ID</th>
                        <th className="py-2.5">Payment Hash ID</th>
                        <th className="py-2.5">Method</th>
                        <th className="py-2.5">Status</th>
                        <th className="py-2.5 text-right">Amount Paid</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                      {bookings.map((b) => (
                        <tr key={b.id}>
                          <td className="py-3 font-bold text-slate-100">{b.id}</td>
                          <td className="py-3 text-slate-400">{b.paymentId || 'N/A'}</td>
                          <td className="py-3">{b.paymentMethod || 'Razorpay Gateway'}</td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                              b.paymentStatus === 'Paid' 
                                ? 'bg-emerald-500/10 text-emerald-400' 
                                : b.paymentStatus === 'Refunded'
                                ? 'bg-amber-500/10 text-amber-400'
                                : 'bg-red-500/10 text-red-400'
                            }`}>
                              {b.paymentStatus}
                            </span>
                          </td>
                          <td className="py-3 text-right font-bold text-amber-400">₹{b.totalAmount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Invoice lightbox popup */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-2xl relative space-y-4">
            <h3 className="font-serif text-slate-100 font-bold text-base flex justify-between">
              <span>Accommodations Tax Invoice & Voucher</span>
              <button 
                onClick={() => setSelectedInvoice(null)}
                className="text-slate-500 hover:text-white"
              >
                &times;
              </button>
            </h3>

            <div className="bg-slate-950 text-left border border-slate-800 rounded-xl p-5 font-mono text-[11px] leading-relaxed text-slate-300 space-y-4">
              <div className="flex justify-between border-b border-dashed border-slate-800 pb-3 text-xs">
                <div>
                  <h4 className="font-serif text-amber-400 font-bold">GURUKRUPA LODGING</h4>
                  <p className="text-[9px] text-slate-500">Satara Highways, MH, India</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-200">TAX RECEIPT</p>
                  <p className="text-[10px] text-emerald-400 uppercase">Paid & confirmed</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <p><span className="text-slate-500">BOOKING ID:</span><br /><b className="text-slate-100 font-sans">{selectedInvoice.id}</b></p>
                <p className="text-right"><span className="text-slate-500">REF TRANSACTION:</span><br /><span className="text-amber-500">{selectedInvoice.paymentId || 'PAY-SIM-123'}</span></p>

                <p><span className="text-slate-500">ROOM:</span><br /><span className="text-slate-100">Room {selectedInvoice.roomNumber} ({selectedInvoice.roomName})</span></p>
                <p className="text-right"><span className="text-slate-500">GUEST:</span><br /><span className="text-slate-100">{selectedInvoice.guestName}</span></p>

                <p><span className="text-slate-500">STAY IN:</span><br /><span className="text-slate-100">{selectedInvoice.checkIn}</span></p>
                <p className="text-right"><span className="text-slate-500">STAY OUT:</span><br /><span className="text-slate-100">{selectedInvoice.checkOut}</span></p>
              </div>

              <div className="border-t border-dashed border-slate-800 pt-3 text-right">
                <span className="text-[10px] text-slate-500">TOTAL GST FARE CAPTURED:</span>
                <p className="text-sm font-bold text-amber-400">₹{selectedInvoice.totalAmount}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => window.print()}
                className="w-full text-center py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-bold"
              >
                Print Voucher
              </button>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="w-full text-center py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded text-xs"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
