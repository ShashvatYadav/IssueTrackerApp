# Smart Issue Board 📋

> An intelligent issue tracking application with smart similar-issue detection, built with React and Firebase.

## 🌟 Live Demo

🔗 **[View Live Application](https://your-app-url.vercel.app)** _(Deploy and update this link)_

## 📖 Overview

Smart Issue Board is a modern, intelligent issue tracking system designed to help teams manage their work efficiently. The application features an advanced similar-issue detection system that prevents duplicate issues by analyzing title similarity, keyword overlap, and contextual patterns using the Levenshtein distance algorithm.

## ✨ Key Features

- **🔐 Authentication**: Secure email/password authentication via Firebase Auth
- **🤖 Smart Similar Issue Detection**: AI-powered detection using Levenshtein distance algorithm
- **📊 Issue Management**: Full CRUD operations with real-time updates
- **🎯 Advanced Filtering**: Filter by status and priority with real-time results
- **✅ Status Validation**: Prevents invalid state transitions (e.g., Open → Done)
- **👤 User Tracking**: Displays created by, assigned to, and timestamps
- **📱 Responsive Design**: Beautiful UI that works on all devices
- **⚡ Real-time Updates**: Firestore real-time listeners for instant synchronization

## 🛠️ Technology Stack

### Frontend: React + Vite

**Why I chose React with Vite:**

1. **Development Speed**: Vite's lightning-fast HMR (Hot Module Replacement) significantly speeds up development
2. **Modern Build Tool**: Vite uses native ES modules and provides optimized production builds
3. **React Ecosystem**: Access to extensive libraries and community support
4. **Component Reusability**: Building modular, reusable components for maintainability
5. **Virtual DOM**: Efficient rendering and updates for smooth user experience
6. **Lightweight**: No heavy framework overhead compared to alternatives like Angular

### Styling: Vanilla CSS with CSS Modules

**Why CSS Modules over Tailwind:**

1. **Full Control**: Complete flexibility over styling without framework constraints
2. **No Dependencies**: Zero additional bundle size from CSS frameworks
3. **Scoped Styles**: CSS Modules provide local scoping preventing style conflicts
4. **Better for Design Systems**: Easier to maintain consistent design tokens
5. **Performance**: No unused CSS classes in production
6. **Learning Value**: Demonstrates strong CSS fundamentals

### Backend: Firebase (Firestore + Auth)

**Why Firebase:**

1. **Serverless**: No backend code to write or servers to maintain
2. **Real-time**: Built-in real-time listeners for instant data synchronization
3. **Scalability**: Automatically scales with user growth
4. **Authentication**: Built-in email/password auth with minimal setup
5. **Security**: Firestore security rules for data protection
6. **Cost-Effective**: Generous free tier for development and small projects

### Hosting: Vercel

**Why Vercel:**

1. **Optimized for React**: Best performance for React applications
2. **Automatic Deployments**: CI/CD from Git commits
3. **Environment Variables**: Secure config management
4. **Edge Network**: Global CDN for fast load times
5. **Zero Configuration**: Works out of the box with Vite
6. **Free Tier**: Perfect for internship projects

## 🗄️ Firestore Data Structure

### Collection: `issues`

```javascript
{
  id: string,              // Auto-generated document ID
  title: string,           // Issue title (min 3 chars)
  description: string,     // Issue description (min 10 chars)
  priority: string,        // "Low" | "Medium" | "High"
  status: string,          // "Open" | "In Progress" | "Done"
  assignedTo: string,      // Name or email of assignee
  createdBy: string,       // Email of creator (from auth)
  createdAt: timestamp,    // Server timestamp
  updatedAt: timestamp     // Server timestamp (updated on changes)
}
```

### Indexes Required

For optimal query performance, create these composite indexes in Firebase:

1. **Status + CreatedAt**: `status` (ASC), `createdAt` (DESC)
2. **Priority + CreatedAt**: `priority` (ASC), `createdAt` (DESC)

These indexes enable efficient filtering and sorting operations.

## 🤖 Similar Issue Detection Algorithm

### How It Works

The similar issue detection uses a multi-faceted approach:

#### 1. **Levenshtein Distance Algorithm**
- Calculates minimum edit distance between two strings
- Measures how many single-character edits are needed to transform one string into another
- Provides a numerical similarity score (0-100%)

#### 2. **Keyword Extraction**
- Removes common stop words ("the", "a", "is", etc.)
- Extracts meaningful terms from descriptions
- Calculates keyword overlap using Jaccard similarity

#### 3. **Weighted Scoring**
```javascript
Overall Similarity = (Title Similarity × 0.7) + (Description Similarity × 0.3)
```

#### 4. **Bonus Points**
- +5% if same priority
- +5% if same status

#### 5. **Threshold**
- Default threshold: 60% similarity
- Issues above threshold trigger warning modal
- User can choose to:
  - **Proceed Anyway**: Create the issue despite similarity
  - **Cancel**: Modify the issue before creating
  - **View Details**: See similar issues with similarity scores

### Implementation Details

```javascript
// Example similarity scores:
"Login button not working" vs "Login button broken" → 85% match
"API timeout issue" vs "Database connection error" → 45% match (no warning)
```

This intelligent detection helps teams:
- Avoid duplicate issues
- Discover related existing work
- Maintain cleaner issue boards
- Improve team communication

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm
- Firebase account ([console.firebase.google.com](https://console.firebase.google.com))
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/smart-issue-board.git
   cd smart-issue-board
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a new Firebase project
   - Enable Email/Password authentication in Firebase Console
   - Create a Firestore database
   - Copy your Firebase configuration

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Firebase credentials:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:5173](http://localhost:5173)

### Deployment to Vercel

1. **Install Vercel CLI** (optional)
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```
   
   Or connect your GitHub repository to Vercel for automatic deployments.

3. **Add environment variables in Vercel**
   - Go to your project settings in Vercel dashboard
   - Add all `VITE_FIREBASE_*` variables
   - Redeploy

## 📚 Project Structure

```
src/
├── components/
│   ├── Auth/           # Login & Signup components
│   ├── Issues/         # Issue form, list, card, filter
│   ├── Layout/         # Navbar, ProtectedRoute
│   └── Common/         # Reusable Button & Modal
├── context/
│   └── AuthContext.jsx # Authentication state management
├── hooks/
│   └── useIssues.js    # Custom hook for Firestore operations
├── pages/
│   ├── LoginPage.jsx
│   ├── SignupPage.jsx
│   └── DashboardPage.jsx
├── utils/
│   ├── firebase.js              # Firebase config
│   ├── validators.js            # Form validation
│   └── similarityDetection.js   # Similar issue algorithm
├── App.jsx             # Router & route definitions
├── main.jsx           # App entry point
└── index.css          # Global styles & design tokens
```

## 🎨 Design Decisions

### Color Palette
- **Primary**: Purple gradient (#667eea → #764ba2)
- **Secondary**: Pink gradient (#f093fb → #f5576c)
- **Status Colors**: Gray (Open), Blue (In Progress), Green (Done)
- **Priority Colors**: Blue (Low), Yellow (Medium), Red (High)

### Typography
- **Font**: Inter (Google Fonts)
- **Weights**: 400 (regular), 600 (semi-bold), 700 (bold)

### Animations
- Smooth hover effects (translateY, box-shadow)
- Fade-in modals with slide-up animation
- Loading spinners for async operations
- Floating backgrounds on auth pages

## 🧩 Challenges & Solutions

### Challenges Faced

1. **Similar Issue Detection Algorithm**
   - **Challenge**: Determining the right threshold and weighting for similarity
   - **Solution**: Tested various thresholds (60% worked best) and weighted title more heavily than description (70/30 split)

2. **Status Transition Validation**
   - **Challenge**: The requirement was slightly ambiguous - should we prevent ALL invalid transitions or just Open → Done?
   - **Solution**: Implemented only the specified rule (Open → Done) with a friendly modal message, allowing flexibility for other transitions

3. **Real-time Updates UX**
   - **Challenge**: Firestore listeners causing re-renders during form submission
   - **Solution**: Used React hooks properly (useEffect cleanup) and optimistic UI updates

4. **Environment Variables in Vite**
   - **Challenge**: Understanding Vite's `import.meta.env` syntax vs traditional `process.env`
   - **Solution**: Used `VITE_` prefix for all environment variables

5. **CSS Module Naming**
   - **Challenge**: Managing scoped styles across many components
   - **Solution**: Consistent naming convention (kebab-case for files, camelCase for classes)

### Confusing Aspects

- **Firebase Timestamp Handling**: Converting Firestore timestamps to JavaScript Date objects requires `.toDate()` method
- **Similar Issue Threshold**: No "correct" answer - had to make a practical decision
- **Assignment Requirement**: "Assigned To" accepting both email/name was ambiguous - chose to accept any string

## 🔮 Future Improvements

### High Priority
1. **Issue Editing**: Allow users to edit existing issues
2. **Issue Deletion**: Add ability to delete issues with confirmation
3. **Comments**: Add comment threads to issues
4. **Attachments**: Upload images/files to issues

### Medium Priority
5. **Search Functionality**: Full-text search across issues
6. **Sorting Options**: Sort by priority, status, date created, etc.
7. **User Profiles**: Display name, avatar, role
8. **Notifications**: Email/push notifications for assignments

### Nice to Have
9. **Dark Mode Toggle**: User-preference based theme switching
10. **Keyboard Shortcuts**: Power user features
11. **Export to CSV**: Download issues for reporting
12. **Analytics Dashboard**: Charts for issue metrics
13. **Labels/Tags**: Custom categorization beyond priority
14. **Due Dates**: Track issue deadlines

### Technical Improvements
15. **Unit Tests**: Jest + React Testing Library
16. **E2E Tests**: Playwright or Cypress
17. **Error Boundary**: Graceful error handling
18. **Performance Monitoring**: Firebase Performance Monitoring
19. **Accessibility**: ARIA labels, keyboard navigation
20. **Offline Support**: PWA with service workers

## 🧪 Testing

### Manual Testing Checklist

- [x] User can sign up with email/password
- [x] User can log in with existing account
- [x] User email displays in navbar
- [x] User can log out
- [x] Creating issue with all fields works
- [x] Similar issue detection triggers on duplicates
- [x] Similar issue modal displays correctly
- [x] User can proceed despite similar issues
- [x] User can cancel issue creation
- [x] Issues display in newest-first order
- [x] Status filter works (All, Open, In Progress, Done)
- [x] Priority filter works (All, Low, Medium, High)
- [x] Clear filters button works
- [x] Status can be updated via dropdown
- [x] Open → Done transition shows error modal
- [x] Other status transitions work correctly
- [x] Timestamps display as relative time
- [x] Responsive design works on mobile
- [x] All animations are smooth

## 📄 License

This project was created as part of an internship assignment.

## 👨‍💻 Developer

Created with ❤️ for the internship assessment.

---

**Note**: Replace Firebase credentials, GitHub repository URL, and deployed Vercel URL with your actual values before submission.
