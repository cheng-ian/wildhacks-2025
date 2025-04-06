# wildhacks-2025
WildHacks 2025: FarmFresh (Agriculture Track)
Contibutions by Ian Cheng, Darrel Zhao, Chris Zhou, Isaiah Hashimoto

# FarmFresh

A marketplace for locally grown produce.

## Firebase Authentication Setup

This project uses Firebase for authentication. Follow these steps to set up Firebase:

1. Create a Firebase project at [firebase.google.com](https://firebase.google.com)
2. Enable Authentication and select Email/Password and Google as sign-in methods
3. Create a web app in your Firebase project
4. Copy your Firebase configuration from the Firebase console
5. Update the `.env` file in the `client` directory with your Firebase configuration

```bash
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
```

6. Create a Firebase Admin SDK service account key:
   - Go to Project Settings > Service Accounts
   - Click "Generate new private key"
   - Save the JSON file to the `config` directory as `wildhacks-2025-cf527-firebase-adminsdk-fbsvc-4084686e69.json` (or update the path in `app.py` to match your filename)

## Running the Application

### Backend

```bash
# Install dependencies
pip install -r requirements.txt

# Run the Flask server
flask run
```

### Frontend

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Start the development server
npm start
```

The application will be available at http://localhost:3000
