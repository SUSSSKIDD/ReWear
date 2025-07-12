# ReWear Frontend

A modern React application for the ReWear community clothing exchange platform.

## Features

- **Modern UI/UX**: Built with React 18, Tailwind CSS, and Lucide React icons
- **PWA Support**: Progressive Web App with offline capabilities
- **Responsive Design**: Mobile-first approach with responsive layouts
- **Authentication**: JWT-based authentication with protected routes
- **Real-time Updates**: React Query for efficient data fetching and caching
- **Image Upload**: Cloudinary integration for item photos
- **Search & Filters**: Advanced item browsing with multiple filter options
- **Swap System**: Direct swaps and points-based exchanges
- **User Profiles**: Comprehensive user profiles with activity tracking

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **React Query** - Data fetching and caching
- **Zustand** - State management
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **React Hook Form** - Form handling and validation
- **React Helmet Async** - Document head management
- **Axios** - HTTP client

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn
- Backend server running (see server README)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Configure environment variables:
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=ReWear
```

4. Start development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── common/         # Common components (LoadingSpinner, Avatar, etc.)
│   ├── items/          # Item-related components
│   ├── layout/         # Layout components (Header, Footer, etc.)
│   ├── profile/        # Profile-related components
│   └── swaps/          # Swap-related components
├── hooks/              # Custom React hooks
├── pages/              # Page components
│   ├── Auth/           # Authentication pages
│   ├── Dashboard/      # Dashboard page
│   ├── Items/          # Item-related pages
│   ├── Profile/        # Profile pages
│   └── Swaps/          # Swap pages
├── services/           # API services
├── stores/             # Zustand stores
├── utils/              # Utility functions
├── App.jsx             # Main app component
├── main.jsx            # App entry point
└── index.css           # Global styles
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues

## Key Components

### Authentication
- `LoginPage` - User login form
- `RegisterPage` - User registration form
- `ProtectedRoute` - Route protection wrapper
- `useAuth` - Authentication hook

### Items
- `ItemsPage` - Browse all items with filters
- `ItemDetailPage` - Individual item view
- `AddItemPage` - Add new item form
- `ItemCard` - Item display component
- `FilterSidebar` - Search and filter sidebar

### Swaps
- `SwapsPage` - User's swap requests
- `SwapCard` - Individual swap display
- `SwapModal` - Create swap request modal

### Profile
- `ProfilePage` - User profile view
- `EditProfileModal` - Profile editing modal

## Styling

The app uses Tailwind CSS with custom design tokens:

- **Primary Colors**: Green-based theme
- **Secondary Colors**: Gray scale
- **Accent Colors**: Complementary colors
- **Responsive**: Mobile-first breakpoints
- **Components**: Pre-built component classes

## State Management

- **Zustand**: Global state (auth, user data)
- **React Query**: Server state (API data, caching)
- **React Hook Form**: Form state and validation

## API Integration

The app communicates with the backend through the `api.js` service:

- **Authentication**: Login, register, profile management
- **Items**: CRUD operations, search, filters
- **Swaps**: Create, respond, complete swaps
- **Users**: Profile data, activity, stats

## PWA Features

- **Offline Support**: Service worker caching
- **Install Prompt**: Add to home screen
- **Background Sync**: Sync when online
- **Push Notifications**: (Future feature)

## Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
```bash
npm run build
# Upload dist/ folder to Netlify
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:5000/api` |
| `VITE_APP_NAME` | Application name | `ReWear` |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details 