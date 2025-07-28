# Semester Hub 🎓

A modern academic platform for sharing and accessing high-quality educational notes with real-time collaboration features.

## 🚀 Features

- **📚 Note Sharing**: Upload and share academic notes with fellow students
- **🔍 Smart Search**: Advanced filtering by subject, department, and semester
- **⚡ Real-time Sync**: Auto-sync functionality with instant updates
- **👥 User Management**: Complete user authentication and admin controls
- **📱 Responsive Design**: Optimized for all devices
- **🎨 Modern UI**: Clean, professional interface with animations

## 🛠️ Tech Stack

- **Frontend**: React 18, Tailwind CSS, Lucide React
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Deployment**: Vercel
- **Real-time**: Supabase Realtime subscriptions

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/SpicychieF05/semester-hub.git
   cd semester-hub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your actual Supabase credentials
   ```

4. **Start development server**
   ```bash
   npm start
   ```

## 🚀 Deployment to Vercel

### Automatic Deployment
1. Fork this repository
2. Connect your GitHub account to Vercel
3. Import the project in Vercel dashboard
4. Deploy automatically

### Manual Deployment
1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

### Environment Variables for Vercel
Set these in your Vercel dashboard:
- `REACT_APP_SUPABASE_URL`: Your Supabase project URL
- `REACT_APP_SUPABASE_ANON_KEY`: Your Supabase anon key
- `REACT_APP_SITE_URL`: Your deployed site URL

## 🗄️ Database Setup

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project

2. **Run Database Setup**
   ```sql
   -- Execute the SQL in setup-database-safe.sql
   -- This creates all necessary tables and relationships
   ```

3. **Configure RLS Policies**
   - The setup script includes Row Level Security policies
   - Ensure proper authentication flows

## 📱 Features Overview

### For Students
- Browse approved notes by subject/semester
- Download high-quality academic materials
- Share their own notes for approval
- Real-time updates when new content is added

### for Admins
- Review and approve submitted notes
- Manage users and content
- Real-time dashboard with auto-sync
- Complete activity logging

## 🔧 Development

### Available Scripts
- `npm start` - Development server
- `npm build` - Production build
- `npm test` - Run tests
- `npm run build:analyze` - Analyze bundle size

### Project Structure
```
src/
├── components/     # Reusable UI components
├── pages/         # Main application pages
├── hooks/         # Custom React hooks
├── services/      # API services
├── context/       # React context providers
└── utils/         # Utility functions
```

## 🎯 Performance

- **Bundle Size**: ~114KB (gzipped)
- **CSS Size**: ~7.6KB (gzipped)
- **Load Time**: Optimized for fast loading
- **Mobile Performance**: Fully responsive

## 🔒 Security

- Row Level Security (RLS) enabled
- Authentication via Supabase Auth
- Protected admin routes
- Input validation and sanitization

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Developer

Created by **SpicychieF05**
- GitHub: [@SpicychieF05](https://github.com/SpicychieF05)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

**Semester Hub** - Empowering education through collaborative learning! 🎓✨
