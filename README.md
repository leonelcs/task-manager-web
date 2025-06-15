# ADHD Task Manager Web

A Next.js frontend application for the ADHD Task Manager, designed specifically to help people with ADHD manage tasks across multiple projects with visual context and organization.

## Features

- 🧠 **ADHD-Focused Design**: Rock/Pebbles/Sand task prioritization
- 🎨 **Visual Project Context**: Color-coded project tags across all views
- 📱 **Responsive Design**: Works on desktop and mobile
- ⚡ **Real-time Updates**: Powered by React Query
- 🎯 **Impact-Based Organization**: Focus on what matters most
- 👥 **Collaborative Features**: Groups and shared projects
- 📊 **Analytics Dashboard**: Track your ADHD patterns

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- ADHD Task Manager API running on `http://localhost:8001`

### Installation

1. Install dependencies:
```bash
npm install
```

2. Copy environment variables:
```bash
cp .env.local.example .env.local
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Backend Setup

Make sure the [`task-manager`](../task-manager) API is running:

```bash
cd ../task-manager
source bin/activate
uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload
```

## Project Structure

```
task-manager-web/
├── app/                     # Next.js 14 app directory
│   ├── globals.css         # Global styles with ADHD-friendly colors
│   ├── layout.tsx          # Root layout with navigation
│   ├── page.tsx            # Dashboard with Rock/Pebbles/Sand view
│   ├── tasks/              # Task management pages
│   ├── projects/           # Project management pages
│   ├── groups/             # Group collaboration pages
│   └── analytics/          # Analytics and insights
├── components/             # Reusable React components
│   ├── TaskCard.tsx        # ADHD-friendly task display
│   ├── ProjectTag.tsx      # Color-coded project labels
│   ├── Navigation.tsx      # Main navigation
│   └── QueryProvider.tsx   # React Query setup
├── lib/                    # Utilities and API client
│   ├── api.ts              # API client with TypeScript types
│   └── utils.ts            # Helper functions
└── public/                 # Static assets
```

## Key Features

### Rock/Pebbles/Sand System
- **Rocks**: 1-2 major impact tasks per day
- **Pebbles**: Important progress tasks that build momentum  
- **Sand**: Nice-to-have tasks that fill gaps naturally

### Project Context
- Color-coded tags show project context across all views
- No need to remember to check multiple project dashboards
- Visual separation helps ADHD brains stay organized

### ADHD-Friendly UI
- Clear visual hierarchy with impact-based colors
- Minimal cognitive load with focused layouts
- Dopamine-friendly completion celebrations
- Break reminders and time estimates

## API Integration

This frontend connects to the [task-manager](../task-manager) FastAPI backend and uses all available endpoints:

- **Tasks**: Create, read, update, complete with ADHD features
- **Projects**: Personal, shared, and public project management  
- **Groups**: ADHD support communities and accountability
- **Users**: Profile management with ADHD preferences
- **Analytics**: Productivity patterns and insights

## Development

### Adding New Features

1. Update TypeScript types in `lib/api.ts`
2. Create API functions for new endpoints
3. Build React components with ADHD-friendly design
4. Use React Query for data fetching and caching

### Styling Guidelines

- Use Tailwind classes with ADHD-specific color palette
- Follow impact-based visual hierarchy (Rock > Pebbles > Sand)
- Maintain consistent spacing and typography
- Ensure high contrast for accessibility

## Color System

The application uses an ADHD-friendly color system:

- **Primary Blue**: Navigation and actions
- **Rock Red**: High-impact tasks (🏔️)
- **Pebbles Orange**: Medium-impact tasks (🪨)
- **Sand Gray**: Low-impact tasks (⏳)
- **Success Green**: Completions and positive feedback

## Deployment

```bash
npm run build
npm start
```

Or deploy to Vercel/Netlify with environment variables configured.

## Contributing

1. Follow the ADHD-first design principles
2. Test with real ADHD users when possible
3. Maintain visual consistency and accessibility
4. Document any new ADHD-specific features

## License

MIT License - see LICENSE file for details.
