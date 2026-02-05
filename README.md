# Premium Fullstack Blog App

A modern, feature-rich blogging platform built with Node.js, Express, MongoDB, and EJS.

## 🚀 Key Features

- **Premium UI/UX**: Custom Glassmorphism design, smooth animations, and responsive layout without generic Bootstrap looks.
- **Authentication**: Secure Login/Register system using Passport.js and Bcrypt.
- **Create Posts**: Rich content creation with Image Uploads (Cloudinary) and Category selection.
- **Interactive**:
  - **Comment System**: Engage with posts.
  - **View Counter**: Real-time view tracking for every post.
  - **Categories**: Organize posts by topic.
- **Dashboard**: Dynamic Home page with User stats (Total Posts, Views, Registered Users).
- **Admin Features**: Edit/Delete posts (Author only).

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Frontend**: EJS Templates, Custom CSS (Variables, Flexbox/Grid), Font Awesome.
- **Auth**: Passport.js (Local Strategy).
- **Storage**: Cloudinary (Image hosting).

## 📦 Installation

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure `.env` file (see `.env.example`).
4.  Run the server:
    ```bash
    npm run dev
    ```
5.  Visit `http://localhost:3000`.

## 🎨 Design System

The project uses a custom Design System defined in `public/css/style.css`:

- **Typography**: 'Inter' from Google Fonts.
- **Colors**: Deep Blue/Purple gradients (`#4f46e5`, `#6366f1`).
- **Effects**: Backdrop blur, Hover lifts, Soft shadows.

## 📁 Structure

- `models/`: Mongoose Schemas (User, Post with likes/views/category).
- `views/`: EJS Templates.
- `public/`: Static assets (CSS, Images).
- `controllers/`: Application logic.
- `routes/`: API & View routes.
