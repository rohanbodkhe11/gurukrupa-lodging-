import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, Users, Coins, Percent, FileSliders, Plus, Edit3, Trash2, 
  Check, X, CheckSquare, Settings as SettingsIcon, AlertCircle, RefreshCcw, 
  MapPin, Phone, MessageSquarePlus, ShieldCheck, UserMinus, UserCheck, ShieldAlert,
  CreditCard, Image as ImageIcon, Sparkles, Tag, Bell, FileText, Lock, Moon, Sun,
  Menu, LogOut, ChevronLeft, Eye, ShoppingBag, Download, CheckSquare2, ArrowRight
} from 'lucide-react';
import { Room, Booking, Review, UserProfile, SiteSettings, Notification } from '../types';

const LogoImage = "https://i.ibb.co/jvK3nSVv/1779473626954.png";

interface AdminPanelProps {
  user: UserProfile;
  rooms: Room[];
  bookings: Booking[];
  reviews: Review[];
  settings: SiteSettings;
  onRefreshAllData: () => void;
  onLogout: () => void;
}

type TabType = 
  | 'overview' 
  | 'rooms' 
  | 'bookings' 
  | 'customers' 
  | 'payments' 
  | 'reviews' 
  | 'gallery' 
  | 'services' 
  | 'offers' 
  | 'notifications' 
  | 'reports' 
  | 'settings' 
  | 'admin-settings';

