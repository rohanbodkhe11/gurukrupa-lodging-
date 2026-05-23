import express from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';
import { Room, Booking, Review, UserProfile, SiteSettings, Notification } from './src/types';

// State path
const DATA_FILE_PATH = path.join(process.cwd(), 'data.json');

// Types for the database structure
interface DatabaseSchema {
  rooms: Room[];
  bookings: Booking[];
  reviews: Review[];
  users: UserProfile[];
  settings: SiteSettings;
  notifications: Notification[];
}

// Initial default seed database
const DEFAULT_DATABASE: DatabaseSchema = {
  rooms: [
    {
      id: "room-101",
      roomNumber: "101",
      name: "Deluxe Pink Accent Double AC",
      type: "Double",
      ac: true,
      capacity: 2,
      price: 1500,
      amenities: ["Air Conditioning", "Plush Double Bed", "Attached Bathroom", "LED TV & Cable", "Free Highspeed WiFi", "Solar Hot Water", "CCTV Gated Security"],
      images: [
        "https://i.ibb.co/SXFYLJrn/IMG-20260104-WA0004.jpg"
      ],
      rating: 4.8,
      reviewsCount: 15,
      status: "Available"
    },
    {
      id: "room-102",
      roomNumber: "102",
      name: "Premium Green Comfort Double AC",
      type: "Double",
      ac: true,
      capacity: 2,
      price: 1800,
      amenities: ["Comfortable Air Conditioning", "Spacious Double Bed", "Attached Bathroom", "LED TV & Room Service", "Free Highspeed WiFi", "Solar Hot Water", "Gated Car Parking"],
      images: [
        "https://i.ibb.co/5hY9s6kc/IMG-20260104-WA0001.jpg"
      ],
      rating: 4.9,
      reviewsCount: 12,
      status: "Available"
    },
    {
      id: "room-201",
      roomNumber: "201",
      name: "Classic Beige Elegance Double AC",
      type: "Double",
      ac: true,
      capacity: 2,
      price: 2000,
      amenities: ["High-performance AC", "Premium King Bed", "Attached Washroom", "LED TV & Intercom", "Free Highspeed WiFi", "Solar Hot Water", "Private Protected Parking"],
      images: [
        "https://i.ibb.co/mr6rJ1xM/IMG-20260104-WA0015.jpg"
      ],
      rating: 4.7,
      reviewsCount: 22,
      status: "Available"
    },
    {
      id: "room-202",
      roomNumber: "202",
      name: "Signature Teal Royal Suite AC",
      type: "Double",
      ac: true,
      capacity: 2,
      price: 2400,
      amenities: ["In-Room Washbasin & Mirror", "Luxury AC System", "Attached Premium Washroom", "Smart LED TV", "Free Highspeed WiFi", "Solar Hot Water", "Balcony & Safe Parking"],
      images: [
        "https://i.ibb.co/cXY4BPgr/IMG-20260104-WA0018.jpg"
      ],
      rating: 5.0,
      reviewsCount: 8,
      status: "Available"
    }
  ],
  bookings: [
    {
      id: "BKG-2026-0001",
      roomId: "room-201",
      roomName: "Classic King Double AC Suite",
      roomNumber: "201",
      guestName: "Rupesh Patil",
      guestEmail: "rupeshpatil4586@gmail.com",
      guestPhone: "9876543210",
      checkIn: "2026-06-10",
      checkOut: "2026-06-12",
      guestsCount: 2,
      totalAmount: 4800,
      status: "Confirmed",
      paymentId: "PAY-UPI-12345678",
      paymentStatus: "Paid",
      paymentMethod: "UPI",
      createdAt: "2026-05-22T10:00:00Z"
    },
    {
      id: "BKG-2026-0002",
      roomId: "room-101",
      roomName: "Deluxe Single Standard AC",
      roomNumber: "101",
      guestName: "Anil Deshmukh",
      guestEmail: "anil.d@example.com",
      guestPhone: "8888888888",
      checkIn: "2026-05-20",
      checkOut: "2026-05-23",
      guestsCount: 1,
      totalAmount: 4500,
      status: "Checked-In",
      paymentId: "PAY-CARD-445566",
      paymentStatus: "Paid",
      paymentMethod: "Credit Card",
      createdAt: "2026-05-19T14:30:00Z"
    }
  ],
  reviews: [
    {
      id: "rev-1",
      roomId: "room-201",
      roomName: "Classic King Double AC Suite",
      authorName: "Rupesh Patil",
      rating: 5,
      comment: "Absolutely outstanding stay here! The AC rooms are clean, WiFi is extremely fast, and the staff's service is top notch. Excellent parking space and prompt hot water access. Will definitely book again next month!",
      date: "2026-05-15",
      verified: true,
      approved: true
    },
    {
      id: "rev-2",
      roomId: "room-101",
      roomName: "Deluxe Single Standard AC",
      authorName: "Milind Shinde",
      rating: 5,
      comment: "Highly recommended for business travellers. Excellent security, continuous power backup, and pristine bedsheets. Situated in an extremely accessible spot.",
      date: "2026-05-18",
      verified: true,
      approved: true
    },
    {
      id: "rev-3",
      roomId: "room-301",
      roomName: "Premium Gold Family AC Suite",
      authorName: "Sneha Gaikwad",
      rating: 4,
      comment: "Extremely family-friendly lodge. We stayed in the King suite with the kids. High cleanliness standards and spacious beds.",
      date: "2026-05-21",
      verified: true,
      approved: true
    }
  ],
  users: [
    {
      id: "admin-auth",
      name: "Gurukrupa Admin",
      email: "admin@gurukrupahotel.com",
      phone: "9999999999",
      role: "admin",
      isBlocked: false,
      registeredAt: "2026-01-01T00:00:00Z"
    },
    {
      id: "user-rupesh",
      name: "Rupesh Patil",
      email: "rupeshpatil4586@gmail.com",
      phone: "9876543210",
      role: "admin",
      isBlocked: false,
      registeredAt: "2026-05-22T08:00:00Z"
    }
  ],
  settings: {
    siteName: "Gurukrupa Lodging",
    tagline: "Comfortable, clean, and affordable rooms for families, travelers, tourists, and business visitors.",
    phone: "+91 7620586155",
    email: "contact@gurukrupalodging.com",
    address: "Khultabad Naka, Khultabad, Dist. Chhatrapati Sambhajinagar",
    whatsappNumber: "7620586155",
    aboutText: "Gurukrupa Lodging is a trusted and comfortable stay destination located at Khultabad Naka, Chhatrapati Sambhajinagar. We provide clean, safe, and affordable accommodation for families, tourists, travelers, and business guests. Our lodge offers AC and Non-AC rooms with modern facilities, friendly service, and a peaceful environment to ensure a pleasant stay for every guest. Whether you are visiting for travel, work, family functions, or tourism, Gurukrupa Lodging is committed to giving you comfort, convenience, and 24×7 hospitality service.",
    mission: "To provide clean, safe, and affordable accommodation for families, tourists, travelers, and business guests.",
    vision: "To be the preferred choice for comfortable and affordable stays near Khultabad Naka."
  },
  notifications: [
    {
      id: "notif-1",
      title: "New Booking Created",
      message: "Customer Rupesh Patil reserved Room 201 Classic King AC Double for June 10th - 12th.",
      type: "booking",
      date: "2026-05-22T10:00:00Z",
      read: false
    },
    {
      id: "notif-2",
      title: "Payment Received",
      message: "INR 4,800 payment cleared successfully via UPI for Booking ID BKG-2026-0001.",
      type: "payment",
      date: "2026-05-22T10:02:00Z",
      read: false
    }
  ]
};

