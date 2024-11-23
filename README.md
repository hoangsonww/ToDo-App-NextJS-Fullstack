# ToDo-App-Fullstack-NextJS

Welcome to the **ToDo-App-Fullstack-NextJS**, a full-stack, lightweight, and simple to-do application built using **Next.js** with both backend and frontend integrated seamlessly.

This project shows the power of Next.js and serves as a practical demonstration of using Next.js as a complete full-stack framework, incorporating authentication, dark mode, and local storage for data persistence.

## Table of Contents

- [🌟 **Features**](#-features)
- [🖼️ **UI Preview**](#-ui-preview)
  - [**Landing Page**](#landing-page)
    - [**Light Mode**](#light-mode)
    - [**Dark Mode**](#dark-mode)
  - [**Login Page**](#login-page)
    - [**Light Mode**](#light-mode-1)
    - [**Dark Mode**](#dark-mode-1)
  - [**Register Page**](#register-page)
    - [**Light Mode**](#light-mode-2)
    - [**Dark Mode**](#dark-mode-2)
  - [**Homepage (To-Do List)**](#homepage-to-do-list)
    - [**Light Mode**](#light-mode-3)
    - [**Dark Mode**](#dark-mode-3)
- [📂 **File Structure**](#-file-structure)
- [📋 **API Endpoints**](#-api-endpoints)
  - [**1. Prerequisites**](#1-prerequisites)
  - [**2. Clone the Repository**](#2-clone-the-repository)
  - [**3. Install Dependencies**](#3-install-dependencies)
  - [**4. Set Up Environment Variables**](#4-set-up-environment-variables)
  - [**5. Run the Development Server**](#5-run-the-development-server)
  - [**6. Build for Production**](#6-build-for-production)
- [🌐 **Using the App**](#-using-the-app)
- [💡 **Notes**](#-notes)
- [🧪 **Testing**](#-testing)
  - [**Running Tests**](#running-tests)
- [🚀 **Live Deployment**](#-live-deployment)
- [🐳 **Containerization**](#-containerization)
- [🔧 **Contributing**](#-contributing)
- [📝 **License**](#-license)
- [📧 **Contact**](#-contact)

## 🌟 **Features**

- Full authentication system (Register and Login)
- Dark and Light mode
- User-specific to-do lists with different categories
- CRUD operations for to-do items
- Responsive design
- Add, edit, delete, and complete tasks
- Persistent storage using SQLite and in-memory storage
- A clean, modern, and responsive UI
- PWA support with offline capabilities
- Basic testing for API endpoints and utility functions
- Easy-to-understand file structure and codebase
- Customizable with additional features and improvements

## 🖼️ **UI Preview**

### **Landing Page**

#### **Light Mode**

<p align="center">
  <img src="images/landing-bright.png" alt="Landing Page" width="100%" style="border-radius: 10px"/>
</p>

#### **Dark Mode**

<p align="center">
  <img src="images/landing-dark.png" alt="Landing Page in Dark Mode" width="100%" style="border-radius: 10px"/>
</p>

### **Login Page**

#### **Light Mode**

<p align="center">
  <img src="images/login-bright.png" alt="Login Page" width="100%" style="border-radius: 10px"/>
</p>

#### **Dark Mode**

<p align="center">
  <img src="images/login-dark.png" alt="Login Page in Dark Mode" width="100%" style="border-radius: 10px"/>
</p>

### **Register Page**

#### **Light Mode**

<p align="center">
  <img src="images/register-bright.png" alt="Register Page" width="100%" style="border-radius: 10px"/>
</p>

#### **Dark Mode**

<p align="center">
  <img src="images/register-dark.png" alt="Register Page in Dark Mode" width="100%" style="border-radius: 10px"/>
</p>

### **Homepage (To-Do List)**

#### **Light Mode**

<p align="center">
  <img src="images/home-bright.png" alt="Homepage" width="100%" style="border-radius: 10px"/>
</p>

#### **Dark Mode**

<p align="center">
  <img src="images/home-dark.png" alt="Homepage in Dark Mode" width="100%" style="border-radius: 10px"/>
</p>

## 📂 **File Structure**

Below is the comprehensive file structure for the project:

```
todo-app-fullstack-nextjs/
│
├── public/
│   ├── favicon.ico
│   └── images/                  # Placeholder for UI images
│
├── src/
│   ├── app/
│   │   ├── api/                 # Backend API endpoints
│   │   │   └── todos/
│   │   │       ├── route.ts     # Full CRUD operations for todos
│   │   │
│   │   ├── auth/                # Authentication pages
│   │   │   ├── login/
│   │   │   │   └── page.tsx     # Login page
│   │   │   └── register/
│   │   │       └── page.tsx     # Registration page
│   │   │
│   │   ├── landing/
│   │   │   └── page.tsx         # Landing page
│   │   │
│   │   ├── layout.tsx           # Layout for the entire app
│   │   ├── page.tsx             # Homepage with conditional redirect logic
│   │   └── globals.css          # Global CSS styles
│   │
│   ├── components/              # Reusable components
│   │   ├── Navbar.tsx           # Navbar component
│   │   └── Footer.tsx           # Footer component
│   │
│   ├── styles/                  # Additional styles if needed
│   │   └── page.css
│   │
│   └── utils/                   # Utility functions (e.g., authentication helpers)
│       └── auth.ts
│
├── .env.local                   # Environment variables (if using)
├── next.config.js               # Next.js configuration
├── package.json                 # Project dependencies and scripts
└── README.md                    # This README file
```

## 📋 **API Endpoints**

Here's a table listing all the API endpoints provided by this application:

| HTTP Method | Endpoint             | Description                       |
| ----------- | -------------------- | --------------------------------- |
| `POST`      | `/api/auth/login`    | Log in with username and password |
| `POST`      | `/api/auth/register` | Register a new user               |
| `GET`       | `/api/todos`         | Fetch all todos for a user        |
| `POST`      | `/api/todos`         | Create a new to-do item           |
| `PUT`       | `/api/todos`         | Update a to-do item               |
| `DELETE`    | `/api/todos`         | Delete a to-do item               |

## 🛠️ **Getting Started**

Follow this step-by-step guide to set up the project locally.

### **1. Prerequisites**

Ensure you have the following installed:

- [Node.js](https://nodejs.org/en/download/) (v14 or later)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)

### **2. Clone the Repository**

```bash
git clone https://github.com/hoangsonww/ToDo-App-NextJS-Fullstack.git
cd ToDo-App-NextJS-Fullstack
```

### **3. Install Dependencies**

If you're using npm:

```bash
npm install
```

Or, if you're using Yarn:

```bash
yarn install
```

### **4. Set Up Environment Variables**

Create a `.env.local` file in the root directory if any environment variables are required. (Currently, the project doesn't use any external services that require environment variables).

### **5. Run the Development Server**

Start the development server:

```bash
npm run dev
```

Or, if using Yarn:

```bash
yarn dev
```

The application should now be running at `http://localhost:3000`.

### **6. Build for Production**

To build the project for production, run:

```bash
npm run build
```

Or, if using Yarn:

```bash
yarn build
```

To start the production server:

```bash
npm run start
```

Or:

```bash
yarn start
```

The production build will be served at `http://localhost:3000`.

## 🌐 **Using the App**

1. **Visit the Landing Page** (`/landing`): Introduces the app with the option to log in or register.
2. **Authentication**:

- Register: Create a new account via the `/auth/register` page.
- Login: Access your account through the `/auth/login` page.

3. **Manage To-Dos**: Access the main to-do list page (`/`) where you can add, edit, and delete to-dos, as well as toggle dark mode.

## 💡 **Notes**

- This application uses local storage to manage user data and to-do items. For a more robust application, consider integrating a real database (e.g., MongoDB, PostgreSQL).
- The dark mode toggle is handled with React state and applied to various components via Material-UI's `ThemeProvider`.

## 🧪 **Testing**

### **Running Tests**

This project includes a few basic tests for the API endpoints and utility functions. To run the tests, use the following command:

```bash
npm run test
```

Or, if using Yarn:

```bash
yarn test
```

The tests will run and display the results in the terminal.

## 🚀 **Live Deployment**

The application is deployed live on **Vercel**. You can access it at [https://todo-app-nextjs-stack.vercel.app/](https://todo-app-nextjs-stack.vercel.app/landing).

## 🐳 **Containerization**

This project includes a `Dockerfile` for containerization. To build the Docker image, run:

```bash
docker compose up --build
```

This command will build the Docker image and start the container. The application will be accessible at `http://localhost:3000`.

## 🔧 **Contributing**

Contributions are welcome! If you'd like to contribute, please fork the repository, make your changes, and create a pull request.

## 📝 **License**

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.

## 📧 **Contact**

For any inquiries or feedback, feel free to reach out to the author at `hoangson091104@gmail.com`.

Enjoy using the **ToDo-App-Fullstack-NextJS**! 🎉

---

Happy coding! 🚀

[Back to Top ↑](#todo-app-fullstack-nextjs)