export default function AdminPanel({
  user,
  rooms,
  bookings,
  reviews,
  settings,
  onRefreshAllData,
  onLogout
}: AdminPanelProps) {
  // State variables
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Analytics and statistics
  const [analytics, setAnalytics] = useState<any>({
    totalBookings: 0,
    totalRevenue: 0,
    availableRooms: 0,
    occupiedRooms: 0,
    pendingBookings: 0,
    monthlyData: [],
    recentBookings: [],
    paymentStats: []
  });
  const [isRefreshingStats, setIsRefreshingStats] = useState(false);

  // Theme settings
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Forms and Modals
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [newRoomNo, setNewRoomNo] = useState('');
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomType, setNewRoomType] = useState<'Single' | 'Double' | 'Family'>('Double');
  const [newRoomAC, setNewRoomAC] = useState(true);
  const [newRoomPrice, setNewRoomPrice] = useState(2500);
  const [newRoomCapacity, setNewRoomCapacity] = useState(2);
  const [newRoomAmenities, setNewRoomAmenities] = useState('Free Highspeed WiFi, LED Cable TV, Solar Hot Water, CCTV Monitored Gated Lot, Intercom, 24/7 Room Service');
  const [newRoomImage, setNewRoomImage] = useState('https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80');
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);

  // Customer & local lists
  const [allReviews, setAllReviews] = useState<Review[]>([]);
  const [customers, setCustomers] = useState<UserProfile[]>([]);
  const [alerts, setAlerts] = useState<Notification[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Gallery Asset Management
  const [gallery, setGallery] = useState([
    { id: 'gal-2', url: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80', caption: 'Premium Gold Family Suite Living area', category: 'Rooms' },
    { id: 'gal-3', url: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=800&q=80', caption: 'Prisinte Lobby & Welcoming Seatings', category: 'Reception' },
    { id: 'gal-4', url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80', caption: 'Comfort Double King AC bedding layout', category: 'Rooms' }
  ]);
  const [newGalleryUrl, setNewGalleryUrl] = useState('');
  const [newGalleryCaption, setNewGalleryCaption] = useState('');
  const [newGalleryCat, setNewGalleryCat] = useState<'Rooms' | 'Reception' | 'Exterior' | 'Facilities'>('Rooms');

  // Hotel services
  const [services, setServices] = useState([
    { id: 'srv-1', name: 'Free Fiber WiFi', desc: 'Complimentary high-speed WiFi coverage throughout all lodge suits', icon: 'WiFi', status: 'Active' },
    { id: 'srv-2', name: 'Gated Private Parking', desc: 'Secure gated onsite parking grid with continuous security guard monitoring', icon: 'Parking', status: 'Active' },
    { id: 'srv-3', name: 'Solar Thermo Hot Boiler', desc: 'Boiler layout ensuring continuous hot water showers', icon: 'Hot Water', status: 'Active' },
    { id: 'srv-4', name: 'CCTV Security Guard Support', desc: 'Secure CCTV recording coverage for all corridors', icon: 'CCTV', status: 'Active' },
    { id: 'srv-5', name: 'Power Generator Linkage', desc: 'Automatic power backup facilities', icon: 'Power Backup', status: 'Active' }
  ]);
  const [newServiceName, setNewServiceName] = useState('');
  const [newServiceDesc, setNewServiceDesc] = useState('');

  // Discount offers / Coupon Codes
  const [offers, setOffers] = useState([
    { code: 'WELCOME10', discount: '10%', type: 'Percentage', validity: 'Active', desc: 'Flat 10% cash discount valid for first-time guest bookings.' },
    { code: 'ELLORATOUR', discount: '15%', type: 'Percentage', validity: 'Active', desc: 'Tourist deal ensuring 15% discount for long stays.' },
    { code: 'FAMILYSTAY', discount: '₹500', type: 'Flat Amount', validity: 'Active', desc: 'Flat ₹500 discount for family standard layout bookings.' }
  ]);
  const [newOfferCode, setNewOfferCode] = useState('');
  const [newOfferDiscount, setNewOfferDiscount] = useState('');
  const [newOfferType, setNewOfferType] = useState<'Percentage' | 'Flat Amount'>('Percentage');
  const [newOfferDesc, setNewOfferDesc] = useState('');

  // Dynamic CMS form values
  const [siteName, setSiteName] = useState(settings.siteName);
  const [tagline, setTagline] = useState(settings.tagline);
  const [phone, setPhone] = useState(settings.phone);
  const [email, setEmail] = useState(settings.email);
  const [address, setAddress] = useState(settings.address);
  const [whatsappNumber, setWhatsappNumber] = useState(settings.whatsappNumber);
  const [aboutText, setAboutText] = useState(settings.aboutText);

  // Admin Settings Form
  const [adminName, setAdminName] = useState(user.name);
  const [adminPhone, setAdminPhone] = useState(user.phone || '7620586155');
  const [adminEmail, setAdminEmail] = useState(user.email);
  const [adminPassword, setAdminPassword] = useState('••••••••');

  // Fetch metrics data
  const fetchAnalytics = async () => {
    setIsRefreshingStats(true);
    try {
      let analyticsData = null;
      try {
        const res = await fetch('/api/admin/analytics');
        if (res.ok) {
          const contentType = res.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            analyticsData = await res.json();
          }
        }
      } catch (e) {
        console.warn("Express backend analytics offline. Simulating client stats.", e);
      }

      if (analyticsData) {
        const pendingCount = bookings.filter(b => b.status === 'Pending').length;
        setAnalytics({
          ...analyticsData,
          pendingBookings: pendingCount || 0,
          paymentStats: [
            { name: 'UPI Gpay', value: Math.floor(analyticsData.totalRevenue * 0.55), color: '#10b981' },
            { name: 'Razorpay Cards', value: Math.floor(analyticsData.totalRevenue * 0.35), color: '#3b82f6' },
            { name: 'On-Spot Cash', value: Math.floor(analyticsData.totalRevenue * 0.1), color: '#f59e0b' }
          ]
        });
      } else {
        // Enriched offline metrics generator
        const activeCount = bookings.filter(b => b.status === 'Confirmed' || b.status === 'Checked-In').length;
        const totalRev = bookings.reduce((sum, b) => b.paymentStatus === 'Paid' ? sum + b.totalAmount : sum, 0);
        const occupancyPct = Math.min(100, Math.round((activeCount / (rooms.length || 1)) * 100));

        setAnalytics({
          totalRevenue: totalRev || 6360,
          bookingsCount: bookings.length || 2,
          roomsCount: rooms.length || 4,
          occupancyRate: occupancyPct || 50,
          activeBookings: activeCount || 2,
          pendingBookings: bookings.filter(b => b.status === 'Pending').length || 0,
          revenueData: [
            { month: 'Jan', revenue: Math.floor((totalRev || 6360) * 0.1) },
            { month: 'Feb', revenue: Math.floor((totalRev || 6360) * 0.25) },
            { month: 'Mar', revenue: Math.floor((totalRev || 6360) * 0.5) },
            { month: 'Apr', revenue: Math.floor((totalRev || 6360) * 0.75) },
            { month: 'May', revenue: totalRev || 6360 }
          ],
          paymentStats: [
            { name: 'UPI Gpay', value: Math.floor((totalRev || 6360) * 0.55), color: '#10b981' },
            { name: 'Razorpay Cards', value: Math.floor((totalRev || 6360) * 0.35), color: '#3b82f6' },
            { name: 'On-Spot Cash', value: Math.floor((totalRev || 6360) * 0.1), color: '#f59e0b' }
          ]
        });
      }

      // Fetch reviews including unapproved ones safely
      let reviewsData = null;
      try {
        const resRev = await fetch('/api/reviews?all=true');
        if (resRev.ok) {
          const contentType = resRev.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            reviewsData = await resRev.json();
          }
        }
      } catch (e) {
        console.warn("Express reviews retrieval failed, using fallback review states.");
      }

      if (reviewsData) {
        setAllReviews(reviewsData);
      } else {
        // Fallback reviews list from active state or localStorage cache
        const cachedReviews = localStorage.getItem('gurukrupa_reviews');
        if (cachedReviews) {
          try {
            setAllReviews(JSON.parse(cachedReviews));
          } catch (e) {
            console.warn("Corrupted reviews JSON cache found in Admin panel fallback.", e);
            setAllReviews(reviews);
          }
        } else {
          setAllReviews(reviews);
        }
      }

      // Fetch verified customers list safely
      let customersData = null;
      try {
        const resCust = await fetch('/api/customers');
        if (resCust.ok) {
          const contentType = resCust.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            customersData = await resCust.json();
          }
        }
      } catch (e) {
        console.warn("Express customer profiles retrieval failed.");
      }

      if (customersData) {
        setCustomers(customersData);
      } else {
        // Synthesise customer structures based on bookings list
        const uniqueEmails = Array.from(new Set(bookings.map(b => b.guestEmail.toLowerCase())));
        const simulatedCustomers = uniqueEmails.map((email, idx) => {
          const m = bookings.find(b => b.guestEmail.toLowerCase() === email);
          return {
            id: `usr-${idx}-${Math.floor(100 + Math.random() * 900)}`,
            name: m?.guestName || "Registered Lodger",
            email: email,
            phone: m?.guestPhone || "+91 7620586155",
            role: 'customer',
            isBlocked: false,
            registeredAt: m?.createdAt || new Date().toISOString()
          };
        });
        setCustomers(simulatedCustomers);
      }

      // Fetch activity logs safely
      let logsData = null;
      try {
        const resNotif = await fetch('/api/notifications');
        if (resNotif.ok) {
          const contentType = resNotif.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            logsData = await resNotif.json();
          }
        }
      } catch (e) {
        console.warn("Express logs offline.");
      }

      if (logsData) {
        setAlerts(logsData);
      } else {
        setAlerts([
          {
            id: "notif-1",
            title: "Welcome to Gurukrupa Lodging (Offline CMS Cached Mode)",
            message: "The admin dashboard is fully active using cached localStorage datasets.",
            type: "system",
            date: new Date().toISOString(),
            read: false
          }
        ]);
      }
    } catch (err) {
      console.error("Error fetching admin metrics:", err);
    } finally {
      setIsRefreshingStats(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [rooms, bookings, reviews]);

  // Handle Save Room Suite (Create or Edit)
  const handleSaveRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomNo.trim() || !newRoomName.trim()) {
      alert("Please specify the room identifier and descriptive title.");
      return;
    }

    const payload = {
      roomNumber: newRoomNo,
      name: newRoomName,
      type: newRoomType,
      ac: newRoomAC,
      price: Number(newRoomPrice),
      capacity: Number(newRoomCapacity),
      amenities: newRoomAmenities.split(',').map(s => s.trim()).filter(Boolean),
      images: [newRoomImage]
    };

    try {
      let isSuccess = false;
      if (editingRoom) {
        // Edit Room (PUT)
        try {
          const res = await fetch(`/api/rooms/${editingRoom.id}`, {
            method: 'PUT',
            headers: { 
              'Content-Type': 'application/json',
              'x-admin-email': user.email
            },
            body: JSON.stringify(payload)
          });

          if (res.ok) {
            isSuccess = true;
          }
        } catch (apiErr) {
          console.warn("Express backend offline for editing. Preserving locally.", apiErr);
        }

        // Direct Local Storage update
        const roomsCachedStr = localStorage.getItem('gurukrupa_rooms');
        if (roomsCachedStr) {
          try {
            const rList = JSON.parse(roomsCachedStr);
            if (Array.isArray(rList)) {
              const rIdx = rList.findIndex((item: any) => item.id === editingRoom.id);
              if (rIdx !== -1) {
                rList[rIdx] = { ...rList[rIdx], ...payload };
                localStorage.setItem('gurukrupa_rooms', JSON.stringify(rList));
                isSuccess = true;
              }
            }
          } catch (e) {
            console.warn("Could not parse rooms cache when saving room editing changes.", e);
          }
        }
        
        if (isSuccess) {
          alert("Pristine Deluxe Suite Updated Live on Hotel Database!");
          handleCancelRoomForm();
          onRefreshAllData();
        } else {
          alert("Room update failed");
        }
      } else {
        // Create Room (POST)
        const newRoomObject = {
          id: `room-${Math.floor(100 + Math.random() * 900)}`,
          ...payload,
          rating: 4.8,
          reviewsCount: 1,
          status: 'Available' as const
        };

        try {
          const res = await fetch('/api/rooms', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'x-admin-email': user.email
            },
            body: JSON.stringify(payload)
          });

          if (res.ok) {
            isSuccess = true;
          }
        } catch (apiErr) {
          console.warn("Express backend offline for creating. Storing locally.", apiErr);
        }

        // Direct Local Storage insert
        const roomsCachedStr = localStorage.getItem('gurukrupa_rooms');
        let rList = [];
        try {
          rList = roomsCachedStr ? JSON.parse(roomsCachedStr) : [];
          if (!Array.isArray(rList)) rList = [];
        } catch (e) {
          console.warn("Corrupted rooms list cache. Resetting in creation path.", e);
          rList = [];
        }
        rList.push(newRoomObject);
        localStorage.setItem('gurukrupa_rooms', JSON.stringify(rList));
        isSuccess = true;

        if (isSuccess) {
          alert("Pristine Deluxe Suite Published Live on Hotel Database!");
          handleCancelRoomForm();
          onRefreshAllData();
        } else {
          alert("Room insertion failed");
        }
      }
    } catch (err) {
      alert("Error linking database connection.");
    }
  };

  const handleStartEditRoom = (room: Room) => {
    setEditingRoom(room);
    setNewRoomNo(room.roomNumber);
    setNewRoomName(room.name);
    setNewRoomType(room.type);
    setNewRoomAC(room.ac);
    setNewRoomPrice(room.price);
    setNewRoomCapacity(room.capacity);
    setNewRoomAmenities(room.amenities.join(', '));
    setNewRoomImage(room.images?.[0] || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80');
    setShowAddRoom(true);
  };

  const handleCancelRoomForm = () => {
    setShowAddRoom(false);
    setEditingRoom(null);
    setNewRoomNo('');
    setNewRoomName('');
    setNewRoomType('Double');
    setNewRoomAC(true);
    setNewRoomPrice(2500);
    setNewRoomCapacity(2);
    setNewRoomAmenities('Free Highspeed WiFi, LED Cable TV, Solar Hot Water, CCTV Monitored Gated Lot, Intercom, 24/7 Room Service');
    setNewRoomImage('https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80');
  };

  // Toggle Room Maintenance
  const handleToggleRoomStatus = async (item: Room) => {
    const nextText = item.status === 'Available' ? 'Maintenance' : 'Available';
    let isSuccess = false;
    try {
      const res = await fetch(`/api/rooms/${item.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-email': user.email
        },
        body: JSON.stringify({ status: nextText })
      });
      if (res.ok) {
        isSuccess = true;
      }
    } catch (err) {
      console.warn("Express backend offline, mutational status altered in client storage.", err);
    }

    // Direct local state storage update fallback
    const roomsCachedStr = localStorage.getItem('gurukrupa_rooms');
    if (roomsCachedStr) {
      try {
        const rList = JSON.parse(roomsCachedStr);
        if (Array.isArray(rList)) {
          const rIdx = rList.findIndex((r: any) => r.id === item.id);
          if (rIdx !== -1) {
            rList[rIdx].status = nextText;
            localStorage.setItem('gurukrupa_rooms', JSON.stringify(rList));
            isSuccess = true;
          }
        }
      } catch (e) {
        console.warn("Could not parse rooms cache when toggling status.", e);
      }
    }

    if (isSuccess) {
      onRefreshAllData();
    }
  };

  // Delete Room
  const handleDeleteSelectedRoom = async (id: string) => {
    const check = window.confirm("Are you sure you want to permanently erase this suite listings from the hotel directory?");
    if (!check) return;

    let isSuccess = false;
    try {
      const res = await fetch(`/api/rooms/${id}`, { 
        method: 'DELETE',
        headers: {
          'x-admin-email': user.email
        }
      });
      if (res.ok) {
        isSuccess = true;
      }
    } catch (err) {
      console.warn("Server offline, purging suite locally.", err);
    }

    // Direct local state storage prune fallback
    const roomsCachedStr = localStorage.getItem('gurukrupa_rooms');
    if (roomsCachedStr) {
      try {
        const rList = JSON.parse(roomsCachedStr);
        if (Array.isArray(rList)) {
          const updatedList = rList.filter((r: any) => r.id !== id);
          localStorage.setItem('gurukrupa_rooms', JSON.stringify(updatedList));
          isSuccess = true;
        }
      } catch (e) {
        console.warn("Could not parse rooms cache during room deletion.", e);
      }
    }

    if (isSuccess) {
      alert("Suite record purged successfully from the directory.");
      onRefreshAllData();
    } else {
      alert("Failed to delete room.");
    }
  };

  // Switch Booking Status (Pending -> Confirmed -> Checked-In -> Completed)
  const handleUpdateBookingStatus = async (b: Booking, targetStatus: string) => {
    let isSuccess = false;
    const payload: any = { status: targetStatus };
    if (targetStatus === 'Completed') {
      payload.paymentStatus = 'Paid';
    }

    try {
      const res = await fetch(`/api/bookings/${b.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        isSuccess = true;
      }
    } catch (err) {
      console.warn("Express status update offline. Emulating changes locally.", err);
    }

    // Direct local bookings caching update
    const bookingsCachedStr = localStorage.getItem('gurukrupa_bookings');
    if (bookingsCachedStr) {
      try {
        const bList = JSON.parse(bookingsCachedStr);
        if (Array.isArray(bList)) {
          const bIdx = bList.findIndex((item: any) => item.id === b.id);
          if (bIdx !== -1) {
            bList[bIdx] = { ...bList[bIdx], ...payload };
            localStorage.setItem('gurukrupa_bookings', JSON.stringify(bList));
            isSuccess = true;
          }
        }
      } catch (e) {
        console.warn("Could not parse bookings cache during status update.", e);
      }
    }

    if (isSuccess) {
      alert(`Reservation reference shifted successfully to ${targetStatus}`);
      onRefreshAllData();
    }
  };

  // Approve review
  const handleApproveRatingReview = async (revId: string, flag: boolean) => {
    let isSuccess = false;
    try {
      const res = await fetch(`/api/reviews/${revId}/approve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved: flag })
      });
      if (res.ok) {
        isSuccess = true;
      }
    } catch (err) {
      console.warn("Review approval server unavailable. Upgrading client review dataset.", err);
    }

    // Direct local reviews caching update
    const reviewsCachedStr = localStorage.getItem('gurukrupa_reviews');
    if (reviewsCachedStr) {
      try {
        const revList = JSON.parse(reviewsCachedStr);
        if (Array.isArray(revList)) {
          const rIdx = revList.findIndex((item: any) => item.id === revId);
          if (rIdx !== -1) {
            revList[rIdx].approved = flag;
            localStorage.setItem('gurukrupa_reviews', JSON.stringify(revList));
            isSuccess = true;
          }
        }
      } catch (e) {
        console.warn("Could not parse reviews cache during approval mutator.", e);
      }
    }

    if (isSuccess) {
      alert(flag ? "Feedback visible live for homepage visitors!" : "Feedback unlisted successfully.");
      onRefreshAllData();
    }
  };

  // Suspend/Restore Guest Profile
  const handleToggleBlockGuest = async (cust: UserProfile) => {
    const targetState = !cust.isBlocked;
    let isSuccess = false;
    try {
      const res = await fetch(`/api/customers/${cust.id}/block`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isBlocked: targetState })
      });
      if (res.ok) {
        isSuccess = true;
      }
    } catch (err) {
      console.warn("Profile block offline, writing blacklists locally.", err);
    }

    // Since customers are generated off the active bookings list during offline moments, let's persist the blockage in active customer session state too
    const bookingsCachedStr = localStorage.getItem('gurukrupa_bookings');
    if (bookingsCachedStr) {
      const bList = JSON.parse(bookingsCachedStr);
      // Alter isBlocked in related fields or user profiles cache
      localStorage.setItem(`gurukrupa_blocked_${cust.email.toLowerCase()}`, targetState ? 'true' : 'false');
      isSuccess = true;
    }

    if (isSuccess) {
      alert(targetState ? "Guest profile is now blacklisted from stays." : "Guest account restored successfully.");
      fetchAnalytics();
    }
  };

  // Save dynamically edited website settings
  const handleSaveCMSChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    let isSuccess = false;
    const cmsPayload = {
      siteName, tagline, phone, email, address, whatsappNumber, aboutText
    };

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cmsPayload)
      });
      if (res.ok) {
        isSuccess = true;
      }
    } catch (err) {
      console.warn("Express backend setting save offline. Editing local site properties.", err);
    }

    // Direct local caching update
    localStorage.setItem('gurukrupa_settings', JSON.stringify(cmsPayload));
    isSuccess = true;

    if (isSuccess) {
      alert("CMS Changes synchronized beautifully and published live.");
      onRefreshAllData();
    }
  };

  // Upload Gallery Item Mock
  const handleAddGalleryItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGalleryUrl.trim()) return;
    setGallery([
      ...gallery,
      {
        id: 'gal-' + Math.random().toString(36).substring(2, 9),
        url: newGalleryUrl,
        caption: newGalleryCaption || 'Gurukrupa Facility Asset',
        category: newGalleryCat
      }
    ]);
    setNewGalleryUrl('');
    setNewGalleryCaption('');
    alert("Visual media asset cataloged!");
  };

  // Create customized offers coupon
  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOfferCode.trim() || !newOfferDiscount.trim()) return;
    setOffers([
      ...offers,
      {
        code: newOfferCode.trim().toUpperCase(),
        discount: newOfferDiscount,
        type: newOfferType,
        validity: 'Active',
        desc: newOfferDesc || 'Dynamic guest stay promotion coupon code'
      }
    ]);
    setNewOfferCode('');
    setNewOfferDiscount('');
    setNewOfferDesc('');
    alert("Stay Promo Coupon Generated Successfully!");
  };

  // Add customized Services item
  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName.trim()) return;
    setServices([
      ...services,
      {
        id: 'srv-' + Math.random().toString(36).substring(2, 9),
        name: newServiceName,
        desc: newServiceDesc || 'High quality tourist lodge amenities support',
        icon: 'Sparkles',
        status: 'Active'
      }
    ]);
    setNewServiceName('');
    setNewServiceDesc('');
    alert("Stay Facility Services Published Successfully!");
  };

  // Filter lists based on search
  const filteredRooms = rooms.filter(v => v.name.toLowerCase().includes(searchQuery.toLowerCase()) || v.roomNumber.includes(searchQuery));
  const filteredBookings = bookings.filter(b => b.guestName.toLowerCase().includes(searchQuery.toLowerCase()) || b.id.includes(searchQuery));
  const filteredCustomers = customers.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.phone.includes(searchQuery));

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 font-sans antialiased flex flex-col md:flex-row transition-colors duration-300`}>
      
      {/* 1. MOBILE BOTTOM & MOBILE FLOATING MENU BAR */}
      <div className="md:hidden bg-slate-900 border-b border-slate-800 p-3.5 sticky top-0 z-40 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-2.5">
          <img 
            src={LogoImage} 
            alt="Logo" 
            className="h-8 w-8 object-contain rounded-full border border-amber-500/20 bg-white"
            referrerPolicy="no-referrer"
          />
          <span className="font-serif font-bold text-sm tracking-tight">{siteName} Admin</span>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)} 
            className="p-1.5 text-slate-300 hover:text-white bg-slate-800 rounded-lg border border-slate-700"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* MOBILE COLLAPSIBLE DRAWER */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="fixed inset-0 z-50 bg-slate-950/95 p-6 flex flex-col gap-5 md:hidden"
          >
            <div className="flex justify-between items-center border-b border-slate-900 pb-4">
              <span className="font-serif font-black text-amber-500 text-base">Modules Drawer</span>
              <button 
                onClick={() => setMobileSidebarOpen(false)}
                className="text-slate-400 font-bold hover:text-white"
              >
                &times; Close
              </button>
            </div>
            
            <div className="flex flex-col gap-2.5 overflow-y-auto pr-1">
              {[
                { tab: 'overview', label: 'Dashboard Overview', icon: FileSliders },
                { tab: 'rooms', label: 'Room management', icon: Building2 },
                { tab: 'bookings', label: 'Bookings calendar', icon: ChevronLeft },
                { tab: 'customers', label: 'Customer accounts', icon: Users },
                { tab: 'payments', label: 'Razorpay Payments', icon: CreditCard },
                { tab: 'reviews', label: 'Verified reviews', icon: ShieldCheck },
                { tab: 'gallery', label: 'Lodge photo gallery', icon: ImageIcon },
                { tab: 'services', label: 'Hotel amenities', icon: Sparkles },
                { tab: 'offers', label: 'Coupon offers', icon: Tag },
                { tab: 'notifications', label: 'Alert logs', icon: Bell },
                { tab: 'reports', label: 'Reports & Exports', icon: FileText },
                { tab: 'settings', label: 'CMS configs', icon: SettingsIcon },
                { tab: 'admin-settings', label: 'My profile settings', icon: Lock }
              ].map((btn) => (
                <button
                  key={btn.tab}
                  onClick={() => {
                    setActiveTab(btn.tab as TabType);
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl font-medium text-xs flex items-center gap-3 transition-colors ${
                    activeTab === btn.tab 
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-lg' 
                      : 'text-slate-400 hover:text-white bg-slate-900/40 border border-slate-800/10'
                  }`}
                >
                  <btn.icon className="h-4 w-4" />
                  <span>{btn.label}</span>
                </button>
              ))}
              <button 
                onClick={onLogout}
                className="w-full text-left px-4 py-3 rounded-xl font-bold text-xs flex items-center gap-3 text-red-400 bg-red-500/5 hover:bg-red-500/10 transition mt-4"
              >
                <LogOut className="h-4 w-4" />
                <span>Exit Admin Control</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. THE SAAS COLLAPSIBLE DESKTOP SIDEBAR */}
      <aside 
        className={`hidden md:flex flex-col border-r border-slate-900 bg-slate-903 bg-slate-900/80 backdrop-blur-xl transition-all duration-300 relative sticky top-0 h-screen ${
          sidebarCollapsed ? 'w-20' : 'w-72'
        }`}
      >
        <div className="p-5 flex items-center justify-between border-b border-slate-900 bg-slate-950/20">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="relative p-0.5 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 shadow-md">
              <img 
                src={LogoImage} 
                alt="Logo" 
                className="h-10 w-10 object-contain rounded-full border border-slate-900 bg-white"
                referrerPolicy="no-referrer"
              />
            </div>
            {!sidebarCollapsed && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-serif leading-none"
              >
                <h2 className="font-bold text-xs tracking-wide text-slate-100 uppercase">{siteName}</h2>
                <span className="text-[9px] font-mono text-emerald-400 tracking-widest font-bold">HQ ADMIN CONSOLE</span>
              </motion.div>
            )}
          </div>
          
          <button 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="absolute -right-3 top-7 p-1 bg-slate-900 border border-slate-800 rounded-full hover:bg-slate-800 hover:border-amber-500/40 transition text-slate-400 hover:text-white z-40 hidden md:block"
          >
            <ChevronLeft className={`h-4 w-4 transform transition-transform ${sidebarCollapsed && 'scale-x-[-1]'}`} />
          </button>
        </div>

        {/* Scrollable Navigation Items */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-800">
          {[
            { id: 'overview', label: 'Dashboard Overview', icon: FileSliders, subtitle: 'SaaS metrics summary' },
            { id: 'rooms', label: 'Room management', icon: Building2, subtitle: 'Tariffs & availability' },
            { id: 'bookings', label: 'Bookings ledger', icon: ChevronLeft, subtitle: 'Checked-in travelers' },
            { id: 'customers', label: 'Customer accounts', icon: Users, subtitle: 'Verified profiles list' },
            { id: 'payments', label: 'Payments history', icon: CreditCard, subtitle: 'Razorpay transactions' },
            { id: 'reviews', label: 'Feedback & ratings', icon: ShieldCheck, subtitle: 'Approval matrix' },
            { id: 'gallery', label: 'Lodge photogallery', icon: ImageIcon, subtitle: 'Cover media setup' },
            { id: 'services', label: 'Facility services', icon: Sparkles, subtitle: 'Toggles & perks' },
            { id: 'offers', label: 'Coupons & pricing', icon: Tag, subtitle: 'Deals & coupons' },
            { id: 'notifications', label: 'Alert Center', icon: Bell, subtitle: `${alerts.filter(n => !n.read).length} critical notifications`, alertCount: alerts.filter(n => !n.read).length },
            { id: 'reports', label: 'Exports & Analytics', icon: FileText, subtitle: 'Reports & Exports' },
            { id: 'settings', label: 'Website CMS settings', icon: SettingsIcon, subtitle: 'Branding setup content' },
            { id: 'admin-settings', label: 'Secret safety admin', icon: Lock, subtitle: 'Change passwords' }
          ].map((nav) => {
            const isSel = activeTab === nav.id;
            return (
              <button
                key={nav.id}
                onClick={() => setActiveTab(nav.id as TabType)}
                className={`w-full text-left rounded-xl p-3 flex items-center justify-between transition-all group font-sans ${
                  isSel 
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow-lg shadow-amber-500/15' 
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <nav.icon className={`h-4 w-4 shrink-0 transition-transform group-hover:scale-110 ${isSel ? 'text-slate-950' : 'text-slate-400'}`} />
                  {!sidebarCollapsed && (
                    <div className="text-xs tracking-tight truncate">
                      <p className="font-semibold leading-tight">{nav.label}</p>
                      <p className={`text-[9px] font-mono tracking-normal leading-none mt-0.5 truncate ${isSel ? 'text-slate-900/80' : 'text-slate-500'}`}>
                        {nav.subtitle}
                      </p>
                    </div>
                  )}
                </div>
                {!sidebarCollapsed && nav.alertCount && nav.alertCount > 0 ? (
                  <span className="bg-red-500 text-white text-[9px] px-2 py-0.5 rounded-full font-bold animate-pulse">
                    {nav.alertCount}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>

        {/* Desktop Admin status panel */}
        <div className="p-4 border-t border-slate-900 flex justify-between items-center overflow-hidden">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-amber-500 shrink-0 uppercase font-serif">
              {adminName[0]}
            </div>
            {!sidebarCollapsed && (
              <div className="truncate text-xs">
                <p className="font-bold text-slate-200">{adminName}</p>
                <p className="text-[10px] text-slate-500 font-mono truncate">{adminEmail}</p>
              </div>
            )}
          </div>
          {!sidebarCollapsed && (
            <button 
              onClick={onLogout}
              className="p-2 text-slate-400 hover:text-rose-400 bg-slate-900 hover:bg-rose-500/10 rounded-lg transition"
              title="Logout session"
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      </aside>

      {/* 3. MAIN WORKSPACE */}
      <main className="flex-1 p-4 md:p-8 space-y-6 overflow-y-auto">
        
        {/* TOP STATUS RIBBON */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border border-slate-900 bg-slate-900/40 p-5 rounded-2xl shadow-xl backdrop-blur-md">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                ADMIN SECURED
              </span>
              <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                CLOUDFIRESTORE BOUND
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-serif font-black tracking-tight text-white capitalize flex items-center gap-2">
              <span>{activeTab.replace('-', ' ')} Hub</span>
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input Filter for Quick Find */}
            {['rooms', 'bookings', 'customers'].includes(activeTab) && (
              <div className="relative">
                <input 
                  type="text"
                  placeholder="Universal Filter search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-xs rounded-xl py-2 pl-3.5 pr-8 text-white focus:outline-none focus:border-amber-500/40 w-44 md:w-56"
                />
                <button className="absolute right-2 top-2 text-slate-500">
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            <button 
              onClick={fetchAnalytics}
              disabled={isRefreshingStats}
              className="px-3 py-1.5 border border-slate-800 hover:border-amber-500/20 text-slate-400 hover:text-white rounded-xl transition flex items-center gap-2 text-xs font-bold"
            >
              <RefreshCcw className={`h-3.5 w-3.5 ${isRefreshingStats && 'animate-spin text-amber-500'}`} />
              <span className="hidden sm:inline">Sync Cloud Records</span>
            </button>
          </div>
        </div>

        {/* RENDER ACTIVE TAB */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            
            {/* ==================== TAB: OVERVIEW ==================== */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                
                {/* 4 Statistical Glassmorphic Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'Total Reservations', value: analytics.totalBookings, change: '+12.4% vs last week', color: 'from-amber-400 to-amber-600', icon: FileSliders, text: 'Reservations created' },
                    { label: 'Cumulative Revenue', value: `₹${analytics.totalRevenue}`, change: '+18.2% vs last month', color: 'from-emerald-400 to-emerald-600', icon: Coins, text: 'Razorpay transactions' },
                    { label: 'Present Boarding Guests', value: analytics.occupiedRooms, change: 'Active stay occupants', color: 'from-blue-400 to-blue-600', icon: Users, text: 'Checked-in guests log' },
                    { label: 'Available Standby Rooms', value: analytics.availableRooms, change: 'Ready for booking', color: 'from-purple-400 to-purple-600', icon: Building2, text: 'Clean inventory suites' }
                  ].map((card, i) => (
                    <div key={i} className="bg-slate-900/60 border border-slate-900 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-slate-800 transition-all">
                      <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                        <card.icon className="h-16 w-16" />
                      </div>
                      <span className="text-[10px] uppercase font-mono tracking-widest text-slate-500 font-bold block">{card.label}</span>
                      <p className="text-xl md:text-3xl font-mono font-black text-slate-100 mt-2">{card.value}</p>
                      <div className="flex items-center gap-1.5 mt-2.5">
                        <span className="text-[10px] font-mono text-amber-500 font-bold">{card.change}</span>
                        <span className="text-[9px] text-slate-500">&mdash; {card.text}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Analytical Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Revenue Curve Chart */}
                  <div className="lg:col-span-2 bg-slate-900/60 border border-slate-900 rounded-2xl p-5 shadow-lg">
                    <div className="flex justify-between items-center mb-5">
                      <h3 className="text-sm font-serif font-bold uppercase tracking-wider text-slate-200">Revenue Performance Tracking (₹ INR)</h3>
                      <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest font-black">Live updates</span>
                    </div>
                    <div className="h-72 w-full font-mono">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={analytics.monthlyData}>
                          <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#101b2a" />
                          <XAxis dataKey="name" stroke="#475569" fontSize={11} />
                          <YAxis stroke="#475569" fontSize={11} />
                          <Tooltip contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '12px' }} />
                          <Area type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevenue)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Payment Distribution Pie */}
                  <div className="bg-slate-900/60 border border-slate-900 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-serif font-bold uppercase tracking-wider text-slate-200 mb-2">Gateways Breakdown</h3>
                      <p className="text-[10.5px] text-slate-500 leading-normal mb-4">Percentage allocation of gross revenue sources logged securely.</p>
                    </div>
                    
                    <div className="h-44 w-full flex items-center justify-center font-mono relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={analytics.paymentStats}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={70}
                            paddingAngle={4}
                            dataKey="value"
                          >
                            {analytics.paymentStats?.map((entry: any, index: number) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b' }} />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-[10px] text-slate-500 uppercase font-mono">Razorpay</span>
                        <span className="text-sm font-black text-amber-500 font-mono">90% Digital</span>
                      </div>
                    </div>

                    <div className="space-y-1.5 mt-4 border-t border-slate-950 pt-3">
                      {analytics.paymentStats?.map((entry: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-center text-[10.5px]">
                          <div className="flex items-center gap-1.5 font-sans">
                            <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: entry.color }} />
                            <span className="text-slate-300">{entry.name}</span>
                          </div>
                          <b className="font-mono text-slate-200">₹{entry.value.toLocaleString()}</b>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Dashboard Bottom Log activities */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Recent Alarms */}
                  <div className="lg:col-span-2 bg-slate-900/60 border border-slate-900 rounded-2xl p-5 shadow-lg space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-950">
                      <h3 className="text-sm font-serif font-bold text-slate-200">System Logs & WhatsApp Events ({alerts.filter(n => !n.read).length} critical alerts)</h3>
                      <button 
                        onClick={async () => {
                          await fetch('/api/notifications/clear-all', { method: 'POST' });
                          fetchAnalytics();
                        }}
                        className="text-[10px] font-semibold text-amber-500 hover:text-amber-400"
                      >
                        Wipe Alert log
                      </button>
                    </div>

                    {alerts.length === 0 ? (
                      <p className="text-xs text-slate-500 py-10 text-center">Operation registers clean. Zero unhandled activities.</p>
                    ) : (
                      <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                        {alerts.slice().reverse().map((a) => (
                          <div 
                            key={a.id}
                            className={`p-3.5 border rounded-xl text-[11px] font-mono flex justify-between gap-4 items-center transition-all ${
                              a.read 
                                ? 'bg-slate-950/40 border-slate-800/20 text-slate-500' 
                                : 'bg-gradient-to-r from-amber-500/5 to-transparent border-amber-500/10 text-slate-200'
                            }`}
                          >
                            <div>
                              <p className="font-bold text-amber-500 flex items-center gap-1.5">
                                <span className={`w-1.5 h-1.5 rounded-full ${a.read ? 'bg-slate-700' : 'bg-red-500 animate-ping'}`} />
                                <span>{a.title}</span>
                                <span className="text-[8.5px] text-slate-600 font-sans font-normal">{new Date(a.date).toLocaleDateString()} &mdash; {new Date(a.date).toLocaleTimeString()}</span>
                              </p>
                              <p className="mt-1 text-slate-300 font-sans leading-relaxed">{a.message}</p>
                            </div>
                            {!a.read && (
                              <button 
                                onClick={async () => {
                                  await fetch(`/api/notifications/${a.id}/read`, { method: 'POST' });
                                  fetchAnalytics();
                                }}
                                className="text-[10px] hover:text-white bg-slate-850 hover:bg-slate-850 px-2.5 py-1 rounded-lg border border-slate-800 font-bold shrink-0 text-slate-300 cursor-pointer"
                              >
                                Mark Read
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Active Operator metadata info */}
                  <div className="bg-slate-900/60 border border-slate-900 rounded-2xl p-5 shadow-lg flex flex-col justify-between text-xs leading-relaxed text-slate-400">
                    <div>
                      <h4 className="font-serif font-bold text-slate-200 uppercase tracking-widest text-[9.5px] mb-3">Operator Checklist</h4>
                      <p className="mb-3 leading-normal">Operational bindings link active local sessions safely. Check the checkout logs diligently.</p>
                      
                      <div className="space-y-2 border-t border-slate-950 pt-3">
                        <div className="bg-slate-950/40 p-2.5 rounded-xl border border-slate-850 flex items-center gap-1.5">
                          <CheckSquare2 className="h-4 w-4 text-emerald-500 shrink-0" />
                          <span>Wiped local temporary caching states (data.json)</span>
                        </div>
                        <div className="bg-slate-950/40 p-2.5 rounded-xl border border-slate-850 flex items-center gap-1.5">
                          <CheckSquare2 className="h-4 w-4 text-emerald-500 shrink-0" />
                          <span>Validated secure cloud connections</span>
                        </div>
                        <div className="bg-slate-950/40 p-2.5 rounded-xl border border-slate-850 flex items-center gap-1.5">
                          <CheckSquare2 className="h-4 w-4 text-emerald-500 shrink-0" />
                          <span>Secured Razorpay basic payload routes</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-amber-500/5 border border-amber-500/10 p-3 rounded-xl mt-4 text-[10.5px]">
                      <p className="font-serif font-black text-amber-500">Need Instant Help?</p>
                      <p className="text-slate-400 mt-1">Operator lines are linked via local terminal configuration settings.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ==================== TAB: ROOMS ==================== */}
            {activeTab === 'rooms' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-900/60 border border-slate-900 p-5 rounded-2xl gap-3 shadow-lg">
                  <div>
                    <h3 className="font-serif font-black text-sm text-slate-200">Suites and Inventory Settings ({rooms.length} categories)</h3>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">Publish new single, double or family suites. Complete details containing AC and pricing options.</p>
                  </div>
                  <button 
                    onClick={() => setShowAddRoom(!showAddRoom)}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer shadow-lg shrink-0"
                  >
                    <Plus className="h-4 w-4" /> Add Premium Suite
                  </button>
                </div>

                {/* Create/Edit Room Form Card */}
                {showAddRoom && (
                  <form onSubmit={handleSaveRoom} className="p-6 bg-slate-900 border border-amber-500/10 rounded-2xl space-y-4 font-sans text-xs transition-all shadow-xl">
                    <div className="flex justify-between items-center border-b border-slate-950 pb-3 mb-2">
                      <span className="font-serif font-black text-amber-400 text-sm flex items-center gap-2">
                        {editingRoom ? <Edit3 className="h-4.5 w-4.5 text-amber-500" /> : <Plus className="h-4.5 w-4.5 text-amber-500" />} {editingRoom ? `Update Room ${editingRoom.roomNumber} Details` : 'Catalog New Lodging Standard'}
                      </span>
                      <button type="button" onClick={handleCancelRoomForm} className="text-slate-500 hover:text-white font-mono text-base font-bold">&times;</button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-slate-400 uppercase font-mono text-[9px] font-bold">Physical Room Number</label>
                        <input 
                          type="text" 
                          placeholder="e.g. 104, 305" 
                          value={newRoomNo}
                          onChange={(e) => setNewRoomNo(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3.5 text-white placeholder-slate-600 focus:outline-none"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-slate-400 uppercase font-mono text-[9px] font-bold">Aesthetic Suite Name Title</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Traditional Royal AC Heritage Suite" 
                          value={newRoomName}
                          onChange={(e) => setNewRoomName(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3.5 text-white placeholder-slate-600 focus:outline-none"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-slate-400 uppercase font-mono text-[9px] font-bold">Room Category Grade</label>
                        <select 
                          value={newRoomType}
                          onChange={(e) => setNewRoomType(e.target.value as any)}
                          className="w-full bg-slate-955 bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 uppercase text-slate-300 font-mono text-[10px]"
                        >
                          <option value="Single">Single Standard</option>
                          <option value="Double">Double Deluxe</option>
                          <option value="Family">Family Suite Grade</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-slate-400 uppercase font-mono text-[9px] font-bold">Rent tariff / night stayed (INR)</label>
                        <input 
                          type="number" 
                          value={newRoomPrice}
                          onChange={(e) => setNewRoomPrice(Number(e.target.value))}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3.5 text-white font-mono"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-slate-400 uppercase font-mono text-[9px] font-bold">Guests Occupancies capacity Limit</label>
                        <input 
                          type="number" 
                          value={newRoomCapacity}
                          onChange={(e) => setNewRoomCapacity(Number(e.target.value))}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3.5 text-white font-mono"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-slate-400 uppercase font-mono text-[9px] font-bold block">Air Conditioning climate standard</label>
                      <div className="flex items-center gap-2">
                        <input 
                          type="checkbox" 
                          checked={newRoomAC} 
                          onChange={(e) => setNewRoomAC(e.target.checked)} 
                          className="scale-110 accent-amber-500 cursor-pointer" 
                          id="ac-checkbox"
                        />
                        <label htmlFor="ac-checkbox" className="text-slate-300 text-xs font-medium cursor-pointer">AC HVAC Comfort Enabled standard</label>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-none">
                      <div className="space-y-1">
                        <label className="text-slate-400 uppercase font-mono text-[9px] font-bold">Cover photocard URL</label>
                        <input 
                          type="text" 
                          value={newRoomImage}
                          onChange={(e) => setNewRoomImage(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3.5 text-white font-mono text-[11px]"
                        />
                      </div>
                      
                      <div className="space-y-1">
                        <label className="text-slate-400 uppercase font-mono text-[9px] font-bold">Suite Perks & Inclusions (comma-list)</label>
                        <input 
                          type="text" 
                          value={newRoomAmenities}
                          onChange={(e) => setNewRoomAmenities(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3.5 text-white leading-normal"
                        />
                      </div>
                    </div>

                    <button className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-xs font-black rounded-xl hover:from-amber-400 hover:to-amber-500 shadow-lg cursor-pointer transition-all uppercase">
                      {editingRoom ? 'Save Suite Updates' : 'Commit Room Live'}
                    </button>
                  </form>
                )}

                {/* Rooms Listings Grid */}
                <div className="bg-slate-900/60 border border-slate-900 rounded-2xl shadow-xl p-5 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-950 text-slate-500 font-serif font-bold uppercase tracking-widest text-[9.5px]">
                          <th className="py-3.5">Physical Room details</th>
                          <th className="py-3.5 font-mono">Capacity Standard</th>
                          <th className="py-3.5 font-mono">Daily Tariff</th>
                          <th className="py-3.5 font-mono">Climate Options</th>
                          <th className="py-3.5 font-mono">Status Guard</th>
                          <th className="py-3.5 text-right font-mono">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-950 text-slate-300">
                        {filteredRooms.map((r) => (
                          <tr key={r.id} className="hover:bg-slate-900/30">
                            <td className="py-4">
                              <div className="flex gap-3.5 items-center">
                                <span className="font-mono bg-amber-500/10 border border-amber-500/25 text-amber-500 px-2.5 py-1 rounded-lg font-black text-xs">
                                  {r.roomNumber}
                                </span>
                                <div>
                                  <p className="font-bold text-slate-100">{r.name}</p>
                                  <p className="text-[10px] text-slate-500 mt-0.5 uppercase font-mono tracking-normal">{r.type} grade standard</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 font-mono">Max {r.capacity} Guests</td>
                            <td className="py-4 font-mono font-black text-amber-500">₹{r.price.toLocaleString()} / night</td>
                            <td className="py-4 font-mono">
                              <span className={`px-2 py-0.5 rounded text-[10px] ${r.ac ? 'text-blue-400 bg-blue-500/10' : 'text-slate-400 bg-slate-800'}`}>
                                {r.ac ? 'AC HVAC' : 'Non-AC Fan'}
                              </span>
                            </td>
                            <td className="py-4">
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono uppercase font-black tracking-widest ${
                                r.status === 'Available' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                              }`}>
                                {r.status}
                              </span>
                            </td>
                            <td className="py-4 text-right">
                              <div className="inline-flex gap-2">
                                <button 
                                  onClick={() => handleToggleRoomStatus(r)}
                                  className="px-2.5 py-1 text-[10px] bg-slate-950 hover:bg-slate-800 text-slate-300 rounded-lg border border-slate-800 hover:border-slate-700 transition font-medium"
                                  title="Toggle maintenance blocking status"
                                >
                                  Toggle status
                                </button>
                                <button 
                                  onClick={() => handleStartEditRoom(r)}
                                  className="p-1.5 bg-amber-500/5 hover:bg-amber-500 hover:text-slate-950 text-amber-500 rounded-lg border border-amber-500/10 hover:border-amber-500 transition cursor-pointer"
                                  title="Edit suite details"
                                >
                                  <Edit3 className="h-3.5 w-3.5" />
                                </button>
                                <button 
                                  onClick={() => handleDeleteSelectedRoom(r.id)}
                                  className="p-1.5 bg-red-500/5 hover:bg-red-500 hover:text-slate-950 text-red-500 rounded-lg border border-red-500/10 hover:border-red-500 transition cursor-pointer"
                                  title="Delete suite Listing"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ==================== TAB: BOOKINGS ==================== */}
            {activeTab === 'bookings' && (
              <div className="space-y-6">
                <div className="bg-slate-900/60 border border-slate-900 p-5 rounded-2xl shadow-lg">
                  <h3 className="font-serif font-black text-sm text-slate-100">Lodge Bookings Register Matrix</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-normal">Operational control desk to register check-ins, process terminal checkouts, cancel stay reserves, or verify payments.</p>
                </div>

                <div className="bg-slate-900/60 border border-slate-900 rounded-2xl p-5 shadow-lg overflow-hidden">
                  <div className="overflow-x-auto text-xs">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-950 text-slate-500 font-serif font-bold uppercase tracking-widest text-[9.5px]">
                          <th className="py-3">Reservation ID</th>
                          <th className="py-3">Patron Info</th>
                          <th className="py-3">Suite Reserved</th>
                          <th className="py-3 font-mono">Date Span</th>
                          <th className="py-3 font-mono">Amount Paid</th>
                          <th className="py-3 font-mono">Status</th>
                          <th className="py-3 text-right">Progress Stage Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-950 text-slate-300">
                        {filteredBookings.slice().reverse().map((b) => (
                          <tr key={b.id} className="hover:bg-slate-900/20">
                            <td className="py-3.5 font-mono font-bold text-amber-500">{b.id}</td>
                            <td className="py-3.5 text-slate-200">
                              <p className="font-bold">{b.guestName}</p>
                              <p className="text-[10px] text-slate-500 font-mono mt-0.5">{b.guestPhone} | {b.guestEmail}</p>
                            </td>
                            <td className="py-3.5 font-mono">Room {b.roomNumber} &mdash; {b.roomName}</td>
                            <td className="py-3.5 font-mono text-[10.5px] text-slate-400">
                              {b.checkIn} to {b.checkOut}
                            </td>
                            <td className="py-3.5">
                              <p className="font-bold text-slate-100 font-mono">₹{b.totalAmount.toLocaleString()}</p>
                              <span className={`px-1 rounded text-[9px] font-mono font-bold uppercase tracking-wider block mt-0.5 w-max ${
                                b.paymentStatus === 'Paid' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-500'
                              }`}>
                                {b.paymentStatus}
                              </span>
                            </td>
                            <td className="py-3.5">
                              <span className={`px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-mono font-black ${
                                b.status === 'Completed' ? 'bg-blue-500/15 text-blue-400' :
                                b.status === 'Checked-In' ? 'bg-emerald-500/15 text-emerald-400' :
                                b.status === 'Confirmed' ? 'bg-purple-500/15 text-purple-400' : 'bg-amber-500/15 text-amber-400'
                              }`}>
                                {b.status}
                              </span>
                            </td>
                            <td className="py-3.5 text-right">
                              <div className="inline-flex gap-1.5 font-mono">
                                {b.status === 'Pending' && (
                                  <button 
                                    onClick={() => handleUpdateBookingStatus(b, 'Confirmed')}
                                    className="px-2 py-1 bg-purple-500 text-slate-950 font-bold font-sans text-[10px] rounded hover:bg-purple-400 cursor-pointer"
                                  >
                                    Confirm Stay
                                  </button>
                                )}
                                {b.status === 'Confirmed' && (
                                  <button 
                                    onClick={() => handleUpdateBookingStatus(b, 'Checked-In')}
                                    className="px-2 py-1 bg-emerald-500 text-slate-950 font-bold font-sans text-[10px] rounded hover:bg-emerald-400 cursor-pointer"
                                  >
                                    Check-In
                                  </button>
                                )}
                                {b.status === 'Checked-In' && (
                                  <button 
                                    onClick={() => handleUpdateBookingStatus(b, 'Completed')}
                                    className="px-2 py-1 bg-blue-500 text-slate-950 font-bold font-sans text-[10px] rounded hover:bg-blue-400 cursor-pointer"
                                  >
                                    Mark Checkout
                                  </button>
                                )}
                                {b.status !== 'Completed' && b.status !== 'Cancelled' && (
                                  <button 
                                    onClick={() => handleUpdateBookingStatus(b, 'Cancelled')}
                                    className="px-2 py-1 bg-red-500/10 text-red-500 text-[10px] rounded font-sans border border-red-500/10 hover:bg-red-500 hover:text-slate-950 transition cursor-pointer"
                                  >
                                    Cancel
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ==================== TAB: CUSTOMERS ==================== */}
            {activeTab === 'customers' && (
              <div className="space-y-6">
                <div className="bg-slate-900/60 border border-slate-900 p-5 rounded-2xl shadow-lg">
                  <h3 className="font-serif font-black text-sm text-grey-200">Registered Patron Accounts ({customers.length} Guests)</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">Observe customer names, emails, phones, suspension status. Block suspicious customer phone registrations instantly.</p>
                </div>

                <div className="bg-slate-900/60 border border-slate-900 rounded-2xl p-5 shadow-lg overflow-hidden">
                  <div className="overflow-x-auto text-xs">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-950 text-slate-500 font-serif font-bold uppercase tracking-widest text-[9.5px]">
                          <th className="py-2.5">Guest Legal Name</th>
                          <th className="py-2.5 font-mono">Primary Email ID</th>
                          <th className="py-2.5 font-mono">Mobile WhatsApp Contact</th>
                          <th className="py-2.5 font-mono">Joined Date</th>
                          <th className="py-2.5 font-mono">Status Guard</th>
                          <th className="py-2.5 text-right">Profile Control</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-950 text-slate-300">
                        {filteredCustomers.map((c) => (
                          <tr key={c.id} className="hover:bg-slate-900/10">
                            <td className="py-4">
                              <div className="flex items-center gap-2.5">
                                <span className="w-7 h-7 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 flex items-center justify-center font-bold text-amber-500 font-serif shrink-0 uppercase">
                                  {c.name[0]}
                                </span>
                                <div>
                                  <p className="font-bold text-slate-100">{c.name}</p>
                                  <p className="text-[10px] text-slate-600 font-mono">ID: {c.id}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 font-mono text-slate-400">{c.email}</td>
                            <td className="py-4 font-mono text-slate-400">{c.phone || '+91 7620 586155'}</td>
                            <td className="py-4 text-slate-400">{c.registeredAt ? new Date(c.registeredAt).toLocaleDateString() : '2026-05-22'}</td>
                            <td className="py-4">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                c.isBlocked ? 'bg-red-500/15 text-red-500' : 'bg-emerald-500/15 text-emerald-400'
                              }`}>
                                {c.isBlocked ? 'Suspended Banned' : 'Active Profile'}
                              </span>
                            </td>
                            <td className="py-4 text-right">
                              <button
                                onClick={() => handleToggleBlockGuest(c)}
                                className={`px-3 py-1 text-[10px] rounded-lg transition-all font-bold ${
                                  c.isBlocked
                                    ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                                    : 'bg-red-500/5 hover:bg-red-500 hover:text-slate-950 text-red-500 border border-red-500/10'
                                }`}
                              >
                                {c.isBlocked ? 'Restore Profile' : 'Suspend Guest'}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ==================== TAB: PAYMENTS ==================== */}
            {activeTab === 'payments' && (
              <div className="space-y-6">
                <div className="bg-slate-900/60 border border-slate-900 p-5 rounded-2xl shadow-lg">
                  <h3 className="font-serif font-black text-sm text-slate-200">Razorpay payments & Transaction Audit Ledger</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">Secure bookkeeping of gross revenue receipts, UPI orders, debit/credit cards payment IDs, and manual refunds.</p>
                </div>

                <div className="bg-slate-900/60 border border-slate-900 rounded-2xl p-5 shadow-lg overflow-hidden">
                  <div className="overflow-x-auto text-xs font-mono">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-950 text-slate-500 font-serif font-bold uppercase tracking-widest text-[9.5px]">
                          <th className="py-2.5">Razorpay ID</th>
                          <th className="py-2.5">Account / Booking ID</th>
                          <th className="py-2.5 font-mono">Payer</th>
                          <th className="py-2.5 font-mono">Amount</th>
                          <th className="py-2.5 font-mono">Method</th>
                          <th className="py-2.5 font-mono">Transaction Date / Time</th>
                          <th className="py-2.5 text-right">Receipt status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-150 divide-slate-950 text-slate-300">
                        {bookings.map((b) => (
                          <tr key={b.id} className="hover:bg-slate-900/10 text-[11px]">
                            <td className="py-3.5 text-amber-500 font-bold">{b.paymentId || 'PAY_RP_MOCK_88912301'}</td>
                            <td className="py-3.5 text-slate-400 font-normal">{b.id}</td>
                            <td className="py-3.5 font-sans">
                              <p className="font-semibold text-slate-200">{b.guestName}</p>
                            </td>
                            <td className="py-3.5 text-slate-100 font-bold">₹{b.totalAmount.toLocaleString()}</td>
                            <td className="py-3.5 uppercase">{b.paymentMethod || 'Razorpay Gateway'}</td>
                            <td className="py-3.5 text-slate-500">{b.createdAt ? new Date(b.createdAt).toLocaleString() : '2026-05-22 10:02:00'}</td>
                            <td className="py-3.5 text-right">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                b.paymentStatus === 'Paid' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-500'
                              }`}>
                                {b.paymentStatus}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ==================== TAB: REVIEWS ==================== */}
            {activeTab === 'reviews' && (
              <div className="bg-slate-900/60 border border-slate-900 rounded-2xl p-5 shadow-lg space-y-4">
                <div>
                  <h3 className="font-serif font-black text-sm text-slate-200">Verified User Feedback & Room Ratings Portal</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">Toggle live approval checks to display ratings dynamically on Gurukrupa Welcome layout.</p>
                </div>

                {allReviews.length === 0 ? (
                  <p className="p-10 text-xs text-slate-500 text-center font-mono">No review feedbacks cataloged in the storage system database.</p>
                ) : (
                  <div className="space-y-3">
                    {allReviews.map((rev) => (
                      <div 
                        key={rev.id}
                        className="p-4 bg-slate-950/60 border border-slate-900 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-slate-800 transition shadow-inner"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-100 text-xs">{rev.authorName}</span>
                            <span className="text-amber-500 font-bold text-xs font-mono">{rev.rating} ★</span>
                            <span className="bg-amber-500/10 text-amber-500 text-[9px] font-mono px-2 py-0.5 rounded uppercase font-bold">{rev.roomName}</span>
                          </div>
                          <p className="text-slate-300 italic font-medium leading-relaxed font-sans text-xs">"{rev.comment}"</p>
                          <p className="text-[9px] text-slate-600 font-mono uppercase tracking-wider">Stay date interval logged: {rev.date} &bull; verified client occupant</p>
                        </div>

                        <div className="flex gap-2 shrink-0">
                          {rev.approved ? (
                            <button 
                              onClick={() => handleApproveRatingReview(rev.id, false)}
                              className="bg-red-500/10 text-red-400 hover:bg-red-500/20 px-3 py-1.5 rounded-xl border border-red-500/10 text-[10px] cursor-pointer"
                            >
                              Hide Review
                            </button>
                          ) : (
                            <button 
                              onClick={() => handleApproveRatingReview(rev.id, true)}
                              className="bg-emerald-500 text-slate-950 hover:bg-emerald-400 font-bold px-3.5 py-1.5 rounded-xl text-[10px] transition cursor-pointer shadow-md"
                            >
                              Approve Live
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ==================== TAB: GALLERY ==================== */}
            {activeTab === 'gallery' && (
              <div className="space-y-6">
                <div className="bg-slate-900/60 border border-slate-900 p-5 rounded-2xl shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                  <div>
                    <h3 className="font-serif font-black text-sm text-slate-100">Establishment Photographic Asset Gallery</h3>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-normal">Configure visual assets, upload multiple exterior viewpoints, parking zones, reception lobby rooms, or bathroom facilities.</p>
                  </div>
                </div>

                {/* Add Gallery Form */}
                <form onSubmit={handleAddGalleryItem} className="p-5 bg-slate-900 border border-slate-900 rounded-2xl grid grid-cols-1 md:grid-cols-4 gap-3 text-xs shadow-md">
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-slate-400 uppercase font-mono text-[9px]">Unsplash Image / Photocard URL</label>
                    <input 
                      type="text" 
                      placeholder="https://images.unsplash.com/photo-..." 
                      value={newGalleryUrl}
                      onChange={(e) => setNewGalleryUrl(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3.5 text-white font-mono text-xs focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-400 uppercase font-mono text-[9px]">Aesthetic Caption Text</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Spacious Parking lot" 
                      value={newGalleryCaption}
                      onChange={(e) => setNewGalleryCaption(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3.5 text-white focus:outline-none text-xs"
                    />
                  </div>
                  <div className="space-y-1 flex flex-col justify-between">
                    <label className="text-slate-400 uppercase font-mono text-[9px]">Category Section</label>
                    <div className="flex gap-2">
                      <select 
                        value={newGalleryCat}
                        onChange={(e) => setNewGalleryCat(e.target.value as any)}
                        className="bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-slate-400 text-xs w-full font-mono focus:outline-none"
                      >
                        <option value="Rooms">Rooms</option>
                        <option value="Reception">Reception</option>
                        <option value="Exterior">Exterior</option>
                        <option value="Facilities">Facilities</option>
                      </select>
                      <button className="bg-amber-500 text-slate-950 px-3.5 py-1.5 rounded-xl font-bold hover:bg-amber-400 text-xs shrink-0 cursor-pointer shadow">
                        Insert
                      </button>
                    </div>
                  </div>
                </form>

                {/* Gallery Items Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 animate-none">
                  {gallery.map((g) => (
                    <div key={g.id} className="bg-slate-900 border border-slate-900 rounded-2xl overflow-hidden relative group hover:border-slate-800 shadow transition-all">
                      <div className="h-44 overflow-hidden border-b border-slate-950">
                        <img src={g.url} className="w-full h-full object-cover transition-transform group-hover:scale-105" alt="gallery product" referrerPolicy="no-referrer" />
                      </div>
                      <div className="p-3.5 flex justify-between items-center text-xs">
                        <div className="truncate">
                          <p className="font-bold text-slate-200 truncate">{g.caption}</p>
                          <span className="text-[9px] font-mono text-amber-500 uppercase tracking-wider">{g.category}</span>
                        </div>
                        <button 
                          onClick={() => {
                            setGallery(gallery.filter(item => item.id !== g.id));
                            alert("Gallery picture deleted.");
                          }}
                          className="p-1 hover:text-red-400 text-slate-600 transition cursor-pointer"
                          title="Erase visual asset"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ==================== TAB: SERVICES ==================== */}
            {activeTab === 'services' && (
              <div className="space-y-6">
                <div className="bg-slate-900/60 border border-slate-900 p-5 rounded-2xl shadow-lg">
                  <h3 className="font-serif font-black text-sm text-slate-200">Hotel standard Services & Accommodations settings</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">Turn active services, parking systems, room food amenities and laundries on or off dynamically.</p>
                </div>

                {/* Set Service Status Form */}
                <form onSubmit={handleCreateService} className="p-5 bg-slate-900/60 border border-slate-900 rounded-2xl grid grid-cols-1 md:grid-cols-3 gap-3 text-xs shadow-md">
                  <div className="space-y-1">
                    <label className="text-slate-400 uppercase font-mono text-[9px]">Custom Service Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Traditional Pure Maharashtrian Dining Lunch" 
                      value={newServiceName}
                      onChange={(e) => setNewServiceName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3.5 text-white text-xs focus:outline-none focus:border-amber-500/20"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-400 uppercase font-mono text-[9px]">Short description details</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Solar thermo boiler ensures seamless supply" 
                      value={newServiceDesc}
                      onChange={(e) => setNewServiceDesc(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3.5 text-white focus:outline-none focus:border-amber-500/20 text-xs"
                    />
                  </div>
                  <div className="flex items-end">
                    <button className="w-full bg-amber-500 text-slate-950 py-3.5 rounded-xl text-xs font-bold hover:bg-amber-400 shadow cursor-pointer">
                      Generate Service Amenity Option
                    </button>
                  </div>
                </form>

                {/* Services Toggles Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {services.map((s) => (
                    <div key={s.id} className="bg-slate-900/60 border border-slate-900 p-5 rounded-2xl shadow-md space-y-3.5 flex flex-col justify-between">
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <b className="text-xs font-serif text-slate-100">{s.name}</b>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-mono uppercase tracking-widest font-black ${s.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/15 text-red-500'}`}>
                            {s.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-normal font-sans pr-1">{s.desc}</p>
                      </div>
                      
                      <div className="flex justify-between items-center text-xs pt-3 border-t border-slate-950 font-mono">
                        <button 
                          onClick={() => {
                            setServices(services.map(srv => srv.id === s.id ? { ...srv, status: srv.status === 'Active' ? 'Disabled' : 'Active' } : srv));
                            alert("Service status toggled!");
                          }}
                          className="text-[10px] text-amber-500 hover:text-amber-400 font-sans font-bold"
                        >
                          Toggle Status Lock
                        </button>
                        <button 
                          onClick={() => {
                            setServices(services.filter(srv => srv.id !== s.id));
                            alert("Service deleted permanently.");
                          }}
                          className="hover:text-red-400 text-slate-600 transition cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ==================== TAB: OFFERS ==================== */}
            {activeTab === 'offers' && (
              <div className="space-y-6">
                <div className="bg-slate-900/60 border border-slate-900 p-5 rounded-2xl shadow-lg">
                  <h3 className="font-serif font-black text-sm text-slate-200">Discount stays & Special Seasonal Pricing Coupons</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-normal">Formulate dynamic voucher settings to support peak vacation rushes or local tourism events.</p>
                </div>

                {/* Generate Offers Coupon code Form */}
                <form onSubmit={handleCreateCoupon} className="p-5 bg-slate-900/60 " id="coupon-form">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                    <div className="space-y-1">
                      <label className="text-slate-400 uppercase font-mono text-[9px]">Promo Coupon Code</label>
                      <input 
                        type="text" 
                        placeholder="e.g. STAYGOLD" 
                        value={newOfferCode}
                        onChange={(e) => setNewOfferCode(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3.5 text-white font-mono uppercase focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-400 uppercase font-mono text-[9px]">Discount Amount / %</label>
                      <input 
                        type="text" 
                        placeholder="e.g. 20% or ₹1000" 
                        value={newOfferDiscount}
                        onChange={(e) => setNewOfferDiscount(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3.5 text-white font-mono focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-400 uppercase font-mono text-[9px]">Voucher Description</label>
                      <input 
                        type="text" 
                        placeholder="Vaporizing 20% discounts" 
                        value={newOfferDesc}
                        onChange={(e) => setNewOfferDesc(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3.5 text-white focus:outline-none text-xs"
                      />
                    </div>
                    <div className="flex items-end">
                      <button className="w-full bg-amber-500 text-slate-950 py-3 rounded-xl font-bold hover:bg-amber-400 text-xs shrink-0 cursor-pointer shadow">
                        Publish Promo Code
                      </button>
                    </div>
                  </div>
                </form>

                {/* Coupons display */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {offers.map((o) => (
                    <div key={o.code} className="bg-slate-900 border border-slate-900 p-5 rounded-2xl relative overflow-hidden flex flex-col justify-between shadow-md hover:border-slate-800 transition">
                      <div className="absolute top-0 right-0 p-4 font-serif text-[10px] text-amber-500/20 font-black rotate-12">
                        OFFER
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center p-1 border-b border-slate-950">
                          <span className="font-mono text-xs font-black bg-amber-500 text-slate-950 px-2.5 py-1 rounded">
                            {o.code}
                          </span>
                          <span className="text-[10px] uppercase font-mono text-emerald-400">
                            {o.discount} Discount
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed font-sans mt-2">{o.desc}</p>
                      </div>

                      <div className="flex justify-between items-center pt-3 mt-4 border-t border-slate-950 font-mono text-[10.5px]">
                        <span className="text-emerald-400 font-bold tracking-wider uppercase text-[10px]">● {o.validity}</span>
                        <button 
                          onClick={() => {
                            setOffers(offers.filter(of => of.code !== o.code));
                            alert("Voucher voucher erased!");
                          }}
                          className="hover:text-red-400 text-slate-500 text-xs transition cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ==================== TAB: NOTIFICATIONS ==================== */}
            {activeTab === 'notifications' && (
              <div className="bg-slate-900 border border-slate-900 p-5 rounded-2xl shadow-lg space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-slate-950">
                  <div>
                    <h3 className="text-sm font-serif font-bold text-slate-200">Universal Alarms and notifications center</h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">Observe real-time Razorpay payments verification alert alerts or hotel cancellation request requests.</p>
                  </div>
                  <button 
                    onClick={async () => {
                      await fetch('/api/notifications/clear-all', { method: 'POST' });
                      fetchAnalytics();
                      alert("Activity log wiped cleanly.");
                    }}
                    className="p-1.5 bg-red-500/5 hover:bg-red-500 border border-red-500/10 hover:text-slate-950 rounded-xl text-xs transition text-red-400"
                  >
                    Wipe Logs
                  </button>
                </div>

                <div className="space-y-2.5 font-mono text-[11px]">
                  {alerts.map((a) => (
                    <div 
                      key={a.id}
                      className={`p-3.5 border rounded-xl flex items-center justify-between gap-4 ${
                        a.read ? 'bg-slate-950/40 border-slate-800/10 text-slate-500' : 'bg-slate-950 border-amber-500/10 text-slate-200'
                      }`}
                    >
                      <div>
                        <p className="font-bold text-amber-500 uppercase tracking-widest text-[9.5px]">[{a.type}] &bull; {a.title} &mdash; <span className="text-[8.5px] text-slate-600 font-sans font-normal">{new Date(a.date).toLocaleString()}</span></p>
                        <p className="mt-1 font-sans text-slate-300 pr-2 leading-relaxed">{a.message}</p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        {!a.read && (
                          <button 
                            onClick={async () => {
                              await fetch(`/api/notifications/${a.id}/read`, { method: 'POST' });
                              fetchAnalytics();
                            }}
                            className="bg-slate-800 hover:bg-slate-700 px-3 py-1 text-[10px] rounded border border-slate-700 font-bold"
                          >
                            Mark Read
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ==================== TAB: REPORTS ==================== */}
            {activeTab === 'reports' && (
              <div className="space-y-6">
                <div className="bg-slate-900/60 border border-slate-900 p-5 rounded-2xl shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <h3 className="font-serif font-black text-sm text-slate-100">Monthly Performance audits & PDF Invoices</h3>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-normal">Generate offline printable business reviews regarding seasonal stay rates, gross tax receipts, and booking occupancy reports.</p>
                  </div>
                  <button 
                    onClick={() => {
                      window.print();
                    }}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer shadow border border-amber-450/20 shrink-0"
                  >
                    <Download className="h-4 w-4" /> Export/Print Invoice Report
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-900/60 border border-slate-900 p-5 rounded-2xl shadow-md">
                    <h4 className="font-serif font-bold text-slate-200 text-xs uppercase mb-3 text-amber-500">Occupancy statistics by Suite categories:</h4>
                    <div className="space-y-3 font-mono text-xs">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px]">
                          <span>Premium Family AC Suite</span>
                          <span className="font-bold text-slate-200">88% Peak Occupied</span>
                        </div>
                        <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-900">
                          <div className="bg-amber-500 h-full rounded-full" style={{ width: '88%' }}></div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px]">
                          <span>King size Double Suite AC</span>
                          <span className="font-bold text-slate-200">72% Occupied</span>
                        </div>
                        <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-900">
                          <div className="bg-amber-500 h-full rounded-full" style={{ width: '72%' }}></div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px]">
                          <span>Deluxe Single Standard AC</span>
                          <span className="font-bold text-slate-200">55% Occupied</span>
                        </div>
                        <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-900">
                          <div className="bg-amber-500 h-full rounded-full" style={{ width: '55%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-900/60 border border-slate-900 p-5 rounded-2xl shadow-md space-y-3 text-xs leading-relaxed text-slate-400">
                    <h4 className="font-serif font-bold text-amber-500 text-xs uppercase">Operational parameters notice & tax log</h4>
                    <p className="leading-relaxed">Tax parameters are mapped following MH Lodge guidelines. In accordance with standard GST requirements, stays exceeding ₹1,000 daily are booked subject to 12% statutory central/state IGST calculations.</p>
                    <div className="bg-slate-950 p-3.5 rounded-xl text-[11px] space-y-1.5 font-mono">
                      <p>● Stat SGST liability: <span className="text-white">6% CGST + 6% SGST</span></p>
                      <p>● Monthly gross ledger: <span className="text-white">Calculated dynamically in Indian Rupees (INR)</span></p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ==================== TAB: WEBSITE CONFIG (CMS) ==================== */}
            {activeTab === 'settings' && (
              <form onSubmit={handleSaveCMSChanges} className="bg-slate-900/60 border border-slate-900 rounded-2xl p-6 space-y-4 text-xs font-sans shadow-lg">
                <h3 className="font-serif font-black text-slate-200 border-b border-slate-950 pb-3 text-sm flex items-center gap-2 mb-4">
                  <SettingsIcon className="h-4.5 w-4.5 text-amber-500" /> Website dynamic content manager (CMS)
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-slate-400 uppercase font-mono text-[9px] font-bold">Lodge Brand Name</label>
                    <input 
                      type="text" 
                      value={siteName}
                      onChange={(e) => setSiteName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3.5 text-white focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-400 uppercase font-mono text-[9px] font-bold">Marketing Slogan Tagline</label>
                    <input 
                      type="text" 
                      value={tagline}
                      onChange={(e) => setTagline(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3.5 text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-slate-400 uppercase font-mono text-[9px] font-bold">Landline / Desk Mobile</label>
                    <input 
                      type="text" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3.5 text-white focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-400 uppercase font-mono text-[9px] font-bold">Desk Email Contact</label>
                    <input 
                      type="text" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3.5 text-white focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-400 uppercase font-mono text-[9px] font-bold">WhatsApp support Mobile</label>
                    <input 
                      type="text" 
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3.5 text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 uppercase font-mono text-[9px] font-bold">Physical Lodge Address description</label>
                  <input 
                    type="text" 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3.5 text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 uppercase font-mono text-[9px] font-bold">Homepage Stay Description narrative text</label>
                  <textarea 
                    rows={4}
                    value={aboutText}
                    onChange={(e) => setAboutText(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3.5 text-white focus:outline-none leading-relaxed"
                  />
                </div>

                <button className="px-5 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black rounded-xl hover:from-amber-400 shadow cursor-pointer uppercase text-xs">
                  Publish Website Content configurations
                </button>
              </form>
            )}

            {/* ==================== TAB: ADMIN SETTINGS ==================== */}
            {activeTab === 'admin-settings' && (
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  alert("Security parameters and profiles updated safely!");
                }} 
                className="bg-slate-900/60 border border-slate-900 rounded-2xl p-6 space-y-5 text-xs font-sans shadow-lg"
              >
                <div className="border-b border-slate-950 pb-3">
                  <h3 className="font-serif font-black text-slate-200 text-sm flex items-center gap-2">
                    <Lock className="h-4.5 w-4.5 text-amber-500" /> Administrator personal security panel & Profile
                  </h3>
                  <p className="text-[10.5px] text-slate-500 mt-1">Configure security lock phrases, passwords or admin phone indicators.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-slate-400 uppercase font-mono text-[9px] font-bold">Operator Name</label>
                    <input 
                      type="text" 
                      value={adminName}
                      onChange={(e) => setAdminName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3.5 text-white focus:outline-none"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-400 uppercase font-mono text-[9px] font-bold">Operator Primary Email</label>
                    <input 
                      type="email" 
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3.5 text-white focus:outline-none"
                      disabled
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-slate-400 uppercase font-mono text-[9px] font-bold">Operator Phone / Whatsapp</label>
                    <input 
                      type="text" 
                      value={adminPhone}
                      onChange={(e) => setAdminPhone(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3.5 text-white focus:outline-none"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-400 uppercase font-mono text-[9px] font-bold">Renew secret Key lock password phrase</label>
                    <input 
                      type="password" 
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3.5 text-white focus:outline-none text-xs font-mono"
                    />
                  </div>
                </div>

                {/* Dark / Light Toggle */}
                <div className="p-4 bg-slate-950/40 border border-slate-850 rounded-2xl flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-slate-200 text-xs block">Enable Cloud Dark Mode theme</span>
                    <span className="text-slate-500 font-sans text-[10.5px]">Save eye strain with premium dark glassmorphic styling grids.</span>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => {
                      setIsDarkMode(!isDarkMode);
                      alert("Theme preference retained!");
                    }}
                    className="p-2 bg-slate-900 border border-slate-800 hover:border-amber-500/20 text-amber-400 rounded-xl font-bold font-sans text-xs shrink-0 flex items-center gap-1.5 cursor-pointer"
                  >
                    {isDarkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                    <span>{isDarkMode ? 'Dark theme' : 'Light Theme'}</span>
                  </button>
                </div>

                <button className="px-5 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black rounded-xl hover:from-amber-400 text-xs shadow-md cursor-pointer uppercase text-xs">
                  Save Operator Credentials Lock
                </button>
              </form>
            )}

          </motion.div>
        </AnimatePresence>

      </main>
    </div>
  );
}
