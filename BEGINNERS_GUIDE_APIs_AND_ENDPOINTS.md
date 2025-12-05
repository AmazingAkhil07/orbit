# 📚 APIs & Endpoints - Beginner's Guide for Orbit

**For:** Non-technical stakeholders, business teams, investors  
**Complexity Level:** Beginner-Friendly 🟢  
**Document Date:** November 26, 2025  

---

## 🎯 Quick Summary

### What is an API? (In the Simplest Terms)

**API** stands for **"Application Programming Interface"**

But what does that ACTUALLY mean? Let me break it down:

- **Application** = Any software (like your phone app, website, etc.)
- **Programming** = Instructions written in code
- **Interface** = A way to connect two things

**Simple Definition:** An API is a messenger that connects your app to the database and other services.

### Real-World Analogy That Makes Sense

Imagine you want to order food from a restaurant:

```
SCENARIO 1: WITHOUT AN API (Direct Access - DANGEROUS!)
┌─────────────┐
│ You         │ ← You walk directly into the kitchen
│ (Customer)  │
└─────────────┘
        │ (Go straight to the kitchen)
        ▼
┌──────────────────────────┐
│ Kitchen/Storage          │
│ - You can steal food     │ ← PROBLEM: You can take anything!
│ - You can break things   │
│ - You can hurt yourself  │
│ - CHAOS!                 │
└──────────────────────────┘

REAL-WORLD PROBLEM:
If students could directly access the database:
- Someone might delete all properties
- Someone might steal other students' phone numbers
- Someone might change prices
- The system would crash!


SCENARIO 2: WITH AN API (Safe & Organized - CORRECT!)
┌─────────────┐
│ You         │ ← You order from the counter
│ (Customer)  │
└─────────────┘
        │ "I want: 1 biryani, 1 chai"
        ▼
┌──────────────────────────┐
│ WAITER (THE API)         │
│ - Takes your order       │ ← API = Security Guard
│ - Validates it           │
│ - Only allows what's     │
│   on the menu            │
└──────────────────────────┘
        │ "Chef, make this"
        ▼
┌──────────────────────────┐
│ Kitchen/Database         │
│ - Only the waiter        │ ← DATABASE: Safe & Protected
│   can enter              │
│ - Food is prepared       │
│ - Nothing is stolen      │
└──────────────────────────┘
        │ "Here's your food"
        ▼
┌─────────────┐
│ You         │ ← Happy customer with correct food!
│ (Customer)  │
└─────────────┘

REAL-WORLD BENEFIT:
API protects:
- Student data (phone, ID, email)
- Property information
- Payment details
- Database integrity
```

### The Three-Part System (Simplified)

When you use Orbit, three things work together:

```
PART 1: FRONTEND (What You See)
┌─────────────────────────────────┐
│ Your Phone/Computer Screen      │
│ • Pretty buttons                │
│ • Nice images                   │
│ • Text fields to fill           │
│ • Shows property listings       │
└─────────────────────────────────┘
        ▲
        │ "Send me properties"
        │
        ▼
PART 2: API/BACKEND (The Brain)
┌─────────────────────────────────┐
│ Orbit Server (Hidden from view) │
│ • Receives your request         │
│ • Checks: "Is this valid?"      │
│ • Connects to database          │
│ • Gets the data you asked for   │
│ • Sends back the response       │
└─────────────────────────────────┘
        ▲
        │ "Give me all properties"
        │ "Store this booking"
        │ "Update this review"
        │
        ▼
PART 3: DATABASE (The Storage)
┌─────────────────────────────────┐
│ MongoDB (Information Storage)   │
│ • Stores all student data       │
│ • Stores all properties         │
│ • Stores all bookings           │
│ • Stores all reviews            │
│ • Locked behind API security    │
└─────────────────────────────────┘
```

### Let Me Give You a Real Example

**When you search for properties on Orbit:**

```
STEP 1: YOU CLICK SEARCH
You: Open app → Click search box → Type "DSU Harohalli" → Press search

STEP 2: APP SENDS REQUEST TO API
App: "Hello server! Give me all properties near DSU with price < ₹8000"
(This is called an API request)

STEP 3: API THINKS ABOUT YOUR REQUEST
Server: "Let me check:
- Is this person logged in? ✓ Yes
- Are they verified? ✓ Yes
- Is their request valid? ✓ Yes
- What do they want? Properties near DSU
- I can do this!"

STEP 4: API ASKS DATABASE
Server → Database: "Give me all properties where:
- Location = DSU
- Price ≤ 8000
- Status = Verified"

STEP 5: DATABASE RESPONDS
Database → Server: "Here are 25 matching properties"

STEP 6: API FORMATS RESPONSE
Server: "Let me make this look nice:
[
  { name: "Cozy 2-BHK", price: 7500, location: "DSU" },
  { name: "AC Sharing Room", price: 7000, location: "DSU" },
  { name: "Budget PG", price: 6500, location: "DSU" },
  ... and 22 more
]"

STEP 7: APP SHOWS RESULTS
Your phone screen: Shows beautiful list of properties with images!

TOTAL TIME: ~200 milliseconds (faster than you can blink!)
```

---

## 📖 Understanding APIs Step-by-Step

### Level 1: What Happens When You Use Orbit?

## 📖 Understanding APIs Step-by-Step

### Level 1: What Happens When You Use Orbit?

#### Scenario 1: Student Searches for Properties

```
STUDENT ACTIONS (What YOU see):
┌─────────────────────────────────┐
│ 1. Opens Orbit App              │
│    (See loading screen)         │
├─────────────────────────────────┤
│ 2. Types "DSU Harohalli"        │
│    (See keyboard on screen)     │
├─────────────────────────────────┤
│ 3. Clicks "Search"              │
│    (App shows loading spinner)  │
├─────────────────────────────────┤
│ 4. Results appear!              │
│    (See 10-50 property cards)   │
└─────────────────────────────────┘

WHAT HAPPENS BEHIND THE SCENES (What you DON'T see):

Behind your phone, this conversation happens:

📱 Your App:     "Hello server! I have a student looking for properties"
                 "They want: DSU location, price less than ₹8000, with WiFi"

🖥️ Orbit Server: "Thanks for telling me! Let me find these properties"
                 (Server talks to database now...)

🗄️ Database:     "I found 42 matching properties! Here they are..."

🖥️ Orbit Server: "Great! Let me organize this nicely"
                 (Server sorts by rating, price, etc.)
                 "Here are the TOP 10 most relevant"

📱 Your App:     "Perfect! Thank you!"
                 (App shows beautiful property cards)

👁️ You See:      All 10 properties with images, prices, ratings!
```

