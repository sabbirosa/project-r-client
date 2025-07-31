# 🩸 LifeSaver - Blood Donation Management System (Client)

A modern, responsive web application that connects blood donors with those in need, facilitating safe and efficient blood donation processes across Bangladesh.

## 🌐 Live Demo & Admin Access

- **Live Site URL**: [https://lifesaver-blood-donation.netlify.app](https://lifesaver-blood-donation.netlify.app)
- **Admin Username**: admin@lifesaver.com
- **Admin Password**: Admin@123456
- **Backend API**: [https://project-r-server.vercel.app](https://project-r-server.vercel.app)

## ✨ Key Features

• **🔐 Secure Authentication System** - JWT-based authentication with role-based access control (Admin, Donor, Volunteer)

• **🩸 Smart Blood Request Management** - Create, edit, and track blood donation requests with real-time status updates

• **👥 Comprehensive User Management** - Admin panel for managing users, updating roles, and blocking/unblocking accounts

• **📍 Location-Based Search** - Find donors by blood group, district, and upazila across all 64 districts of Bangladesh

• **📊 Real-Time Analytics Dashboard** - Visual charts and statistics for donation trends, user growth, and blood group distribution

• **📝 Content Management System** - Rich text editor for creating and managing blog posts with draft/published workflow

• **💳 Integrated Payment System** - Stripe-powered donation system for supporting blood donation organizations

• **📱 Fully Responsive Design** - Optimized for mobile, tablet, and desktop devices with modern UI/UX

• **🔍 Advanced Filtering & Pagination** - Efficient data browsing with status filters and pagination across all listings

• **🚫 Account Security Features** - Blocked user restrictions, session persistence, and automatic logout protection

• **📈 Performance Optimized** - TanStack Query for efficient data fetching, caching, and real-time updates

• **🎨 Modern UI Components** - Beautiful animations with Framer Motion and comprehensive component library

## 🛠️ Technology Stack

### Frontend Core
- **React 19** - Latest React with modern hooks and concurrent features
- **React Router 7** - Client-side routing with nested layouts
- **TanStack Query 5** - Server state management and data fetching
- **React Hook Form** - Performant forms with validation

### Styling & UI
- **Tailwind CSS 4** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **React Icons** - Comprehensive icon library
- **Jodit React** - Rich text editor for blog content

### State Management & API
- **Axios** - HTTP client with interceptors
- **React Context** - Global authentication state
- **Custom Hooks** - Reusable API logic and business logic

### External Services
- **Cloudinary** - Image upload and optimization
- **Stripe** - Payment processing
- **React Toastify** - User notifications

### Development Tools
- **Vite** - Fast build tool and dev server
- **ESLint** - Code linting and formatting
- **Modern JavaScript** - ES6+ features and async/await

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Modern web browser
- Backend server running (see server README)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/project-r.git
cd project-r/project-r-client
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:8000
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

4. **Start development server**
```bash
npm run dev
```

5. **Build for production**
```bash
npm run build
```

## 🗂️ Project Structure

```
src/
├── api/                 # API hooks and services
│   ├── useAuthAPI.jsx      # Authentication API calls
│   ├── useDonationAPI.jsx  # Donation request management
│   ├── useAdminAPI.jsx     # Admin operations
│   ├── useFundingAPI.jsx   # Payment and funding
│   └── usePublicAPI.jsx    # Public data and image upload
├── components/          # Reusable UI components
│   ├── ui/                 # Base UI components
│   ├── shared/             # Shared layout components
│   └── charts/             # Analytics components
├── contexts/           # React Context providers
├── hooks/              # Custom React hooks
├── pages/              # Page components
├── routes/             # Routing configuration
├── utils/              # Utility functions
├── constants/          # App constants and data
└── data/               # Static data (districts, upazilas)
```

## 👥 User Roles & Permissions

### 🔴 Admin (Full Access)
- Manage all users (block/unblock, change roles)
- View comprehensive analytics dashboard
- Manage all donation requests
- Create, edit, publish/unpublish, and delete blogs
- View funding records and statistics
- Access all system features

### 🟡 Volunteer (Limited Access)
- View analytics dashboard
- Manage donation request status updates
- Create and edit blog posts
- View funding statistics
- Cannot delete blogs or manage users

### 🟢 Donor (User Access)
- Create and manage own donation requests
- Update personal profile information
- Search for other donors
- View and respond to donation requests
- Make funding donations
- Read published blog posts

## 🎯 Key Features Details

### Blood Request Management
- Create detailed donation requests with recipient information
- Track request status: Pending → In Progress → Done/Canceled
- Edit requests before they're confirmed by donors
- Real-time status updates and notifications

### User Management (Admin)
- Comprehensive user listing with filtering
- Role management (promote donors to volunteers/admins)
- Account status control (active/blocked)
- User statistics and activity tracking

### Search & Discovery
- Advanced donor search by multiple criteria
- Location-based filtering (district/upazila)
- Blood group compatibility matching
- Exportable search results

### Content Management
- Rich text blog editor with formatting options
- Image upload and management
- Draft/published workflow
- SEO-friendly blog URLs

## 🔧 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🌍 Browser Support

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_URL` | Backend API base URL | Yes |
| `VITE_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | Yes |
| `VITE_CLOUDINARY_UPLOAD_PRESET` | Cloudinary upload preset | Yes |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | Yes |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@lifesaver.com or create an issue in the GitHub repository.

---

**Built with ❤️ for saving lives through blood donation**
