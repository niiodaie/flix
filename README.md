# FLIX - Modular Video Platform

A next-generation video sharing platform with personalized LENS feed and creator monetization features. Built with a modular data layer that supports both mock data (for development) and Supabase (for production).

## 🎭 Demo Mode vs Production Mode

FLIX features a **modular data architecture** that allows you to:
- **Demo Mode**: Run completely offline with mock data and localStorage
- **Production Mode**: Connect to Supabase for real backend functionality

Switch between modes using the `NEXT_PUBLIC_ENABLE_SUPABASE` environment variable.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Copy the environment template:
```bash
cp .env.example .env.local
```

For **Demo Mode** (default):
```env
NEXT_PUBLIC_ENABLE_SUPABASE=false
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

For **Production Mode** with Supabase:
```env
NEXT_PUBLIC_ENABLE_SUPABASE=true
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. Run Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` to see FLIX in action!

## 🏗️ Architecture

### Modular Data Layer
```
src/lib/data/
├── index.ts              # Factory that selects driver
├── types.ts              # Shared data types
└── drivers/
    ├── mock.ts           # Mock data + localStorage
    └── supabase.ts       # Supabase integration
```

### Key Features

#### 🎯 LENS Personalization
- **Smart Feed Algorithm**: Personalizes content based on user behavior
- **Interaction Tracking**: Monitors likes, views, dwell time, and follows
- **Tag-Based Recommendations**: Suggests content based on liked video tags
- **Real-time Learning**: Adapts to user preferences over time

#### 💰 Creator Monetization
- **Stripe Tips**: Direct creator tipping with suggested amounts
- **Affiliate Links**: "Shop Now" buttons on videos
- **Sponsored Content**: Marked sponsored videos with targeting
- **Revenue Analytics**: Comprehensive earnings tracking

#### 📊 Creator Dashboard
- **Performance Metrics**: Views, likes, completion rates
- **Earnings Overview**: Tips, affiliate commissions, sponsorships
- **LENS Analytics**: Track personalized feed performance
- **Video Insights**: Individual video performance data

## 🎮 Demo Mode Features

When `NEXT_PUBLIC_ENABLE_SUPABASE=false`:

### Mock Data
- **12 Sample Videos**: Diverse content across categories
- **12 Creator Profiles**: Complete with avatars and bios
- **Sample Comments**: Realistic engagement data
- **Demo User Profile**: Customizable via settings

### Local Persistence
- **Likes & Interactions**: Stored in localStorage
- **Personalization Data**: Tracks your preferences
- **Comments**: Add comments that persist locally
- **Profile Customization**: Edit your demo profile

### UI Features
- **Demo Mode Banner**: Clear indication of offline mode
- **Functional Interactions**: Like, comment, tip (mock)
- **Personalized Feed**: LENS algorithm works with mock data
- **Responsive Design**: Works on desktop and mobile

## 🔧 Production Setup (Supabase)

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Get your project URL and API keys

### 2. Set Up Database
Run the SQL files in your Supabase SQL editor:
```sql
-- Run these in order:
-- 1. supabase/schema.sql (creates tables)
-- 2. supabase/policies.sql (sets up RLS)
```

### 3. Configure Authentication
In your Supabase dashboard:
- **Authentication → URL Configuration**
- Set **Site URL**: `https://your-domain.com`
- Add **Redirect URLs**: `https://your-domain.com/**`

### 4. Environment Variables
Update `.env.local` with your Supabase credentials:
```env
NEXT_PUBLIC_ENABLE_SUPABASE=true
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 5. Deploy
```bash
npm run build
# Deploy to Vercel, Netlify, or your preferred platform
```

## 📱 Pages & Features

### Core Pages
- **`/`** - LENS personalized feed
- **`/explore`** - Trending and discovery
- **`/upload`** - Video upload interface (UI only in demo)
- **`/dashboard`** - Creator analytics and earnings
- **`/profile/[username]`** - User profiles
- **`/settings`** - Account and preferences

### API Routes
- **`/api/lens`** - Personalized feed algorithm
- **`/api/explore`** - Trending content
- **`/api/tips`** - Creator tipping system
- **`/api/creator/dashboard`** - Analytics data
- **`/api/me`** - Current user profile

## 🛠️ Development

### Build & Test
```bash
# Development
npm run dev

# Production build
npm run build

# Start production server
npm start

# Type checking
npm run type-check

# Linting
npm run lint
```

### Adding New Features
1. **Data Layer**: Add methods to both `mock.ts` and `supabase.ts` drivers
2. **Types**: Update `types.ts` with new interfaces
3. **Components**: Use the `repo` from `@/lib/data` for data access
4. **API Routes**: Create endpoints that work with both drivers

### Switching Drivers
The data layer automatically selects the appropriate driver based on the `NEXT_PUBLIC_ENABLE_SUPABASE` environment variable. No code changes needed!

## 🎨 UI Components

### Video Components
- **VideoCard**: Interactive video cards with like/tip buttons
- **VideoPlayer**: Video playback interface
- **LensFeed**: Personalized video feed

### Creator Tools
- **TipDialog**: Beautiful tipping interface
- **Dashboard**: Analytics and earnings overview
- **Upload Interface**: Drag & drop video upload

### Layout
- **Navbar**: Navigation with search and user menu
- **Responsive Grid**: Works on all screen sizes
- **Dark Theme**: Modern dark UI with neon accents

## 🔒 Security & Privacy

### Demo Mode
- All data stays in your browser
- No external API calls
- No personal information collected
- LocalStorage can be cleared anytime

### Production Mode
- Row Level Security (RLS) on all tables
- Secure authentication with Supabase Auth
- API routes protected with proper validation
- HTTPS required for production

## 📈 Analytics & Personalization

### LENS Algorithm
The personalization system tracks:
- **View Duration**: How long users watch videos
- **Completion Rate**: Percentage of video watched
- **Engagement**: Likes, comments, shares
- **Creator Following**: Prioritizes followed creators
- **Tag Preferences**: Learns from liked content tags

### Privacy-First
- Personalization data is anonymized
- Users can clear their data anytime
- Transparent about data usage
- GDPR compliant design

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on push

### Other Platforms
- **Netlify**: Works with static export
- **Railway**: Full-stack deployment
- **DigitalOcean**: App Platform deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes to both mock and Supabase drivers
4. Test in both demo and production modes
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Support

- **Demo Issues**: Check browser console for errors
- **Production Issues**: Verify Supabase configuration
- **Build Issues**: Ensure all environment variables are set
- **Feature Requests**: Open an issue on GitHub

---

**Built with ❤️ using Next.js, Tailwind CSS, and Supabase**

