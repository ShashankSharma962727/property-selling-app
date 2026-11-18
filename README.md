# 🏡 Haven Estates – Full Stack Property Selling Application

A modern, full-stack real estate platform built using the MERN stack that allows users to explore, search, and manage property listings. Haven Estates provides secure authentication, property management, image uploads, and an intuitive user experience.

## 🌐 Live Demo

[**Visit Haven Estates**](https://property-selling-app-1.onrender.com/)

## 📂 GitHub Repository

[View Source Code](https://github.com/ShashankSharma962727/property-selling-app)

## ✨ Features

- 🔐 **Secure Authentication:** JWT-based authentication using Access and Refresh Tokens.
- 📧 **Email Verification:** OTP-based email verification using Nodemailer.
- 🔑 **Password Reset:** Secure OTP-based password recovery functionality.
- 🏠 **Property Listings:** Browse and manage property listings.
- 📝 **Property Management:** Create, update, and delete property listings.
- 🔍 **Search & Filtering:** Find properties using search and filtering functionality.
- 🖼️ **Image Upload:** Upload and manage property images using Multer and Cloudinary.
- 👤 **User Profile Management:** Manage user profile information.
- 🛡️ **Protected Routes:** Restrict unauthorized access to private resources.
- ☁️ **Cloud Deployment:** Deployed on Render with MongoDB Atlas integration.

## 🛠️ Tech Stack

### Frontend

- React.js
- Tailwind CSS

### Backend

- Node.js
- Express.js

### Database

- MongoDB Atlas

### Authentication & Security

- JSON Web Token (JWT)
- Access & Refresh Tokens
- Protected Routes
- OTP Verification

### Other Tools & Services

- Nodemailer
- Multer
- Cloudinary
- Render

## ⚙️ Installation & Setup

Follow these steps to run the project locally.

### 1. Clone the Repository

```bash
git clone https://github.com/ShashankSharma962727/property-selling-app.git
```

### 2. Navigate to the Project Directory

```bash
cd property-selling-app
```

### 3. Install Dependencies

Install frontend and backend dependencies according to your project folder structure.

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the backend directory and configure the required environment variables.

Example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_token_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_app_password
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

**Note:** These are example variable names. Match them with the actual names used in your backend code. Never upload your real credentials to GitHub.

### 5. Start the Application

Run the backend:

```bash
npm run dev
```

Run the frontend from its directory:

```bash
npm run dev
```

The application will be available locally at the URL configured in your frontend.

## 🔒 Security

- JWT-based authentication.
- Protected API routes.
- OTP-based email verification.
- Secure password reset functionality.
- Environment variables for sensitive credentials.

## 🚀 Deployment

The application is deployed using:

- **Frontend & Backend:** Render
- **Database:** MongoDB Atlas
- **Image Storage:** Cloudinary

## 👨‍💻 Author

**Shashank Sharma**

- GitHub: [@ShashankSharma962727](https://github.com/ShashankSharma962727)

---

⭐ If you like this project, consider giving it a star on GitHub!

**Built with ❤️ using the MERN Stack.**