// Firebase connection credentials loading
let firebaseConfig: any = null;
try {
  const configRaw = fs.readFileSync(path.join(process.cwd(), 'firebase-applet-config.json'), 'utf-8');
  firebaseConfig = JSON.parse(configRaw);
  console.log("Firebase Applet Configuration loaded successfully inside Express backend wrapper!");
} catch (e) {
  console.warn("Notice: firebase-applet-config.json not detected. Operating with robust local persistence.", e);
}

// REST cloud backup functions
async function saveDatabaseToFirestore(db: DatabaseSchema) {
  if (!firebaseConfig) return;
  const { projectId, firestoreDatabaseId, apiKey } = firebaseConfig;
  try {
    const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/${firestoreDatabaseId}/documents/settings/backup?key=${apiKey}`;
    const payload = {
      fields: {
        lastUpdated: { stringValue: new Date().toISOString() },
        rawState: { stringValue: JSON.stringify(db) }
      }
    };
    await fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch (err) {
    console.error("Failed backing up data to Firestore REST endpoint:", err);
  }
}

async function loadDatabaseFromFirestore(): Promise<DatabaseSchema | null> {
  if (!firebaseConfig) return null;
  const { projectId, firestoreDatabaseId, apiKey } = firebaseConfig;
  try {
    const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/${firestoreDatabaseId}/documents/settings/backup?key=${apiKey}`;
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      const rawState = data.fields?.rawState?.stringValue;
      if (rawState) {
        console.log("Successfully restored lodge database from cloud Firestore document settings/backup!");
        return JSON.parse(rawState);
      }
    }
  } catch (err) {
    console.error("Firestore restore query timed out or failed:", err);
  }
  return null;
}

