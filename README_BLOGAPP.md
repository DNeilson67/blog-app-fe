# BlogApp - Frontend-Only Blog Application

A modern, fully-featured blog application built with **Next.js 15**, **React**, **TypeScript**, and **shadcn/ui**. This is a **frontend-only** application that uses mock data and client-side state management with localStorage.

## 🚀 Features

### Authentication (Frontend-Only)
- ✅ User registration with validation
- ✅ User login with mock JWT tokens
- ✅ Session persistence using localStorage
- ✅ Protected routes for authenticated users
- ✅ Demo credentials provided on login page

### Blog Posts
- ✅ Create, read, update, and delete blog posts
- ✅ **Markdown support** for rich content formatting
- ✅ Live preview while writing
- ✅ Category tagging (optional)
- ✅ Post excerpts automatically generated
- ✅ Author information displayed
- ✅ Edit/Delete only accessible to post authors

### Search & Pagination
- ✅ Real-time search across titles, content, and categories
- ✅ Client-side pagination (6 posts per page)
- ✅ Dynamic page navigation
- ✅ Search result counts

### Comments System
- ✅ Add comments to posts
- ✅ Edit your own comments
- ✅ Delete your own comments
- ✅ Validation for comment content
- ✅ Author-only edit/delete controls

### User Profile
- ✅ View and edit profile information
- ✅ Upload profile picture (base64 storage)
- ✅ View all your posts
- ✅ Quick access to edit/delete your posts
- ✅ Member since date

### UI/UX
- ✅ Clean, modern design with shadcn/ui components
- ✅ **Fully responsive** (desktop, tablet, mobile)
- ✅ Light mode only
- ✅ Smooth transitions and hover effects
- ✅ Toast notifications for actions
- ✅ Confirmation dialogs for destructive actions

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **UI Library**: shadcn/ui
- **Styling**: Tailwind CSS v4
- **Markdown Rendering**: react-markdown + remark-gfm
- **State Management**: React Context API
- **Data Persistence**: localStorage
- **Icons**: Lucide React

## 📦 Installation

1. **Clone or navigate to the project directory**:
   ```bash
   cd blog-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Usage

### Demo Credentials

The app comes with pre-populated mock users and posts. Use these credentials to log in:

- **Email**: `john@example.com`
- **Password**: `password123`

Or:
- **Email**: `jane@example.com`
- **Password**: `password123`

### Creating a New Account

1. Click **Register** in the navbar
2. Fill in your details (email, password, name)
3. Submit to auto-login and start using the app

### Writing a Post

1. Login to your account
2. Click **Create Post** in the navbar
3. Fill in the title, optional category, and content
4. Use **Markdown** for formatting:
   - `# Heading` for headings
   - `**bold**` for bold text
   - `*italic*` for italic text
   - `` `code` `` for inline code
   - Triple backticks for code blocks
   - Lists, links, and more!
5. Preview your post in real-time on the right panel
6. Click **Publish Post**

### Searching Posts

Use the search bar on the home page to filter posts by:
- Title
- Content
- Category

Results update instantly as you type.

### Managing Comments

- **Add a comment**: Type in the comment box and click "Add Comment"
- **Edit your comment**: Click the edit icon on your comment
- **Delete your comment**: Click the delete icon and confirm

### Profile Management

1. Navigate to **Profile** from the navbar
2. Click **Edit Profile** to update your name or picture
3. Upload a profile picture (max 2MB)
4. View all your posts with quick edit/delete access

## 📁 Project Structure

```
blog-app/
├── app/
│   ├── create/              # Create post page
│   ├── login/               # Login page
│   ├── post/
│   │   └── [id]/
│   │       ├── page.tsx     # Post detail page
│   │       └── edit/        # Edit post page
│   ├── profile/             # User profile page
│   ├── register/            # Registration page
│   ├── globals.css          # Global styles + markdown styles
│   ├── layout.tsx           # Root layout with providers
│   └── page.tsx             # Home page
├── components/
│   ├── ui/                  # shadcn/ui components
│   └── Navbar.tsx           # Navigation component
├── contexts/
│   ├── AuthContext.tsx      # Authentication context
│   └── BlogContext.tsx      # Blog data context
├── lib/
│   ├── mockData.ts          # Mock users, posts, comments
│   ├── types.ts             # TypeScript interfaces
│   └── utils.ts             # Utility functions
└── public/                  # Static assets
```

## 🔒 Authorization Rules

The application enforces the following rules on the **frontend only**:

- **Unauthenticated users** can:
  - View posts
  - Search posts
  - View comments
  
- **Authenticated users** can:
  - All of the above, plus:
  - Create new posts
  - Edit their own posts
  - Delete their own posts
  - Add comments
  - Edit their own comments
  - Delete their own comments
  - Update their profile

## 🎨 Markdown Support

The blog editor supports GitHub Flavored Markdown (GFM), including:

- Headings (`#`, `##`, `###`)
- Bold (`**text**`)
- Italic (`*text*`)
- Code (`` `code` ``)
- Code blocks (triple backticks)
- Lists (ordered and unordered)
- Links (`[text](url)`)
- Blockquotes (`>`)
- Horizontal rules (`---`)

## 💾 Data Persistence

All data is stored in the browser's **localStorage**:

- **Users**: Stored with hashed passwords (mock)
- **Posts**: Full post data including content
- **Comments**: All comments with author info
- **Auth Token**: Mock JWT for session management
- **Profile Pictures**: Base64-encoded images

**Note**: Clearing browser data will reset the application to its initial state with mock data.

## 📱 Responsive Design

The application is fully responsive with breakpoints optimized for:

- **Desktop**: Full-width layout with sidebars
- **Tablet**: Adapted layouts with hidden elements
- **Mobile**: Single-column layout with hamburger-style navigation

## ⚡ Performance Optimizations

- Client-side routing with Next.js App Router
- Memoized search results
- Conditional rendering for auth-protected content
- Lazy loading for images
- Efficient context updates

## 🚫 Limitations (By Design)

This is a **frontend-only** application:

- No real backend or database
- No server-side validation
- Data persists only in localStorage
- No real authentication security
- No API endpoints
- Single-device data (no sync across devices)

## 🐛 Troubleshooting

### Posts not showing up
- Check browser console for errors
- Clear localStorage and refresh
- Ensure you're logged in for protected actions

### Images not uploading
- Ensure image is under 2MB
- Use common formats (JPG, PNG, GIF, WebP)
- Check browser console for errors

### Search not working
- Ensure JavaScript is enabled
- Try clearing the search and typing again

## 📝 License

This project is for educational purposes.

## 👨‍💻 Developer Notes

Built following best practices:
- TypeScript for type safety
- Component composition
- Separation of concerns
- Accessible UI components
- Clean code architecture

---

**Enjoy blogging! 📝✨**
