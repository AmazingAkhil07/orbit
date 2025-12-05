# 🏠 Orbit - Student Housing Marketplace

**Project**: Hyper-localized student housing platform connecting students with verified property owners.  
**Status**: 🟢 In Active Development (Admin Dashboard ✅ Complete | Owner Dashboard 70% Complete)  
**Last Updated**: December 5, 2025

---

## 📊 Project Progress

### Completed Features (✅)
- **Admin Dashboard** - Full property management, user verification, booking oversight
- **User Authentication** - Role-based login (User/Owner/Admin)
- **Property Listings** - Properties management and search
- **Audit Logging** - Complete audit trail for admin actions

### In Progress (⏳)
- **Owner Dashboard** - Property management, add new properties (70% complete)
  - Multi-step property addition wizard
  - Document verification system
  - Property analytics
  
### Coming Soon (📅)
- Payment gateway integration (Razorpay)
- User booking system
- Review & rating system
- Chat/messaging system
- Mobile app version

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- MongoDB Atlas account
- Cloudinary account (for image hosting)
- NextAuth.js configured

### Installation

```bash
# Install dependencies
npm install

# Setup environment variables (copy from .env.example)
cp .env.example .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## 🔐 Demo Credentials

**User Account:**
- Email: `user@orbit.com`
- Password: `password`

**Owner Account:**
- Email: `owner@orbit.com`
- Password: `password`

**Admin Account:**
- Email: (Available in admin setup)
- Password: (Available in admin setup)

---

## 📁 Project Structure

```
orbit-clone/
├── src/
│   ├── app/
│   │   ├── admin/           # Admin dashboard pages
│   │   ├── owner/           # Owner dashboard pages
│   │   ├── auth/            # Authentication pages
│   │   └── api/             # API routes
│   ├── components/          # Reusable React components
│   ├── models/              # MongoDB schemas
│   └── lib/                 # Utilities & helpers
├── public/                  # Static assets
└── docs/                    # Documentation
```

---

## 📚 Documentation

Comprehensive documentation files are available:

- **[OWNER_DASHBOARD_IMPLEMENTATION_PLAN.md](./OWNER_DASHBOARD_IMPLEMENTATION_PLAN.md)** - Owner dashboard development plan
- **[ADMIN_DASHBOARD_COMPLETE.md](./ADMIN_DASHBOARD_COMPLETE.md)** - Admin dashboard documentation
- **[ORBIT_PG_DATABASE_DOCUMENTATION.md](./ORBIT_PG_DATABASE_DOCUMENTATION.md)** - Complete technical & business docs
- **[API_AND_SERVICES_DOCUMENTATION.md](./API_AND_SERVICES_DOCUMENTATION.md)** - API reference & services guide
- **[PROPERTY_VERIFICATION_GUIDE.md](./PROPERTY_VERIFICATION_GUIDE.md)** - Property verification process

---

## 🛠 Tech Stack

- **Frontend**: Next.js 16, React, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Next.js API Routes
- **Database**: MongoDB Atlas
- **Authentication**: NextAuth.js
- **Image Hosting**: Cloudinary
- **Styling**: Tailwind CSS with custom design system

---

## 📞 Support

For questions or issues, please refer to the comprehensive documentation files or contact the development team.