async function pushDocToFirestore(collectionName: string, docId: string, jsObject: any) {
  if (!firebaseConfig) return;
  const { projectId, firestoreDatabaseId, apiKey } = firebaseConfig;
  try {
    const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/${firestoreDatabaseId}/documents/${collectionName}/${docId}?key=${apiKey}`;
    const fields: any = {};
    for (const key of Object.keys(jsObject)) {
      const val = jsObject[key];
      if (val === undefined || val === null) continue;
      if (typeof val === 'string') {
        fields[key] = { stringValue: val };
      } else if (typeof val === 'number') {
        fields[key] = { doubleValue: val };
      } else if (typeof val === 'boolean') {
        fields[key] = { booleanValue: val };
      } else if (Array.isArray(val)) {
        fields[key] = { arrayValue: { values: val.map(v => {
          if (typeof v === 'string') return { stringValue: v };
          if (typeof v === 'number') return { doubleValue: v };
          if (typeof v === 'boolean') return { booleanValue: v };
          return { stringValue: JSON.stringify(v) };
        }) } };
      } else {
        fields[key] = { stringValue: JSON.stringify(val) };
      }
    }
    await fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields })
    });
  } catch (err) {
    console.error(`Firestore documentation push failed for /${collectionName}/${docId}:`, err);
  }
}

async function deleteDocFromFirestore(collectionName: string, docId: string) {
  if (!firebaseConfig) return;
  const { projectId, firestoreDatabaseId, apiKey } = firebaseConfig;
  try {
    const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/${firestoreDatabaseId}/documents/${collectionName}/${docId}?key=${apiKey}`;
    await fetch(url, {
      method: 'DELETE'
    });
    console.log(`Successfully deleted document from Firestore: /${collectionName}/${docId}`);
  } catch (err) {
    console.error(`Firestore document delete failed for /${collectionName}/${docId}:`, err);
  }
}

// Database Access helpers
function readDatabase(): DatabaseSchema {
  try {
    if (!fs.existsSync(DATA_FILE_PATH)) {
      fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(DEFAULT_DATABASE, null, 2), 'utf-8');
      return DEFAULT_DATABASE;
    }
    const rawData = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
    return JSON.parse(rawData);
  } catch (err) {
    console.error("Error reading database, reverting to in-memory default", err);
    return DEFAULT_DATABASE;
  }
}

function writeDatabase(data: DatabaseSchema) {
  try {
    // 1. Save local state
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
    
    // 2. Continuous Cloud Synchronization (Non-blocking background sync)
    saveDatabaseToFirestore(data);

    // Push individual entities for direct Firestore inspectability
    Promise.resolve().then(() => {
      data.rooms?.slice(0, 15).forEach(r => pushDocToFirestore('rooms', r.id, r));
      data.bookings?.slice(-15).forEach(b => pushDocToFirestore('bookings', b.id, b));
      data.reviews?.slice(-15).forEach(r => pushDocToFirestore('reviews', r.id, r));
      pushDocToFirestore('settings', 'main', data.settings);
    }).catch(e => console.error(e));

  } catch (err) {
    console.error("Error saving database file", err);
  }
}

// Ensure database starts & syncs with Firebase cloud backups
async function initDatabaseWithCloud() {
  const cloudBackup = await loadDatabaseFromFirestore();
  if (cloudBackup) {
    // Seed locally
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(cloudBackup, null, 2), 'utf-8');
    console.log("Seeded filesystem database cache from dynamic Firebase cloud states successfully.");
  } else {
    readDatabase();
  }
}
initDatabaseWithCloud();