**What's Happening Here?**
- The **API** is the messenger between your app and the database
- It's like a translator - your app speaks one language, the database speaks another
- The API makes sure everyone understands each other

#### Scenario 2: Student Books a Property (Complex Example)

```
STUDENT ACTIONS (What YOU do):
┌────────────────────────────────┐
│ 1. Taps on a property          │
│ 2. Sees full details           │
│ 3. Clicks "BOOK NOW"           │
│ 4. Enters move-in date         │
│ 5. Sees payment screen         │
│ 6. Enters UPI PIN              │
│ 7. Payment goes through        │
│ 8. Sees "✅ BOOKED!"           │
└────────────────────────────────┘

WHAT ACTUALLY HAPPENS (The Real Process):

🔵 STEP 1: CREATE BOOKING REQUEST
   📱 Your App → Orbit Server
   Message: "Hey! Create a booking with these details:
   - Student ID: student_abc123
   - Property ID: property_xyz789
   - Move-in Date: December 15, 2025
   - Amount: ₹2,000
   - Purpose: Booking confirmation"

🔵 STEP 2: VALIDATE THE REQUEST
   🖥️ Orbit Server checks:
   ✓ Is this student verified? YES
   ✓ Is this student's email confirmed? YES
   ✓ Is this property available? YES
   ✓ Is this property verified by admin? YES
   ✓ Is ₹2,000 the correct amount? YES
   ✓ All checks passed! Continue...

🔵 STEP 3: CONNECT TO PAYMENT PROVIDER
   🖥️ Orbit Server talks to Razorpay:
   "Razorpay, I need to process a payment:
   - Amount: ₹2,000
   - Student: student_abc123
   - Purpose: Room booking token"

   💳 Razorpay responds:
   "Sure! I created an order for you.
   Order ID: order_3847582_abc
   Payment Link: https://razorpay.com/pay/..."

🔵 STEP 4: SEND PAYMENT LINK TO YOUR APP
   🖥️ Orbit Server → 📱 Your App
   "Here's the payment link. Show it to the student!"
   
   Your App: Shows you a button "PAY ₹2,000"

🔵 STEP 5: STUDENT PAYS
   💳 You click "PAY ₹2,000"
   You enter UPI PIN
   Your bank confirms: ✓
   Payment successful!

🔵 STEP 6: RAZORPAY TELLS ORBIT SERVER
   💳 Razorpay → 🖥️ Orbit Server
   "Payment successful!
   - Payment ID: pay_8472938_def
   - Amount received: ₹2,000
   - Status: SUCCESS"

🔵 STEP 7: AUTOMATIC PAYMENT SPLIT
   💳 Razorpay automatically does this:
   ├─ Takes ₹2,000 from your account
   ├─ Sends ₹500 to Orbit (right now!)
   └─ Holds ₹1,500 for owner (sends tomorrow)

🔵 STEP 8: UPDATE DATABASE
   🖥️ Orbit Server → 🗄️ Database
   "Update the booking:
   - Status: PAID ✓
   - Confirmation Date: Nov 26, 2025
   - Payment ID: pay_8472938_def"

🔵 STEP 9: SEND NOTIFICATION TO OWNER
   🖥️ Orbit Server → 📲 WhatsApp
   "Send this message to owner (9876543210):
   'New booking! Student Raj Kumar booked 2 rooms
   Move-in: Dec 15. Check app for details.'"

🔵 STEP 10: SEND CONFIRMATION TO YOU
   🖥️ Orbit Server → 📱 Your App
   "Booking confirmed!
   - Booking ID: book_12345
   - Owner Phone: 9876543210
   - Move-in: Dec 15, 2025
   - Navigation Video: https://..."

🔵 STEP 11: YOUR APP SHOWS CONFIRMATION
   📱 Your screen shows:
   ✅ BOOKING CONFIRMED!
   - Property: Cozy 2-BHK near DSU
   - Owner: Ramesh (95% response rate)
   - Owner Phone: 9876543210
   - Move-in Date: Dec 15, 2025
   - Amount Paid: ₹2,000
   - Navigation Video: [Play]
   
   You: "Great! I'm all set!"

⏱️ TOTAL TIME: About 2-3 seconds for this ENTIRE process!
```

**All of This Happened Through APIs!**
- API to Razorpay = Payment processing
- API to Database = Store booking information
- API to WhatsApp = Send notifications
- API to your app = Show confirmation

This is why we need APIs - they connect everything together seamlessly!

---

## 🔌 What is an API Endpoint?

### Simple Definition

**Endpoint** = A specific web address that does ONE specific job

Think of it like **mailboxes in an apartment building**:

```
🏢 ORBIT SERVER (Apartment Building)

🟦 MAILBOX 1: /api/properties
   Purpose: "Get me the list of properties"
   You put in: Your search criteria
   You get back: List of matching properties

🟦 MAILBOX 2: /api/bookings
   Purpose: "Create a new booking"
   You put in: Property ID, student ID, move-in date
   You get back: Booking confirmation

🟦 MAILBOX 3: /api/payments
   Purpose: "Process my payment"
   You put in: Amount, booking ID
   You get back: Payment status

🟦 MAILBOX 4: /api/reviews
   Purpose: "Let me leave a review"
   You put in: Property ID, rating, comment
   You get back: Review published confirmation

🟦 MAILBOX 5: /api/admin/stats
   Purpose: "Show me dashboard stats"
   You put in: Admin login
   You get back: Total users, bookings, revenue

When you need something, you put your request in the RIGHT mailbox.
If you put it in the wrong mailbox, the system gets confused!
```

### How Endpoints Work (Like a Vending Machine)

```
🧑 YOU WANT SOMETHING
↓
Pick the RIGHT ENDPOINT (like pressing a button on vending machine)
↓
PUT IN YOUR REQUEST (like inserting money)
↓
WAIT (machine processes)
↓
GET YOUR RESPONSE (like the item coming out)

EXAMPLE VENDING MACHINE:
🟦 Button: "Get hot chai"
   You insert: { quantity: 2, with: "sugar" }
   Machine returns: 🫖 Hot chai (2 cups)

EXAMPLE API ENDPOINT:
🟦 Endpoint: GET /api/properties
   You insert: { location: "DSU", maxPrice: 8000 }
   API returns: [Property1, Property2, Property3...]
```

