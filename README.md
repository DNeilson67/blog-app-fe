# Blog Application - Frontend

A modern, full-featured blog application built with Next.js 16, React 19, TypeScript, and Tailwind CSS. This application provides a complete blogging platform with user authentication, post creation, commenting, and profile management.

## Prerequisites

Before running this project, ensure you have:

- **Node.js** 18.0 or higher
- **npm** package manager
- **Backend API** running (see [blog-app-be](../blog-app-be/README.md))

## Project Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3. Run the Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## How to Interact with the Application

You are able to use this demo account below to test the application:
```
email: john@example.com
password: password123
```

### User Authentication Flow

1. **Register**: Navigate to `/register` and create a new account
   - Provide email, password, and name
   - System automatically logs you in after registration

2. **Login**: Navigate to `/login` with existing credentials
   - JWT token is stored in localStorage
   - Token is included in all authenticated API requests

3. **Logout**: Click the logout button in the navigation bar
   - Token is removed from localStorage
   - User is redirected to home page

### Creating and Managing Posts

1. **Create Post**: 
   - Must be logged in
   - Navigate to `/create`
   - Fill in title, content (Markdown supported), excerpt, and category
   - Submit to create post

2. **View Post**: Click on any post title from the home page

3. **Edit Post**: 
   - Only available to post author
   - Click "Edit" button on post detail page
   - Update post content and save

4. **Delete Post**:
   - Only available to post author
   - Click "Delete" button on post detail page
   - Confirm deletion

### Commenting on Posts

1. **Add Comment**:
   - Must be logged in
   - Navigate to any post
   - Type comment in the text box at the bottom
   - Submit to add comment

2. **Edit/Delete Comment**:
   - Only available to comment author
   - Click edit/delete icons next to your comments

### Profile Management

- Navigate to `/profile` to view your profile
- Edit your name and profile picture
- View all posts you've created

## Design Decisions and Assumptions

The blog app is built using Next.js App Router with client-side rendering to support dynamic content and authentication handling. React Context API is used for state management since it is simple and sufficient for the app’s needs. Axios handles API communication for cleaner requests and easier error handling, while the UI is built with Radix UI and Tailwind CSS to ensure accessibility and flexible styling. Markdown support is included so users can easily format blog content.

The app assumes a straightforward usage flow. Authentication is handled using JWT stored in localStorage, and all data is managed by the backend. Posts are written in Markdown, categories are simple text inputs, and profile pictures are provided via image URLs. The application is designed for modern browsers, uses responsive layouts, and provides user feedback through toast notifications.