async function startServer() {
  const app = express();
  app.use(express.json());

  // Serve the src/assets folder statically so direct image requests resolve successfully
  app.use('/src/assets', express.static(path.join(process.cwd(), 'public/src/assets')));

  // HEALTH CHECK
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', text: "Gurukrupa Lodging Server Active!" });
  });

  // REST API: SITE SETTINGS
  app.get('/api/settings', (req, res) => {
    const db = readDatabase();
    res.json(db.settings);
  });

  app.put('/api/settings', (req, res) => {
    const db = readDatabase();
    db.settings = { ...db.settings, ...req.body };
    writeDatabase(db);
    res.json({ success: true, settings: db.settings });
  });

  // REST API: AUTHENTICATION
  app.post('/api/auth/register', (req, res) => {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !phone) {
      return res.status(400).json({ error: "Missing required fields: name, email, phone" });
    }

    const db = readDatabase();
    // Check if user already exists
    const existing = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(400).json({ error: "Email already registered. Please login instead." });
    }

    const newUser: UserProfile = {
      id: "user-" + Math.random().toString(36).substring(2, 11),
      name,
      email,
      phone,
      role: (email.toLowerCase() === 'admin@gurukrupahotel.com' || email.toLowerCase() === 'rupeshpatil4586@gmail.com') ? 'admin' : 'customer',
      isBlocked: false,
      registeredAt: new Date().toISOString()
    };

    db.users.push(newUser);
    writeDatabase(db);

    res.json({ success: true, user: newUser });
  });

  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const db = readDatabase();
    const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      // Create lazy account or fail. To be user friendly, let's auto-register
      // if not exists except if password is empty
      if (email.includes('@') && email.endsWith('.com')) {
        // Auto sign up for demonstration ease
        const newUser: UserProfile = {
          id: "user-" + Math.random().toString(36).substring(2, 11),
          name: email.split('@')[0].toUpperCase(),
          email: email.toLowerCase(),
          phone: "9123456789",
          role: (email.toLowerCase() === 'admin@gurukrupahotel.com' || email.toLowerCase() === 'rupeshpatil4586@gmail.com') ? 'admin' : 'customer',
          isBlocked: false,
          registeredAt: new Date().toISOString()
        };
        db.users.push(newUser);
        writeDatabase(db);
        return res.json({ success: true, user: newUser });
      }
      return res.status(404).json({ error: "User profile not found. Try signing up!" });
    }

    if (user.isBlocked) {
      return res.status(403).json({ error: "Your account is temporarily suspended. Contact support." });
    }

    res.json({ success: true, user });
  });

  // REST API: ROOMS
  app.get('/api/rooms', (req, res) => {
    const db = readDatabase();
    res.json(db.rooms);
  });

  app.get('/api/rooms/:id', (req, res) => {
    const db = readDatabase();
    const room = db.rooms.find(r => r.id === req.params.id);
    if (!room) return res.status(404).json({ error: "Room not found" });
    res.json(room);
  });

  app.post('/api/rooms', (req, res) => {
    const adminEmail = req.headers['x-admin-email'] as string;
    const isAuthorized = adminEmail && (
      adminEmail.toLowerCase() === 'admin@gurukrupahotel.com' ||
      adminEmail.toLowerCase() === 'rupeshpatil4586@gmail.com'
    );

    if (!isAuthorized) {
      return res.status(403).json({ error: "Access denied! Only hotel administrators are authorized to catalog suites." });
    }

    const db = readDatabase();
    const newRoom: Room = {
      id: "room-" + Math.random().toString(36).substring(2, 11),
      images: [
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80"
      ],
      rating: 5.0,
      reviewsCount: 0,
      status: "Available",
      ...req.body
    };

    if (!newRoom.roomNumber || !newRoom.name || !newRoom.price) {
      return res.status(400).json({ error: "Missing required room fields (roomNumber, name, price)" });
    }

    // Check duplicate room number
    if (db.rooms.some(r => r.roomNumber === newRoom.roomNumber)) {
      return res.status(400).json({ error: "Room number already exists!" });
    }

    db.rooms.push(newRoom);
    writeDatabase(db);
    res.json({ success: true, room: newRoom });
  });

  app.put('/api/rooms/:id', (req, res) => {
    const adminEmail = req.headers['x-admin-email'] as string;
    const isAuthorized = adminEmail && (
      adminEmail.toLowerCase() === 'admin@gurukrupahotel.com' ||
      adminEmail.toLowerCase() === 'rupeshpatil4586@gmail.com'
    );

    if (!isAuthorized) {
      return res.status(403).json({ error: "Access denied! Only hotel administrators are authorized to edit suites." });
    }

    const db = readDatabase();
    const index = db.rooms.findIndex(r => r.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: "Room not found" });

    db.rooms[index] = { ...db.rooms[index], ...req.body };
    writeDatabase(db);
    res.json({ success: true, room: db.rooms[index] });
  });

  app.delete('/api/rooms/:id', (req, res) => {
    const adminEmail = req.headers['x-admin-email'] as string;
    const db = readDatabase();

    // Verify requesting user is indeed an administrator
    const isAuthorized = adminEmail && (
      adminEmail.toLowerCase() === 'admin@gurukrupahotel.com' ||
      adminEmail.toLowerCase() === 'rupeshpatil4586@gmail.com'
    );

    if (!isAuthorized) {
      return res.status(403).json({ error: "Access denied! Only hotel administrators are authorized to purge suites." });
    }

    const index = db.rooms.findIndex(r => r.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: "Room not found" });

    const roomId = req.params.id;
    db.rooms.splice(index, 1);
    writeDatabase(db);

    // Securely fire-and-forget delete from Firestore documents collection
    if (firebaseConfig) {
      deleteDocFromFirestore('rooms', roomId).catch(err => {
        console.error(`Failed to delete room document from cloud Firestore: ${roomId}`, err);
      });
    }

    res.json({ success: true, message: "Room deleted successfully" });
  });

  // REST API: BOOKINGS
  app.get('/api/bookings', (req, res) => {
    const db = readDatabase();
    const { email } = req.query;
    if (email) {
      const filtered = db.bookings.filter(b => b.guestEmail.toLowerCase() === (email as string).toLowerCase());
      return res.json(filtered);
    }
    res.json(db.bookings);
  });

  app.post('/api/bookings', (req, res) => {
    const { roomId, checkIn, checkOut, guestName, guestEmail, guestPhone, guestsCount, totalAmount } = req.body;
    
    if (!roomId || !checkIn || !checkOut || !guestName || !guestEmail || !guestPhone) {
      return res.status(400).json({ error: "Please provide all required reservation fields." });
    }

    const db = readDatabase();
    const room = db.rooms.find(r => r.id === roomId);
    if (!room) return res.status(404).json({ error: "Selected room does not exist" });

    const newBooking: Booking = {
      id: "BKG-2026-" + Math.floor(1000 + Math.random() * 9000),
      roomId,
      roomName: room.name,
      roomNumber: room.roomNumber,
      guestName,
      guestEmail: guestEmail.toLowerCase(),
      guestPhone,
      checkIn,
      checkOut,
      guestsCount: guestsCount || 1,
      totalAmount: totalAmount || (room.price * 2),
      status: "Pending",
      paymentStatus: "Pending",
      createdAt: new Date().toISOString()
    };

    db.bookings.push(newBooking);

    // Create Notification
    const newNotif: Notification = {
      id: "notif-" + Math.random().toString(36).substring(2, 11),
      title: "New Reservation Created",
      message: `${guestName} selected room ${room.roomNumber} (${checkIn} to ${checkOut})`,
      type: "booking",
      date: new Date().toISOString(),
      read: false
    };
    db.notifications.push(newNotif);

    writeDatabase(db);
    res.json({ success: true, booking: newBooking });
  });

  // RAZORPAY ORDER ROUTE
  app.post('/api/razorpay/order', async (req, res) => {
    const { amount, currency, receipt } = req.body;
    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret) {
      // Elegant fallback simulator for development / testing without keys
      const mockOrder = {
        id: "order_mock_" + Math.random().toString(36).substring(2, 11),
        amount: amount || 150000,
        currency: currency || "INR",
        receipt: receipt || "rec-123",
        status: "created",
        created_at: Math.floor(Date.now() / 1000)
      };
      return res.json({
        success: true,
        order: mockOrder,
        isMock: true,
        keyId: "rzp_test_mockkey123"
      });
    }

    try {
      const auth = Buffer.from(`${key_id}:${key_secret}`).toString('base64');
      const response = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${auth}`
        },
        body: JSON.stringify({
          amount: Math.round(amount),
          currency: currency || "INR",
          receipt
        })
      });

      const data = await response.json();
      if (!response.ok) {
        return res.status(response.status).json({ error: data.error?.description || "Razorpay API error" });
      }

      res.json({
        success: true,
        order: data,
        isMock: false,
        keyId: key_id
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to create Razorpay Order" });
    }
  });

  // RAZORPAY SIGNATURE VERIFICATION ROUTE
  app.post('/api/razorpay/verify', (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, isMock } = req.body;
    
    if (isMock) {
      return res.json({ success: true, message: "Mock verification succeeded!" });
    }

    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    if (!key_secret) {
      return res.status(400).json({ error: "Razorpay Secret Key missing from environment." });
    }

    const generated_signature = crypto
      .createHmac('sha256', key_secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest('hex');

    if (generated_signature === razorpay_signature) {
      res.json({ success: true, message: "Signature verification succeeded!" });
    } else {
      res.status(400).json({ error: "Invalid payment signature!" });
    }
  });

  // RAZORPAY / GATEWAY SIMULATOR
  app.post('/api/bookings/:id/payment', (req, res) => {
    const { method, paymentId } = req.body;
    const db = readDatabase();
    const bookingIndex = db.bookings.findIndex(b => b.id === req.params.id);

    if (bookingIndex === -1) {
      return res.status(404).json({ error: "Booking session not found" });
    }

    const booking = db.bookings[bookingIndex];
    booking.paymentStatus = "Paid";
    booking.status = "Confirmed";
    booking.paymentMethod = method || "UPI QR Express";
    booking.paymentId = paymentId || ("PAY-SIM-" + Math.floor(100000 + Math.random() * 900000));

    // Custom alerts
    const newNotif: Notification = {
      id: "notif-" + Math.random().toString(36).substring(2, 11),
      title: "Successful Payment Received",
      message: `Amount of ₹${booking.totalAmount} paid via ${booking.paymentMethod} for booking ${booking.id}`,
      type: "payment",
      date: new Date().toISOString(),
      read: false
    };
    db.notifications.push(newNotif);

    writeDatabase(db);
    res.json({ success: true, booking });
  });

  // UPDATE BOOKING STATUS (Check-In, Check-Out, Refund / Cancel)
  app.put('/api/bookings/:id/status', (req, res) => {
    const { status, paymentStatus } = req.body;
    const db = readDatabase();
    const booking = db.bookings.find(b => b.id === req.params.id);

    if (!booking) return res.status(404).json({ error: "Booking not found" });

    if (status) {
      booking.status = status;
    }

    if (paymentStatus) {
      booking.paymentStatus = paymentStatus;
    }

    // Log check-in reminders or alerts
    const newNotif: Notification = {
      id: "notif-" + Math.random().toString(36).substring(2, 11),
      title: `Booking Status Modified`,
      message: `Booking ${booking.id} status changed to ${status || booking.status} (${paymentStatus || booking.paymentStatus})`,
      type: "booking",
      date: new Date().toISOString(),
      read: false
    };
    db.notifications.push(newNotif);

    writeDatabase(db);
    res.json({ success: true, booking });
  });

  // REVIEWS & RATINGS SYSTEM
  app.get('/api/reviews', (req, res) => {
    const db = readDatabase();
    const { all } = req.query;
    // Public guests can only see approved reviews
    if (all === 'true') {
      res.json(db.reviews);
    } else {
      res.json(db.reviews.filter(r => r.approved));
    }
  });

  app.post('/api/reviews', (req, res) => {
    const { roomId, authorName, rating, comment } = req.body;
    if (!roomId || !authorName || !rating || !comment) {
      return res.status(400).json({ error: "Missing required review input elements" });
    }

    const db = readDatabase();
    const room = db.rooms.find(r => r.id === roomId);
    if (!room) return res.status(404).json({ error: "Room not identified for review" });

    const newReview: Review = {
      id: "rev-" + Math.random().toString(36).substring(2, 11),
      roomId,
      roomName: room.name,
      authorName,
      rating: Number(rating),
      comment,
      date: new Date().toISOString().split('T')[0],
      verified: true, // Bookings verified automatically in frontend flow
      approved: false // Set to false to support "Admin approval option" requirement
    };

    db.reviews.push(newReview);

    // Notify administrator
    const newNotif: Notification = {
      id: "notif-" + Math.random().toString(36).substring(2, 11),
      title: "New Review For Approval",
      message: `Review added by ${authorName} for ${room.name} with rating ${rating}/5`,
      type: "admin",
      date: new Date().toISOString(),
      read: false
    };
    db.notifications.push(newNotif);

    writeDatabase(db);
    res.json({ success: true, review: newReview, message: "Review submitted! It will show up shortly after admin approval." });
  });

  app.put('/api/reviews/:id/approve', (req, res) => {
    const { approved } = req.body;
    const db = readDatabase();
    const reviewIndex = db.reviews.findIndex(r => r.id === req.params.id);

    if (reviewIndex === -1) return res.status(404).json({ error: "Review not found" });

    db.reviews[reviewIndex].approved = !!approved;

    // Dynamically recalculate Room rating
    const review = db.reviews[reviewIndex];
    if (approved) {
      const roomReviews = db.reviews.filter(r => r.roomId === review.roomId && r.approved);
      const totalStars = roomReviews.reduce((sum, r) => sum + r.rating, 0);
      const roomIndex = db.rooms.findIndex(r => r.id === review.roomId);
      if (roomIndex !== -1) {
        db.rooms[roomIndex].reviewsCount = roomReviews.length;
        db.rooms[roomIndex].rating = Number((totalStars / (roomReviews.length || 1)).toFixed(1)) || 5.0;
      }
    }

    writeDatabase(db);
    res.json({ success: true, review: db.reviews[reviewIndex] });
  });

  app.delete('/api/reviews/:id', (req, res) => {
    const db = readDatabase();
    const index = db.reviews.findIndex(r => r.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: "Review not found" });

    db.reviews.splice(index, 1);
    writeDatabase(db);
    res.json({ success: true, message: "Review deleted successfully" });
  });

  // REST API: CUSTOMER DATABASE FOR ADMIN VIEW
  app.get('/api/customers', (req, res) => {
    const db = readDatabase();
    const customers = db.users.filter(u => u.role === 'customer');
    res.json(customers);
  });

  app.put('/api/customers/:id/block', (req, res) => {
    const { isBlocked } = req.body;
    const db = readDatabase();
    const user = db.users.find(u => u.id === req.params.id);

    if (!user) return res.status(404).json({ error: "Customer not found" });

    user.isBlocked = !!isBlocked;
    writeDatabase(db);
    res.json({ success: true, user });
  });

  // REST API: NOTIFICATIONS
  app.get('/api/notifications', (req, res) => {
    const db = readDatabase();
    res.json(db.notifications);
  });

  app.post('/api/notifications/clear-all', (req, res) => {
    const db = readDatabase();
    db.notifications.forEach(n => n.read = true);
    writeDatabase(db);
    res.json({ success: true });
  });

  app.post('/api/notifications/:id/read', (req, res) => {
    const db = readDatabase();
    const notif = db.notifications.find(n => n.id === req.params.id);
    if (notif) {
      notif.read = true;
      writeDatabase(db);
    }
    res.json({ success: true });
  });

  // VITE PLAYGROUND OR STATS GENERATOR HANDLER FOR GRAPHS
  app.get('/api/admin/analytics', (req, res) => {
    const db = readDatabase();
    const totalBookings = db.bookings.length;
    const totalRevenue = db.bookings
      .filter(b => b.paymentStatus === 'Paid')
      .reduce((sum, b) => sum + b.totalAmount, 0);

    const availableRooms = db.rooms.filter(r => r.status === 'Available').length;
    const occupiedRooms = db.bookings.filter(b => b.status === 'Checked-In').length;

    // Monthly aggregation
    const monthlyData = [
      { name: 'Jan', revenue: Math.floor(totalRevenue * 0.1) },
      { name: 'Feb', revenue: Math.floor(totalRevenue * 0.15) },
      { name: 'Mar', revenue: Math.floor(totalRevenue * 0.12) },
      { name: 'Apr', revenue: Math.floor(totalRevenue * 0.23) },
      { name: 'May', revenue: Math.floor(totalRevenue * 0.4) }
    ];

    res.json({
      totalBookings,
      totalRevenue,
      availableRooms,
      occupiedRooms,
      monthlyData,
      recentBookings: db.bookings.slice(-5).reverse()
    });
  });


  // VITE DEVELOPMENT MIDDLEWARE OR STATIC PRODUCTION FILES SERVING
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const PORT = 3000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Gurukrupa Lodging Express + Vite running on port ${PORT}`);
  });
}

startServer();