### Understanding the Endpoint "Address"

Every endpoint has a specific **address** like this:

```
GET /api/properties
 ↑         ↑
 │         └─ The "mailbox" (endpoint name)
 │
 └─ The "action" (GET, POST, PUT, DELETE)
    More on this in the next section!

Examples of Full Endpoints:
- GET /api/properties
- GET /api/properties/prop_123
- POST /api/bookings
- POST /api/reviews
- GET /api/admin/stats
- PUT /api/properties/prop_123
```

### The Four Types of Actions (GET, POST, PUT, DELETE)

Think of it like **filing cabinet actions**:

```
┌─────────────────────────────────────────────────────────┐
│                    YOUR FILING CABINET                  │
│             (The Server/Database)                       │
├─────────────────────────────────────────────────────────┤

🟢 GET (Read/Retrieve)
   What: Opens drawer and READS the file
   You DO: Look at property listings
   Example: "Show me all properties"
   Like: Reading a book (no changes made)

🔵 POST (Create/Add New)
   What: Puts a NEW file in the drawer
   You DO: Create a new booking
   Example: "Add this new booking to the system"
   Like: Writing in a new notebook

🟣 PUT/PATCH (Update/Change)
   What: Takes out a file and REWRITES it
   You DO: Update your profile picture
   Example: "Change this review's rating from 3 to 5 stars"
   Like: Erasing and rewriting in a notebook

🔴 DELETE (Remove)
   What: Takes out a file and THROWS IT AWAY
   You DO: Delete a review you wrote
   Example: "Remove this listing from the system"
   Like: Tearing a page out of a notebook
```

### Real Examples to Understand Better

```
EXAMPLE 1: SEARCH FOR PROPERTIES (GET)
─────────────────────────────────────────
What you want: "Show me properties near DSU"

Endpoint: GET /api/properties
Request: { location: "DSU", maxPrice: 8000 }
Response: [
  { id: 1, name: "Cozy 2-BHK", price: 7500 },
  { id: 2, name: "AC Room", price: 7000 },
  { id: 3, name: "Budget PG", price: 6500 }
]

Think of it like: Opening a filing cabinet and reading files


EXAMPLE 2: BOOK A PROPERTY (POST)
─────────────────────────────────────────
What you want: "Create a booking for property #1"

Endpoint: POST /api/bookings
Request: {
  propertyId: 1,
  studentId: "student_123",
  moveInDate: "Dec 15, 2025",
  amount: 2000
}
Response: {
  bookingId: "book_456",
  status: "created",
  paymentLink: "https://razorpay.com/pay/order_xyz"
}

Think of it like: Adding a new folder to the filing cabinet


EXAMPLE 3: UPDATE YOUR PROFILE (PUT)
─────────────────────────────────────────
What you want: "Change my profile picture"

Endpoint: PUT /api/users/student_123
Request: {
  avatar: "https://cloudinary.com/new_avatar.jpg"
}
Response: {
  status: "updated",
  message: "Profile picture changed!"
}

Think of it like: Taking out your file and rewriting parts of it


EXAMPLE 4: DELETE A REVIEW (DELETE)
─────────────────────────────────────────
What you want: "Remove my review of this property"

Endpoint: DELETE /api/reviews/review_789
Response: {
  status: "deleted",
  message: "Your review has been removed"
}

Think of it like: Throwing away your file completely
```

---

---

## 📚 Easy Vocabulary (Understand the Jargon)

Before we go deeper, let me explain some words you'll hear:

| Word | Meaning | Simple Explanation |
|------|---------|-------------------|
| **Request** | What you ASK for | When you type "Show me properties", that's a request |
| **Response** | What you GET back | The list of properties the server sends you back |
| **Server** | The computer in the cloud | It processes your requests (like a helper) |
| **Database** | Where data is stored | Like a giant filing cabinet in the cloud |
| **Endpoint** | A specific mailbox | Each job has its own address (/api/properties, /api/bookings) |
| **Status Code** | A number that means something | 200 = worked, 404 = not found, 500 = error |
| **JSON** | How data is organized | `{ name: "Raj", age: 20 }` - looks like a filing card |
| **Header** | Extra info in request | Like "I'm a student" or "I'm verified" |
| **Token** | Proof that you're logged in | Like a ticket that proves you entered the cinema |
| **Authentication** | Proving who you are | Login with email + password |
| **Authorization** | Proving you have permission | Admin can delete listings, but student cannot |
| **Encryption** | Making data unreadable | Password is scrambled so hackers can't read it |
| **Webhook** | Automatic message | When payment succeeds, Razorpay automatically tells us |
| **Query Parameter** | A filter/option in URL | `?location=DSU&maxPrice=8000` adds conditions |
| **Payload** | The actual data being sent | All the information in a request (like booking details) |

---

## 💡 How Everything Connects (The Big Picture)

Let me show you how EVERYTHING works together:

```
YOUR ACTIONS:
┌────────────────────┐
│ 1. Open App        │
│ 2. Search          │
│ 3. Click Property  │
│ 4. Book Now        │
│ 5. Pay             │
│ 6. See Confirm     │
└────────┬───────────┘
         │
         ▼
YOUR APP (Frontend)
┌────────────────────────────────────┐
│ • Shows pretty interface           │
│ • Takes your input (search, click) │
│ • Sends API requests               │
│ • Receives responses               │
│ • Displays results                 │
└────────┬───────────────────────────┘
         │
         │ API REQUESTS
         │ (HTTP calls over internet)
         │
         ▼
ORBIT SERVER (Backend/API)
┌────────────────────────────────────┐
│ • Receives your request            │
│ • Checks: "Is this valid?"         │
│ • Connects to services:            │
│   - Razorpay (payment)             │
│   - Cloudinary (images)            │
│   - Google Maps (location)         │
│   - WhatsApp (notification)        │
│ • Gets data from database          │
│ • Sends response back              │
└────────┬───────────────────────────┘
         │
    ┌────┼─────────┬──────────┐
    │    │         │          │
    ▼    ▼         ▼          ▼
DATABASES & SERVICES:
┌──────┐ ┌────────┐ ┌────────┐ ┌──────────┐
│MongoDB  │Razorpay│Cloudinary│WhatsApp  │
│(Data)   │(Payment)│(Images) │(Messages)│
└──────┘ └────────┘ └────────┘ └──────────┘

RESULT:
┌────────────────────────┐
│ You see confirmation   │
│ Owner gets message     │
│ Data saved in database │
│ Payment processed      │
│ Images uploaded        │
└────────────────────────┘
```

