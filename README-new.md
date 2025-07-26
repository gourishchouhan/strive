# Strive - Personal Growth & Challenge Tracker

A comprehensive web application built with Next.js that enables users to create and manage daily schedules, set and track progress on self-improvement challenges, and visualize their achievements.

## 🚀 Features

### **Dashboard**
- Overview of daily tasks and active challenges
- Progress statistics and completion rates
- Quick access to all major features
- Responsive design with mobile-friendly sidebar

### **Challenge Management**
- Create custom self-improvement challenges with categories
- Set start/end dates and define daily tasks
- Track progress with visual indicators
- Delete and manage existing challenges

### **Daily Schedule**
- Add tasks with time slots and priority levels
- Mark tasks as complete with visual feedback
- Quick-add tasks from active challenges
- Sort tasks by priority and completion status

### **Progress & Analytics**
- Visual progress tracking with charts and graphs
- Achievement system with unlockable badges
- Weekly progress breakdown
- Challenge category analysis
- Streak tracking and completion statistics

### **Achievements System**
- Unlock badges for reaching milestones
- Track streaks and completion rates
- Category-specific achievements
- Visual progress indicators for locked achievements

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Backend**: Next.js API Routes (Node.js)
- **Database**: MongoDB with Mongoose
- **UI Components**: Radix UI, shadcn/ui
- **Charts**: Recharts
- **Icons**: Lucide React
- **Deployment**: Vercel

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd strive
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Copy `.env.local.example` to `.env.local`
   - Update the MongoDB connection string and other variables

4. **Set up MongoDB**
   - Create a MongoDB database (local or MongoDB Atlas)
   - Update the `MONGODB_URI` in `.env.local`

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🌍 Deployment

### Vercel Deployment

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables in Vercel dashboard
   - Deploy

3. **Environment Variables for Production**
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/strive
   NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
   NODE_ENV=production
   ```

## 📁 Project Structure

```
strive/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── challenges/           # Challenge CRUD operations
│   │   ├── tasks/               # Task CRUD operations
│   │   └── dashboard/           # Dashboard statistics
│   ├── achievements/            # Achievements page
│   ├── challenges/              # Challenges management
│   │   └── new/                # Create new challenge
│   ├── progress/               # Progress analytics
│   ├── schedule/               # Daily schedule
│   │   └── new/               # Add new task
│   ├── layout.js              # Root layout
│   ├── page.js                # Dashboard page
│   └── globals.css            # Global styles
├── components/                # Reusable components
│   ├── ui/                   # shadcn/ui components
│   ├── Dashboard.jsx         # Dashboard components
│   └── Sidebar.jsx          # Navigation sidebar
├── lib/                      # Utility functions
│   ├── mongodb.js           # Database connection
│   └── utils.js             # Helper functions
├── models/                   # Mongoose models
│   ├── Challenge.js         # Challenge schema
│   ├── Task.js             # Task schema
│   └── Achievement.js      # Achievement schema
├── public/                  # Static assets
└── package.json
```

## 🎯 Usage

### Creating Your First Challenge

1. Click "New Challenge" in the sidebar
2. Fill in challenge details:
   - Title and description
   - Category (health, fitness, learning, etc.)
   - Start and end dates
   - Daily tasks
3. Submit to create your challenge

### Managing Daily Tasks

1. Go to "Schedule" in the sidebar
2. Click "Add Task" to create a new task
3. Set time, priority, and category
4. Link to existing challenges if desired
5. Mark tasks as complete throughout the day

### Tracking Progress

1. Visit the "Progress" page for detailed analytics
2. View weekly completion charts
3. Monitor category performance
4. Track challenge progress

### Unlocking Achievements

- Complete tasks to unlock task-based achievements
- Maintain streaks for streak-based badges
- Create and complete challenges for milestone achievements
- Achieve category-specific goals

## 🔧 Configuration

### MongoDB Schema

The application uses three main collections:

- **challenges**: Store challenge data with daily tasks
- **tasks**: Individual tasks with scheduling information
- **achievements**: Achievement templates and progress

### Environment Variables

```env
MONGODB_URI=your_mongodb_connection_string
NEXT_PUBLIC_APP_URL=your_app_url
NODE_ENV=development|production
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎨 Design Features

- **Responsive Design**: Works seamlessly across desktop, tablet, and mobile
- **Accessible UI**: Proper ARIA labels, keyboard navigation, and screen reader support
- **Intuitive Navigation**: Clean sidebar navigation with active state indicators
- **Visual Feedback**: Progress bars, completion states, and priority indicators
- **Modern UI**: Built with shadcn/ui components for consistency

## 📞 Support

If you have any questions or need help with setup, please open an issue in the GitHub repository.

---

**Happy Striving! 🎯**
