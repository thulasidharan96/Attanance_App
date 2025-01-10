# 🎓 **Attendance App with Authentication** 🔐

Welcome to the **Attendance App**, a powerful, user-friendly web application built with **React.js** and **Firebase**. This app enables easy user authentication and attendance tracking, all in a secure and seamless environment.

---

## 🛠️ **Features**

### 🔐 **User Authentication**
- **Login Page**: Allows users to log in securely with their credentials, powered by **Firebase Authentication**.
- **Register Page**: New users can sign up easily by providing their basic details.
- **Logout Functionality**: Users can securely log out from the app.

### 📋 **Attendance Tracking**
- **Attendance Dashboard**: A clean, easy-to-read dashboard that tracks attendance data.
- **Dynamic Data Table**: Displays real-time attendance data fetched from **Firebase Firestore**.
- **Personalized Welcome**: After logging in, users see a personalized welcome message on the dashboard.

### 💻 **Responsive UI**
- Built with **Tailwind CSS**, ensuring a responsive and mobile-friendly user experience.

---

## ⚙️ **Tech Stack**

- **Frontend**: React.js
- **Backend**: Firebase (Firestore for database, Firebase Authentication for user management)
- **Styling**: Tailwind CSS
- **Deployment**: Deployable via **Vercel**, **Netlify**, or **Firebase Hosting**.

---

## 🚀 **Getting Started**

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/attendance-app.git
```

### 2. Install Dependencies

Navigate to the project directory and install the necessary dependencies:

```bash
cd attendance-app
npm install
# or
yarn install
```

### 3. Set Up Firebase

To connect Firebase to your app, follow these steps:

- Go to [Firebase Console](https://console.firebase.google.com/).
- Create a new Firebase project.
- Enable **Firebase Authentication** and **Firestore** in your project.
- Replace the Firebase configuration in `src/service/Api.js` with your project's credentials.

### 4. Start the App

Run the development server:

```bash
npm start
# or
yarn start
```

The app will be running on `http://localhost:3000`.

---

## 🔍 **App Walkthrough**

### 🌍 **Login Page**
- Users can sign in using their credentials via Firebase Authentication.

### 📝 **Register Page**
- New users can register by creating an account with basic information.

### 📋 **Attendance Dashboard**
Once logged in, users are redirected to their dashboard:

- **Welcome Message**: Displays a personalized greeting.
- **Attendance Table**: Users can view their attendance data in a table format.
- **User Table**: Displays a list of users, with data pulled from Firebase Firestore.

### 🚪 **Logout**
- Users can log out from the dashboard, securely ending their session.

---

## 📸 **Screenshots**

#### Login Page
![Login](./screenshots/login.png)

#### Register Page
![Register](./screenshots/register.png)

#### Attendance Dashboard
![Dashboard](./screenshots/dashboard.png)

---

## 📝 **Contributing**

We welcome contributions to this project! If you have suggestions or improvements, please fork the repository, make your changes, and submit a pull request.

### How to Contribute:
1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Make your changes and commit them.
4. Push your changes to your forked repository.
5. Create a pull request from your branch to the `main` branch.

---

## 📜 **License**

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for more details.

---

## 📞 **Contact**

- **Author**: Thulasidharan
- GitHub: [Thulasidharan96](https://github.com/thulasidharan96)

---

### ✨ **Happy Coding!** ✨