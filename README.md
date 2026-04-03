# Project Ayu 🌿

Project Ayu is a green-tech platform dedicated to medicinal plants and personalized garden services. It combines ancient botanical wisdom with modern AI to help users create and maintain their own medicinal gardens.

## ✨ Features

- **Medicinal Plant Store:** Browse and purchase a wide variety of medicinal plants with detailed care instructions and health benefits.
- **Garden Service Booking:** Book professional consultations for setting up balcony, terrace, or indoor medicinal gardens.
- **AI Plant Assistant:** Get instant advice on plant identification, care diagnosis, and gardening tips powered by Google Gemini.
- **User Profiles:** Manage orders, track garden bookings, and maintain a personalized green impact history.
- **Secure Authentication:** Integrated Firebase Authentication for secure user accounts.
- **Real-time Updates:** Live data synchronization using Firestore.

## 🛠️ Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS v4, Framer Motion (motion/react), Lucide React.
- **Backend:** Node.js, Express (Full-stack setup).
- **Database & Auth:** Firebase Firestore, Firebase Authentication.
- **AI:** Google Gemini API (@google/genai).

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- A Google Cloud Project with Gemini API access
- A Firebase Project

### Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd project-ayu
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Variables:**
   Create a `.env` file in the root directory and add the following:
   ```env
   GEMINI_API_KEY=your_gemini_api_key
   APP_URL=http://localhost:3000
   ```

4. **Firebase Configuration:**
   Ensure you have a `firebase-applet-config.json` in the root directory with your Firebase project credentials:
   ```json
   {
     "projectId": "your-project-id",
     "appId": "your-app-id",
     "apiKey": "your-api-key",
     "authDomain": "your-auth-domain",
     "firestoreDatabaseId": "your-database-id",
     "storageBucket": "your-storage-bucket",
     "messagingSenderId": "your-sender-id"
   }
   ```

### Running the Project

To start the development server (both Express and Vite):

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

### Building for Productiongit config user.name "Your GitHub Name"

To create a production build:

```bash
npm run build
```

The static files will be generated in the `dist` folder, and the Express server will serve them in production mode.

## 🌿 Seeding the Store

If you are an administrator (configured in `firestore.rules` and `Shop.tsx`), you can seed the store with an initial set of medicinal plants:

1. Sign in with your admin account.
2. Navigate to the **Shop** page.
3. Click the **Seed Store** button to populate the database with 25+ medicinal plants.

## 🔒 Security Rules

The project uses Firestore Security Rules to protect user data. Ensure your `firestore.rules` are deployed to your Firebase project:

```bash
# If using Firebase CLI
firebase deploy --only firestore:rules
```

## 📄 License

This project is licensed under the Apache-2.0 License.