---

## 🎓 Why You Should Care About APIs

### For Students Using Orbit:
- **Security:** Your data is protected (API doesn't let anyone access it directly)
- **Speed:** Searches happen in milliseconds
- **Reliability:** If one part breaks, others still work

### For PG Owners Using Orbit:
- **Easy booking system:** Bookings come automatically
- **Instant notifications:** You know when someone books
- **Transparent payments:** You can track all money received

### For Investors/Business People:
- **Feature-rich:** 16+ endpoints = many features
- **Scalable:** Can handle 10,000 users without redesign
- **Professional:** Uses industry-standard services (Razorpay, Cloudinary, etc.)

---

## 🚀 What Happens Behind the Scenes (Deep Dive)

Let me show you the EXACT flow of data when you book a property:

```
⏰ TIME: 0 SECONDS
You open Orbit app
└─ Your phone connects to orbit.yourdomain.com
└─ App loads on your screen

⏰ TIME: 2 SECONDS
You type "DSU Harohalli" and click search
├─ App sends to server: GET /api/properties?location=DSU
├─ Server asks database: "Find all properties where location = DSU"
├─ Database returns: 42 matching properties
├─ Server sorts by rating and sends top 10
└─ You see: 10 beautiful property cards with images

⏰ TIME: 5 SECONDS
You click on a property (Cozy 2-BHK)
├─ App sends to server: GET /api/properties/prop_1
├─ Server queries database: "Get ALL details for property prop_1"
├─ Server also gets: Reviews (23 reviews), Owner info, Photos
├─ Server packages everything nicely
└─ You see: Full property details with 360° tour, reviews, owner phone

⏰ TIME: 8 SECONDS
You click "BOOK NOW"
├─ App shows form: "When do you want to move in?"

⏰ TIME: 10 SECONDS
You enter December 15, 2025 and click "Book"
├─ App sends to server: POST /api/bookings
│   Data: {
│     propertyId: "prop_1",
│     studentId: "student_123",
│     moveInDate: "2025-12-15",
│     amount: 2000
│   }
├─ Server validates:
│   ✓ Is student verified? YES
│   ✓ Is property available? YES
│   ✓ Is amount correct? YES
├─ Server sends to Razorpay: "Create payment order for ₹2,000"
├─ Razorpay returns: "Order created! ID: order_abc123"
└─ Server sends response to app: "Click here to pay"

⏰ TIME: 11 SECONDS
You see "PAY ₹2,000" button on screen
├─ App shows: Razorpay payment page
├─ You see payment options: UPI, Card, NetBanking

⏰ TIME: 15 SECONDS
You click UPI and enter PIN
├─ Your bank processes: ₹2,000 deducted
├─ Razorpay receives payment ✓
├─ Razorpay immediately:
│   ├─ Sends ₹500 to Orbit bank account
│   └─ Holds ₹1,500 for owner (sends next day)

⏰ TIME: 16 SECONDS
Razorpay tells Orbit server: "Payment successful!"
├─ Server receives webhook: Payment confirmed
├─ Server updates database: Booking status = PAID
├─ Server sends WhatsApp to owner: "New booking! 📩"
├─ Server sends WhatsApp to you: "✅ Booking confirmed!"
└─ Server sends response to app

⏰ TIME: 17 SECONDS
You see confirmation screen:
✅ BOOKING CONFIRMED!
- Property: Cozy 2-BHK
- Owner: Ramesh (95% response)
- Owner Phone: 9876543210
- Move-in: Dec 15, 2025
- Navigation Video: [Watch]

TOTAL TIME: 17 SECONDS FOR ENTIRE PROCESS!
```

This is the power of APIs - they make complex tasks feel instant and effortless!

---



---

## 🗄️ APIs & Databases - How They Work Together

### The Three-Layer System

```
┌─────────────────────────────────────────────────────────────┐
│ LAYER 1: PRESENTATION (What User Sees)                      │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │  Mobile App / Website / Desktop App                      │ │
│ │  • Search page                                           │ │
│ │  • Property details                                      │ │
│ │  • Booking confirmation                                 │ │
│ └──────────────────┬──────────────────────────────────────┘ │
└───────────────────┼──────────────────────────────────────────┘
                    │
                    │ User clicks something
                    │ App sends API request
                    │
┌───────────────────┼──────────────────────────────────────────┐
│ LAYER 2: API/BACKEND (The Brain)                            │
│ ┌──────────────────▼──────────────────────────────────────┐ │
│ │  Orbit Server (API Endpoints)                           │ │
│ │  • Receives requests                                    │ │
│ │  • Validates data                                       │ │
│ │  • Applies business rules                               │ │
│ │  • Queries database                                     │ │
│ │  • Sends response                                       │ │
│ └──────────────────┬──────────────────────────────────────┘ │
└───────────────────┼──────────────────────────────────────────┘
                    │
                    │ "Give me properties"
                    │ "Store this booking"
                    │ "Update review count"
                    │
┌───────────────────┼──────────────────────────────────────────┐
│ LAYER 3: DATABASE (The Storage)                             │
│ ┌──────────────────▼──────────────────────────────────────┐ │
│ │  MongoDB (Information Storage)                          │ │
│ │  Collections:                                           │ │
│ │  • Users (Student & Owner info)                         │ │
│ │  • Properties (All PG details)                          │ │
│ │  • Bookings (All reservations)                          │ │
│ │  • Reviews (Student feedback)                           │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## 📋 Complete API Endpoints Explained for Orbit

### Authentication Endpoints

```
1. SIGN UP (Create Account)
   ┌─────────────────────────────────────────┐
   │ POST /api/auth/signup                   │
   ├─────────────────────────────────────────┤
   │ What happens:                           │
   │ 1. Student provides: email, password    │
   │ 2. Server checks: email not in use? ✓   │
   │ 3. Server hashes password (encrypts)    │
   │ 4. Server stores in database            │
   │ 5. Server creates session (login token) │
   │ 6. Returns: { userId, token }           │
   ├─────────────────────────────────────────┤
   │ Example Request:                        │
   │ {                                       │
   │   "email": "student@dsu.edu.in",       │
   │   "password": "SecurePass123",          │
   │   "name": "Raj Kumar",                  │
   │   "role": "student"                     │
   │ }                                       │
   ├─────────────────────────────────────────┤
   │ Example Response:                       │
   │ {                                       │
   │   "userId": "user_12345",               │
   │   "token": "jwt_token_abc...",          │
   │   "message": "Account created! ✅"      │
   │ }                                       │
   └─────────────────────────────────────────┘

2. SIGN IN (Login)
   ┌─────────────────────────────────────────┐
   │ POST /api/auth/signin                   │
   ├─────────────────────────────────────────┤
   │ What happens:                           │
   │ 1. Student provides: email, password    │
   │ 2. Server finds email in database       │
   │ 3. Server compares password with hash   │
   │ 4. If match → creates session token     │
   │ 5. If no match → returns "Wrong pwd"    │
   │ 6. Returns: { token, userData }         │
   ├─────────────────────────────────────────┤
   │ Example Request:                        │
   │ {                                       │
   │   "email": "student@dsu.edu.in",       │
   │   "password": "SecurePass123"           │
   │ }                                       │
   ├─────────────────────────────────────────┤
   │ Example Response:                       │
   │ {                                       │
   │   "token": "jwt_token_xyz...",          │
   │   "user": {                             │
   │     "id": "user_12345",                 │
   │     "email": "student@dsu.edu.in",     │
   │     "name": "Raj Kumar",                │
   │     "role": "student"                   │
   │   }                                     │
   │ }                                       │
   └─────────────────────────────────────────┘

3. LOGOUT
   ┌─────────────────────────────────────────┐
   │ POST /api/auth/logout                   │
   ├─────────────────────────────────────────┤
   │ What happens:                           │
   │ 1. Server receives logout request       │
   │ 2. Server deletes/invalidates token     │
   │ 3. Server clears session                │
   │ 4. Student is logged out                │
   ├─────────────────────────────────────────┤
   │ Example Response:                       │
   │ { "message": "Logged out! ✅" }         │
   └─────────────────────────────────────────┘
```

### Property Endpoints

```
4. GET ALL PROPERTIES (Browse)
   ┌─────────────────────────────────────────┐
   │ GET /api/properties                     │
   ├─────────────────────────────────────────┤
   │ What happens:                           │
   │ 1. Student opens "Browse Properties"    │
   │ 2. App requests: all properties         │
   │ 3. Server queries database              │
   │ 4. Server applies filters (if any)      │
   │ 5. Server returns list of properties    │
   ├─────────────────────────────────────────┤
   │ Possible Filters (Query Parameters):    │
   │ ?location=DSU&maxPrice=8000&sharing=... │
   ├─────────────────────────────────────────┤
   │ Example Response:                       │
   │ [                                       │
   │   {                                     │
   │     "id": "prop_1",                     │
   │     "title": "Cozy 2-BHK near DSU",    │
   │     "price": 7500,                      │
   │     "location": "Harohalli",            │
   │     "images": ["img1.jpg", "img2.jpg"], │
   │     "rating": 4.5,                      │
   │     "owner": "PG Owner Name"            │
   │   },                                    │
   │   { ... more properties ... }           │
   │ ]                                       │
   └─────────────────────────────────────────┘

5. GET SINGLE PROPERTY (Property Details)
   ┌─────────────────────────────────────────┐
   │ GET /api/properties/:id                 │
   │ (Example: /api/properties/prop_1)       │
   ├─────────────────────────────────────────┤
   │ What happens:                           │
   │ 1. Student clicks property from list    │
   │ 2. App requests: details of this        │
   │    specific property                    │
   │ 3. Server queries database with ID      │
   │ 4. Server returns ALL details           │
   ├─────────────────────────────────────────┤
   │ Example Response:                       │
   │ {                                       │
   │   "id": "prop_1",                       │
   │   "title": "Cozy 2-BHK near DSU",      │
   │   "description": "Safe location...",    │
   │   "price": 7500,                        │
   │   "location": "Harohalli",              │
   │   "address": "123 Main St, Harohalli",  │
   │   "amenities": [                        │
   │     "WiFi (100 Mbps)",                  │
   │     "Mess included",                    │
   │     "24/7 Water",                       │
   │     "AC"                                │
   │   ],                                    │
   │   "sharingType": "double",              │
   │   "roomsAvailable": 2,                  │
   │   "images": ["img1.jpg", ...],          │
   │   "virtualTour": "360_tour_link",       │
   │   "owner": {                            │
   │     "name": "Owner Name",               │
   │     "phone": "9876543210",              │
   │     "responseRate": "95%",              │
   │     "joinDate": "2025-01-01"            │
   │   },                                    │
   │   "reviews": [                          │
   │     {                                   │
   │       "author": "Student Name",         │
   │       "rating": 4.5,                    │
   │       "tags": ["Good WiFi", "Safe"],   │
   │       "text": "Excellent location..."   │
   │     },                                  │
   │     { ... more reviews ... }            │
   │   ],                                    │
   │   "averageRating": 4.4,                 │
   │   "totalReviews": 23                    │
   │ }                                       │
   └─────────────────────────────────────────┘

6. CREATE PROPERTY LISTING (Owner Only)
   ┌─────────────────────────────────────────┐
   │ POST /api/properties                    │
   ├─────────────────────────────────────────┤
   │ What happens:                           │
   │ 1. PG Owner logs in                     │
   │ 2. Fills form: title, price, amenities  │
   │ 3. Clicks "Publish Listing"             │
   │ 4. App sends all data to server         │
   │ 5. Server validates all fields          │
   │ 6. Server stores in database            │
   │ 7. Property goes LIVE                   │
   ├─────────────────────────────────────────┤
   │ Example Request:                        │
   │ {                                       │
   │   "title": "3-BHK Flat",                │
   │   "description": "New flat...",         │
   │   "price": 8000,                        │
   │   "location": "Harohalli",              │
   │   "amenities": ["WiFi", "AC", "Mess"],  │
   │   "sharingType": "double",              │
   │   "roomsAvailable": 2,                  │
   │   "images": ["cloudinary_url_1", ...]   │
   │ }                                       │
   ├─────────────────────────────────────────┤
   │ Example Response:                       │
   │ {                                       │
   │   "id": "prop_99",                      │
   │   "status": "created",                  │
   │   "message": "Property listed! ✅"      │
   │ }                                       │
   └─────────────────────────────────────────┘
```

### Booking Endpoints

```
7. CREATE BOOKING (Book a Property)
   ┌─────────────────────────────────────────┐
   │ POST /api/bookings                      │
   ├─────────────────────────────────────────┤
   │ What happens:                           │
   │ 1. Student clicks "Book Now"            │
   │ 2. App sends booking request            │
   │ 3. Server validates:                    │
   │    - Is student verified? ✓             │
   │    - Is property available? ✓           │
   │ 4. Server sends to Razorpay             │
   │ 5. Razorpay creates payment order       │
   │ 6. Server returns payment link          │
   │ 7. Student pays via UPI/Card            │
   │ 8. Razorpay confirms payment            │
   │ 9. Server creates booking in database   │
   │ 10. Student sees "✅ Booked!"           │
   ├─────────────────────────────────────────┤
   │ Example Request:                        │
   │ {                                       │
   │   "propertyId": "prop_1",               │
   │   "studentId": "student_123",           │
   │   "moveInDate": "2025-12-15",           │
   │   "tokenAmount": 2000                   │
   │ }                                       │
   ├─────────────────────────────────────────┤
   │ Example Response:                       │
   │ {                                       │
   │   "bookingId": "book_1",                │
   │   "razorpayOrderId": "order_abc123",    │
   │   "paymentLink": "https://razorpay...", │
   │   "amount": 2000,                       │
   │   "message": "Complete payment ✅"      │
   │ }                                       │
   │                                         │
   │ (Student clicks link, pays on Razorpay)│
   └─────────────────────────────────────────┘

8. CONFIRM BOOKING (After Payment)
   ┌─────────────────────────────────────────┐
   │ POST /api/bookings/:id/confirm          │
   ├─────────────────────────────────────────┤
   │ What happens:                           │
   │ 1. Razorpay confirms payment successful │
   │ 2. App tells server: "Payment done!"    │
   │ 3. Server updates booking status        │
   │ 4. Server sends WhatsApp to student     │
   │ 5. Server sends WhatsApp to owner       │
   │ 6. Booking is now CONFIRMED             │
   ├─────────────────────────────────────────┤
   │ Example Response:                       │
   │ {                                       │
   │   "status": "confirmed",                │
   │   "ownerPhone": "9876543210",           │
   │   "navigationVideo": "video_link",      │
   │   "message": "Owner contacted! ✅"      │
   │ }                                       │
   └─────────────────────────────────────────┘

9. GET MY BOOKINGS (Student View)
   ┌─────────────────────────────────────────┐
   │ GET /api/bookings/student/:studentId    │
   ├─────────────────────────────────────────┤
   │ What happens:                           │
   │ 1. Student clicks "My Bookings"         │
   │ 2. App requests: all my bookings        │
   │ 3. Server queries database              │
   │ 4. Server filters: only THIS student    │
   │ 5. Server returns all student bookings  │
   ├─────────────────────────────────────────┤
   │ Example Response:                       │
   │ [                                       │
   │   {                                     │
   │     "bookingId": "book_1",              │
   │     "propertyName": "Cozy 2-BHK",       │
   │     "moveInDate": "2025-12-15",         │
   │     "status": "confirmed",              │
   │     "amount": 2000,                     │
   │     "ownerPhone": "9876543210"          │
   │   },                                    │
   │   { ... more bookings ... }             │
   │ ]                                       │
   └─────────────────────────────────────────┘
```

### Review Endpoints

```
10. CREATE REVIEW (Leave Feedback)
    ┌─────────────────────────────────────────┐
    │ POST /api/reviews                       │
    ├─────────────────────────────────────────┤
    │ What happens:                           │
    │ 1. 7 days after booking, student gets   │
    │    notification: "Leave a review?"      │
    │ 2. Student clicks, fills form           │
    │ 3. Student selects tags:                │
    │    - "Good WiFi" ✓                      │
    │    - "Safe at Night" ✓                  │
    │    - "Hygienic Mess" ✓                  │
    │ 4. Student rates: 4.5 stars             │
    │ 5. Clicks "Submit"                      │
    │ 6. Server stores review in database     │
    │ 7. Average rating updates automatically │
    ├─────────────────────────────────────────┤
    │ Example Request:                        │
    │ {                                       │
    │   "propertyId": "prop_1",               │
    │   "bookingId": "book_1",                │
    │   "rating": 4.5,                        │
    │   "tags": [                             │
    │     "Good WiFi",                        │
    │     "Safe at Night",                    │
    │     "Hygienic Mess"                     │
    │   ],                                    │
    │   "title": "Great place to stay",       │
    │   "description": "Owner is responsive..." │
    │ }                                       │
    ├─────────────────────────────────────────┤
    │ Example Response:                       │
    │ {                                       │
    │   "reviewId": "review_1",               │
    │   "status": "published",                │
    │   "message": "Review posted! ✅"        │
    │ }                                       │
    └─────────────────────────────────────────┘

11. GET PROPERTY REVIEWS
    ┌─────────────────────────────────────────┐
    │ GET /api/reviews/property/:propertyId   │
    ├─────────────────────────────────────────┤
    │ What happens:                           │
    │ 1. On property details page             │
    │ 2. App requests: all reviews            │
    │ 3. Server returns reviews for property  │
    │ 4. Shows average rating                 │
    │ 5. Shows sentiment tags                 │
    ├─────────────────────────────────────────┤
    │ Example Response:                       │
    │ {                                       │
    │   "propertyId": "prop_1",               │
    │   "averageRating": 4.4,                 │
    │   "totalReviews": 23,                   │
    │   "reviews": [                          │
    │     {                                   │
    │       "author": "Raj Kumar",            │
    │       "rating": 4.5,                    │
    │       "date": "2025-11-20",             │
    │       "tags": [                         │
    │         "Good WiFi",                    │
    │         "Safe at Night"                 │
    │       ],                                │
    │       "text": "Excellent location..."   │
    │     },                                  │
    │     { ... more reviews ... }            │
    │   ]                                     │
    │ }                                       │
    └─────────────────────────────────────────┘
```

### Payment Endpoints

```
12. CREATE PAYMENT ORDER
    ┌─────────────────────────────────────────┐
    │ POST /api/payments/create-order         │
    ├─────────────────────────────────────────┤
    │ What happens:                           │
    │ 1. Student clicks "Pay Now"             │
    │ 2. App sends to server                  │
    │ 3. Server sends to Razorpay             │
    │ 4. Razorpay creates order               │
    │ 5. Server returns order ID              │
    │ 6. Student sees payment options         │
    ├─────────────────────────────────────────┤
    │ Example Request:                        │
    │ {                                       │
    │   "bookingId": "book_1",                │
    │   "amount": 2000                        │
    │ }                                       │
    ├─────────────────────────────────────────┤
    │ Example Response:                       │
    │ {                                       │
    │   "orderId": "order_abc123",            │
    │   "amount": 2000,                       │
    │   "currency": "INR",                    │
    │   "paymentUrl": "https://razorpay..."   │
    │ }                                       │
    └─────────────────────────────────────────┘

13. VERIFY PAYMENT
    ┌─────────────────────────────────────────┐
    │ POST /api/payments/verify               │
    ├─────────────────────────────────────────┤
    │ What happens:                           │
    │ 1. Student completes payment            │
    │ 2. Razorpay confirms ✓                  │
    │ 3. App sends to server:                 │
    │    "I have payment confirmation"        │
    │ 4. Server verifies with Razorpay        │
    │ 5. Server updates booking as PAID       │
    │ 6. Server updates database              │
    ├─────────────────────────────────────────┤
    │ Example Request:                        │
    │ {                                       │
    │   "razorpay_payment_id": "pay_abc...",  │
    │   "razorpay_order_id": "order_abc...",  │
    │   "razorpay_signature": "sig_abc..."    │
    │ }                                       │
    ├─────────────────────────────────────────┤
    │ Example Response:                       │
    │ {                                       │
    │   "verified": true,                     │
    │   "status": "paid",                     │
    │   "message": "Payment confirmed! ✅"    │
    │ }                                       │
    └─────────────────────────────────────────┘
```

### Admin Endpoints

```
14. GET DASHBOARD STATS
    ┌─────────────────────────────────────────┐
    │ GET /api/admin/stats                    │
    ├─────────────────────────────────────────┤
    │ What happens:                           │
    │ 1. Admin logs in to dashboard           │
    │ 2. App requests statistics              │
    │ 3. Server queries database              │
    │ 4. Server counts/sums important data    │
    │ 5. Server returns dashboard data        │
    ├─────────────────────────────────────────┤
    │ Example Response:                       │
    │ {                                       │
    │   "totalUsers": 1250,                   │
    │   "totalProperties": 85,                │
    │   "totalBookings": 342,                 │
    │   "pendingVerifications": 12,           │
    │   "totalRevenue": 684000,               │
    │   "averageBookingValue": 2000,          │
    │   "thisMonthBookings": 45,              │
    │   "fraudCasesReported": 3               │
    │ }                                       │
    └─────────────────────────────────────────┘

15. VERIFY PROPERTY (Admin)
    ┌─────────────────────────────────────────┐
    │ POST /api/admin/properties/:id/verify   │
    ├─────────────────────────────────────────┤
    │ What happens:                           │
    │ 1. Owner uploads property               │
    │ 2. Goes to "Pending Verification"       │
    │ 3. Admin clicks "Verify"                │
    │ 4. Admin checks photos, details         │
    │ 5. Admin clicks "Approve"               │
    │ 6. Server updates property status       │
    │ 7. Property goes LIVE                   │
    │ 8. Owner gets notification              │
    ├─────────────────────────────────────────┤
    │ Example Response:                       │
    │ {                                       │
    │   "propertyId": "prop_1",               │
    │   "status": "verified",                 │
    │   "message": "Property verified! ✅"    │
    │ }                                       │
    └─────────────────────────────────────────┘

16. BLACKLIST PROPERTY
    ┌─────────────────────────────────────────┐
    │ POST /api/admin/properties/:id/blacklist│
    ├─────────────────────────────────────────┤
    │ What happens:                           │
    │ 1. Multiple fraud complaints received   │
    │ 2. Admin review confirms fraud          │
    │ 3. Admin clicks "Blacklist"             │
    │ 4. Server marks property as blacklisted │
    │ 5. Property hidden from search          │
    │ 6. Owner notified of blacklist reason   │
    ├─────────────────────────────────────────┤
    │ Example Response:                       │
    │ {                                       │
    │   "propertyId": "prop_1",               │
    │   "status": "blacklisted",              │
    │   "reason": "Multiple fraud reports",   │
    │   "message": "Property blacklisted! ⛔" │
    │ }                                       │
    └─────────────────────────────────────────┘
```

---

## 🎓 Understanding API Status Codes

When you make an API request, you get a status code that tells you what happened:

```
✅ 200 OK - "Everything worked!"
   Example: GET properties → Returns list

✅ 201 Created - "New data was created!"
   Example: POST booking → Booking created

❌ 400 Bad Request - "I don't understand your request"
   Example: Missing required fields

❌ 401 Unauthorized - "You must login first"
   Example: Accessing /api/admin without login

❌ 403 Forbidden - "You don't have permission"
   Example: Student trying to verify property (admin only)

❌ 404 Not Found - "That doesn't exist"
   Example: Searching for property that was deleted

❌ 500 Server Error - "Something broke on our end"
   Example: Database connection failed
```

---

## 🔐 Why APIs Are Secure

### How APIs Protect Your Data

```
WITHOUT API (❌ Dangerous):
┌──────────────┐         Direct        ┌──────────────┐
│  Your Phone  │─────────Access────────│  Database    │
└──────────────┘                       └──────────────┘
Anyone can access the database directly!
Your personal data is exposed!

WITH API (✅ Secure):
┌──────────────┐      Request      ┌──────────────┐
│  Your Phone  │──────────────────→│     API      │
└──────────────┘                   │   (Server)   │
                                   │              │
                                   │ • Validates  │
                                   │ • Checks     │
                                   │   permissions│
                                   │ • Encrypts   │
                                   │ • Sanitizes  │
                                   └──────┬───────┘
                                          │
                                          ▼
                                   ┌──────────────┐
                                   │  Database    │
                                   └──────────────┘

The API acts as a security guard!
- Only allows authorized requests
- Only returns data you should see
- Blocks malicious requests
```

### Protection Mechanisms

```
1. AUTHENTICATION
   "Are you who you say you are?"
   ✓ Login with email + password
   ✓ Get JWT token (proof of identity)
   ✓ Include token with every request

2. AUTHORIZATION
   "Do you have permission to do this?"
   ✓ Admin can verify properties
   ✓ Student cannot delete other's reviews
   ✓ Owner can only see own bookings

3. ENCRYPTION
   "Is your data scrambled?"
   ✓ Password hashed (cannot be read)
   ✓ Phone number encrypted
   ✓ All data in transit encrypted (HTTPS)

4. VALIDATION
   "Is the request valid?"
   ✓ Email format correct?
   ✓ Price is a number?
   ✓ Phone has 10 digits?
```

---

## 💡 Why Do We Use APIs? (The Benefits)

### 1. **Separation of Concerns**
```
Without APIs (Messy):
Everything mixed together = Hard to fix bugs = Slow development

With APIs (Clean):
Frontend team → API team → Backend team → Database team
Each team does their job independently
```

### 2. **Security**
```
Without APIs: Database exposed to everyone
With APIs: Database hidden, API filters all requests
```

### 3. **Scalability**
```
Without APIs: Thousands of direct DB connections = System crashes
With APIs: API server handles all connections efficiently
```

### 4. **Reusability**
```
Same API can be used by:
- Website
- Mobile App
- Desktop App
- Smart Watch
- Chatbot
All using the SAME backend code!
```

### 5. **Third-Party Integration**
```
API allows us to connect with:
- Razorpay (Payments)
- Cloudinary (Image hosting)
- Twilio (WhatsApp)
- Google Maps
All through simple API calls
```

---

## 📞 How the Payment API Works (Complete Example)

### Real-World Scenario: Student Books a Property

```
TIMELINE OF API CALLS:

T=0:00  STUDENT OPENS APP
        ↓
        GET /api/properties
        Response: [Property 1, Property 2, ...]
        ↓
        Student sees list on screen ✅

T=0:15  STUDENT CLICKS PROPERTY
        ↓
        GET /api/properties/prop_1
        Response: { title, price, images, reviews, owner, ... }
        ↓
        Student sees details on screen ✅

T=2:00  STUDENT CLICKS "BOOK NOW"
        ↓
        POST /api/bookings
        Request: { propertyId, studentId, moveInDate, tokenAmount: 2000 }
        ↓
        Server validates (Student verified? ✓ Property available? ✓)
        ↓
        Server calls → POST to Razorpay API (External service)
        ↓
        Razorpay returns: orderId, paymentLink
        ↓
        Server Response: { paymentLink: "https://razorpay..." }
        ↓
        Student sees "Pay Now" button ✅

T=2:30  STUDENT CLICKS "PAY NOW"
        ↓
        Redirected to Razorpay payment page
        ↓
        Student pays ₹2,000 via UPI ✓
        ↓
        Razorpay processes payment
        ↓
        Razorpay automatically splits:
        - ₹500 → Orbit (Commission)
        - ₹1,500 → Owner's account (Tomorrow)

T=2:35  RAZORPAY SENDS WEBHOOK TO ORBIT
        ↓
        POST /api/payments/webhook
        Data: { orderId, paymentId, status: "success" }
        ↓
        Server verifies payment
        ↓
        Server updates booking status → "CONFIRMED"
        ↓
        Server saves to database

T=2:36  SERVER SENDS NOTIFICATIONS
        ↓
        POST /api/whatsapp/send
        To Student: "✅ Booking confirmed! Owner: 9876543210"
        ↓
        POST /api/whatsapp/send
        To Owner: "📩 New booking for 2 rooms! Student: Raj Kumar"

T=2:40  STUDENT SEES CONFIRMATION
        ↓
        App shows: "✅ Booking Confirmed!"
        ↓
        Student can see:
        - Owner's phone number
        - Navigation video
        - Move-in date
        - Booking reference

SUCCESS! 🎉
The entire flow happened in ~2 minutes using multiple APIs!
```

---

## 🎯 Summary: Everything You Need to Know

| Concept | Simple Explanation |
|---------|-------------------|
| **API** | A messenger between your app and the server |
| **Endpoint** | A specific job the API can do |
| **Request** | You asking the API for something |
| **Response** | The API giving you the answer |
| **Database** | Where all information is stored |
| **GET** | Asking for information (read only) |
| **POST** | Sending new information to store |
| **PUT/PATCH** | Changing existing information |
| **DELETE** | Removing information |
| **Status Code** | A number telling you if it worked (200=yes, 404=not found) |
| **Token/JWT** | Your login proof (like a ticket) |
| **Encryption** | Making information unreadable to hackers |

---

## ❓ Frequently Asked Questions

**Q: Why can't students see the database directly?**
A: Because they might accidentally (or intentionally) delete important data. The API acts like a security guard.

**Q: Why do we need so many endpoints?**
A: Each endpoint does ONE specific job. This makes the system more organized and secure.

**Q: What if the API breaks?**
A: Users can't access the system. This is why we monitor it 24/7 and have backup systems.

**Q: Can someone hack the API?**
A: Possible but rare. We use:
- Passwords hashing (encrypted)
- HTTPS (encrypted connection)
- JWT tokens (proof of identity)
- Request validation (reject bad requests)

**Q: Why do we use Razorpay instead of direct bank transfers?**
A: Razorpay:
- Handles all payment security
- Automatic settlement
- Fraud protection
- Easy integration
- Legal compliance

**Q: Can I use the same API for my website AND mobile app?**
A: YES! That's the beauty of APIs. Both can use the same server.

---

## 🚀 Next Steps for Non-Technical Team

### What You Need to Know:

1. **APIs are NOT the final product** - They're the infrastructure
2. **User sees the App** - App talks to API - API talks to Database
3. **Each service (Razorpay, Cloudinary, etc.)** has its own API
4. **We're combining all these** into one seamless experience

### For Investors/Partners:

- **Orbit has 16+ API endpoints** = Feature-rich platform
- **Multiple third-party APIs** = Built on proven infrastructure
- **Cost-effective** = Using free/freemium tiers where possible
- **Scalable** = Can handle 100,000+ users without redesign

### For Team Members:

- **Frontend Team:** Uses APIs to display data (fetches data, sends requests)
- **Backend Team:** Builds APIs (creates endpoints, validates, stores data)
- **Database Team:** Manages data storage (maintains MongoDB)
- **Admin Team:** Uses APIs to moderate (verify properties, handle complaints)

---

**Document Created:** November 26, 2025  
**Target Audience:** Non-technical stakeholders  
**Difficulty Level:** Beginner-Friendly 🟢  

*Share this with anyone who needs to understand how Orbit works!*

---

END OF DOCUMENT
