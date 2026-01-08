# 📋 Smart Issue Board - Quick Setup Guide

## Prerequisites

Before you begin, make sure you have:
- Node.js 16+ installed
- A Firebase account
- Git installed (for deployment)

## Step 1: Firebase Setup (5 minutes)

### Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: `smart-issue-board` (or your choice)
4. Disable Google Analytics (optional for this project)
5. Click "Create project"

### Enable Authentication

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Click **Email/Password**
3. **Enable** the toggle
4. Click **Save**

### Create Firestore Database

1. In Firebase Console, go to **Firestore Database**
2. Click **Create database**
3. Select **Start in test mode** (we'll secure it later)
4. Choose your preferred location
5. Click **Enable**

### Get Firebase Configuration

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll down to "Your apps"
3. Click the **Web** icon (`</>`)
4. Register app with nickname: `smart-issue-board-web`
5. **Copy the configuration object** - you'll need these values!

## Step 2: Configure the Application

### Update Environment Variables

1. Open the `.env` file in your project root
2. Replace the placeholder values with your Firebase config:

```env
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

⚠️ **Important**: Never commit the `.env` file to Git!

## Step 3: Run the Application Locally

```bash
# Install dependencies (if not already done)
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Step 4: Test the Application

### Create an Account
1. Click "Sign up" link
2. Enter email and password (min 6 characters)
3. Click "Create Account"
4. You should be redirected to the dashboard

### Create Your First Issue
1. Fill out the issue form on the left:
   - Title: "Test login functionality"
   - Description: "Need to verify login works properly"
   - Priority: High
   - Status: Open
   - Assigned To: your-name
2. Click "Create Issue"

### Test Similar Issue Detection
1. Create another issue with a similar title:
   - Title: "Testing login feature"
   - Description: "Verify login functionality works"
   - Priority: Medium
   - Status: Open
   - Assigned To: your-name
2. You should see a modal showing the similar issue!
3. Click "Proceed Anyway" to create it

### Test Filtering
1. Use the status filter to show only "Open" issues
2. Use the priority filter to show only "High" priority
3. Click "Clear Filters" to reset

### Test Status Transitions
1. Try changing an issue from "Open" to "Done" directly
2. You should see an error modal
3. Change "Open" to "In Progress" (should work)
4. Then change "In Progress" to "Done" (should work)

## Step 5: Deploy to Vercel

### Option A: Using Vercel Dashboard (Recommended)

1. Push your code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/smart-issue-board.git
   git push -u origin main
   ```

2. Go to [Vercel Dashboard](https://vercel.com/)
3. Click "Add New Project"
4. Import your GitHub repository
5. Vercel will auto-detect Vite settings
6. Add environment variables:
   - Go to "Environment Variables"
   - Add each `VITE_FIREBASE_*` variable
   - **Important**: Add them for Production, Preview, and Development
7. Click "Deploy"

### Option B: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Add environment variables via CLI (you'll be prompted)
# Or add them in the Vercel dashboard

# Deploy to production
vercel --prod
```

## Step 6: (Optional) Secure Firestore Rules

Once you've tested everything, update your Firestore security rules:

1. Go to Firebase Console → **Firestore Database** → **Rules**
2. Replace with these rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Issues collection
    match /issues/{issueId} {
      // Allow read if authenticated
      allow read: if request.auth != null;
      
      // Allow create if authenticated and has required fields
      allow create: if request.auth != null
                    && request.resource.data.keys().hasAll([
                      'title', 'description', 'priority', 
                      'status', 'assignedTo', 'createdBy'
                    ]);
      
      // Allow update if authenticated
      allow update: if request.auth != null;
      
      // Allow delete if authenticated (for future feature)
      allow delete: if request.auth != null;
    }
  }
}
```

3. Click **Publish**

## Troubleshooting

### "Firebase: Error (auth/network-request-failed)"
- Check your internet connection
- Verify Firebase API key in `.env` is correct

### "Missing or insufficient permissions"
- Make sure Firestore rules are set to test mode
- Check that you're logged in (email shows in navbar)

### Build fails with module errors
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Try `npm run build` again

### Issues not appearing after creation
- Check browser console for errors
- Verify Firestore database is created
- Check Firestore rules allow read/write

## What's Next?

Congratulations! 🎉 Your Smart Issue Board is now live!

### Share Your Work
- Copy the Vercel deployment URL
- Test all features in production
- Share the link for the assessment submission

### Optional Enhancements
- Add your own styling tweaks
- Create sample issues to showcase the app
- Customize the README with your deployment URL
- Add screenshots to the README

## Need Help?

Check the comprehensive README.md for:
- Detailed architecture explanation
- Similar issue detection algorithm details
- Full list of features
- Future improvement ideas

---

**Total Setup Time**: ~15-20 minutes (including Firebase configuration)
