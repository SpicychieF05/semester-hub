# 🎓 Semester Hub

[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](https://github.com/SpicychieF05/semester-hub)
[![React](https://img.shields.io/badge/React-18.2.0-61DAFB.svg)](https://reactjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-00C896.svg)](https://supabase.com/)

**Your premier platform for sharing and accessing academic notes. Empowering students through collaborative learning and knowledge sharing.**

## ✨ Features

### 🚀 **Core Functionality**
- **📚 Note Sharing**: Upload, browse, and download academic notes
- **🔐 User Authentication**: Secure login and registration system
- **👨‍💼 Admin Dashboard**: Complete content management system
- **🔄 Real-time Sync**: Auto-updates across all connected clients
- **📱 Responsive Design**: Perfect experience on all devices

### 🎯 **Advanced Features**
- **🏫 Multi-Department Support**: Organize notes by departments and subjects
- **📋 Content Moderation**: Admin approval system for quality control
- **⚡ Fast Search**: Quick note discovery and filtering
- **🎨 Modern UI**: Clean, professional interface with smooth animations
- **🔒 Secure Storage**: Supabase backend with RLS policies

## 🛠️ Tech Stack

- **Frontend**: React 18.2.0 + Tailwind CSS 3.1.6
- **Backend**: Supabase (PostgreSQL + Real-time + Auth + Storage)
- **Deployment**: Vercel with optimized configuration
- **Icons**: Lucide React
- **Styling**: Custom animations and responsive design


### 🌐 Database Schema

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   departments   │    │    semesters    │    │    subjects     │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ id (PK)         │    │ id (PK)         │    │ id (PK)         │
│ name            │    │ name            │    │ name            │
│ code (UNIQUE)   │    │ number          │    │ code            │
│ description     │    │ created_at      │    │ department_id   │◄──┐
│ created_at      │    └─────────────────┘    │ semester_id     │◄─┐│
└─────────────────┘                           │ created_at      │  ││
         ▲                                    └─────────────────┘  ││
         │                                             ▲           ││
         │                                             │           ││
         │                    ┌─────────────────┐      │           ││
         │                    │     notes       │      │           ││
         │                    ├─────────────────┤      │           ││
         │                    │ id (PK)         │      │           ││
         │                    │ title           │      │           ││
         │                    │ description     │      │           ││
         │                    │ file_url        │      │           ││
         │                    │ file_name       │      │           ││
         │                    │ file_size       │      │           ││
         └────────────────────┤ department_id   │      │           ││
                              │ subject_id      │──────┘           ││
              ┌───────────────┤ semester_id     │──────────────────┘│
              │               │ uploader_name   │                   │
              │               │ uploader_email  │                   │
              │               │ status          │                   │
              │               │ created_at      │                   │
              │               └─────────────────┘                   │
              │                                                     │
              └─────────────────────────────────────────────────────┘

Storage:
┌─────────────────┐
│ notes (bucket)  │ ──► File storage for uploaded notes
├─────────────────┤
│ • PDF files     │
│ • Images        │ 
│ • Documents     │
└─────────────────┘
```

## 🚀 Local Development

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Test production build locally
npm install -g serve
serve -s build
```

## 📁 Project Structure

```
semester-hub/
├── 📁 public/                 # Static assets
│   ├── images/               # Logos, favicon, hero image
│   ├── index.html           # HTML template
│   └── manifest.json        # PWA configuration
├── 📁 src/
│   ├── 📁 components/        # Reusable components
│   │   ├── Footer.js        # Site footer
│   │   ├── LoadingSpinner.js # Loading animations
│   │   ├── Navbar.js        # Navigation bar
│   │   └── ProtectedAdminRoute.js # Admin route protection
│   ├── 📁 pages/            # Page components
│   │   ├── AdminDashboard.js # Admin panel
│   │   ├── AdminLogin.js    # Admin authentication
│   │   ├── BrowseNotes.js   # Note browsing
│   │   ├── HomePage.js      # Landing page
│   │   ├── Login.js         # User login
│   │   ├── Register.js      # User registration
│   │   └── ShareNotes.js    # Note upload
│   ├── App.js               # Main app component
│   ├── index.js             # React entry point
│   ├── index.css            # Global styles
│   └── supabase.js          # Supabase configuration
├── vercel.json              # Vercel deployment config
├── tailwind.config.js       # Tailwind CSS config
└── package.json             # Dependencies and scripts
```

## 🎨 Key Components

### 🏠 **HomePage**
- Hero section with animated image
- Feature highlights
- Call-to-action buttons

### 📚 **BrowseNotes**
- Real-time note updates
- Advanced filtering by department/subject/semester
- Secure file downloads

### 📤 **ShareNotes**
- File upload with validation
- Metadata collection
- Admin approval workflow

### 👨‍💼 **AdminDashboard**
- Real-time content management
- User statistics
- Bulk operations

## 🔄 Real-time Features

The application includes comprehensive real-time synchronization:

- **Auto-sync**: Changes appear instantly across all clients
- **Live Updates**: New notes, approvals, and deletions sync automatically
- **Real-time Dashboard**: Admin panel updates without refresh
- **Optimistic Updates**: Immediate UI feedback with rollback on error

## 🚀 Performance Optimizations

- **Code Splitting**: Lazy loading for optimal bundle size
- **Image Optimization**: Compressed assets and modern formats
- **Caching**: Strategic browser and CDN caching
- **Bundle Analysis**: Optimized build output (114.41kB JS, 7.63kB CSS)

## 🔒 Security Features

- **Row Level Security**: Database-level access control
- **File Upload Validation**: Size and type restrictions
- **Admin Authentication**: Secure admin access
- **CORS Configuration**: Proper cross-origin handling

## 📱 Mobile Responsiveness

- **Responsive Design**: Optimized for all screen sizes
- **Touch-friendly**: Mobile-optimized interactions
- **Performance**: Fast loading on mobile networks
- **PWA Ready**: Progressive Web App capabilities

## 🎯 Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers

## 🚀 Deployment Instructions

### For Vercel (Recommended)

1. **Automatic Deployment**:
   - Connect your GitHub repository to Vercel
   - Set environment variables in Vercel dashboard
   - Deploy automatically on each push

2. **Environment Variables in Vercel**:
   ```
   REACT_APP_SUPABASE_URL = your_supabase_url
   REACT_APP_SUPABASE_ANON_KEY = your_supabase_anon_key
   ```

3. **Custom Domain** (Optional):
   - Add your custom domain in Vercel settings
   - Update `REACT_APP_SITE_URL` environment variable

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🐛 Troubleshooting

### Common Issues

1. **Build Errors**: Ensure all dependencies are installed with `npm install`
2. **Supabase Connection**: Verify environment variables are set correctly
3. **Admin Access**: Make sure admin user is properly configured in Supabase
4. **File Upload Issues**: Check Supabase storage bucket permissions

### Support

If you encounter any issues:
1. Check the browser console for error messages
2. Verify Supabase configuration and policies
3. Ensure all environment variables are set
4. Create an issue on GitHub with detailed error information

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Developer

**Chirantan Mallick**
- LinkedIn: [Chirantan Mallick](https://www.linkedin.com/in/chirantan-mallick)
- Linktree: [Chirantan Mallick](https://linktr.ee/chirantan_mallick)

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - UI Framework
- [Supabase](https://supabase.com/) - Backend Platform  
- [Tailwind CSS](https://tailwindcss.com/) - CSS Framework
- [Lucide](https://lucide.dev/) - Icon Library
- [Vercel](https://vercel.com/) - Deployment Platform

---

⭐ **Star this repo if you find it helpful!** ⭐

**Live Demo**: [https://semesterhub.vercel.app](https://semesterhub.vercel.app)
