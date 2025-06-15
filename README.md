# React Native Full Stack App

A full-stack React Native application with Google Sign-In, LinkedIn OAuth, and Stripe payment integration.

## Features

- Google Sign-In integration
- LinkedIn OAuth authentication
- Stripe payment processing
- JWT-based authentication
- TypeScript support
- Express backend
- Environment variable configuration

## Prerequisites

- Node.js (v14 or higher)
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development)
- Google Cloud Console account
- LinkedIn Developer account
- Stripe account

## Project Structure

```
RNFullStackApp/
├── frontend/           # React Native app
│   ├── src/
│   │   ├── services/  # API services
│   │   ├── types/     # TypeScript types
│   │   └── ...
│   └── ...
└── backend/           # Express server
    ├── src/
    │   ├── routes/    # API routes
    │   ├── middleware/# Express middleware
    │   ├── types/     # TypeScript types
    │   └── ...
    └── ...
```

## Setup Instructions

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the frontend directory with the following variables:
   ```
   API_URL=http://localhost:3000
   GOOGLE_WEB_CLIENT_ID=your_google_web_client_id
   GOOGLE_IOS_CLIENT_ID=your_google_ios_client_id
   GOOGLE_ANDROID_CLIENT_ID=your_google_android_client_id
   LINKEDIN_CLIENT_ID=your_linkedin_client_id
   LINKEDIN_REDIRECT_URI=your_app_scheme://oauth/linkedin
   STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   ```

4. For iOS, install pods:
   ```bash
   cd ios && pod install && cd ..
   ```

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=3000
   NODE_ENV=development
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRATION=24h
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   LINKEDIN_CLIENT_ID=your_linkedin_client_id
   LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
   ```

## Running the Application

### Frontend

1. Start Metro bundler:
   ```bash
   npm start
   ```

2. Run on Android:
   ```bash
   npm run android
   ```

3. Run on iOS:
   ```bash
   npm run ios
   ```

### Backend

1. Start the development server:
   ```bash
   npm run dev
   ```

## OAuth Setup

### Google Sign-In

1. Go to the [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable the Google Sign-In API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs
6. Copy the client ID and client secret to your `.env` files

### LinkedIn OAuth

1. Go to the [LinkedIn Developer Portal](https://www.linkedin.com/developers/)
2. Create a new app
3. Add the required permissions (r_liteprofile, r_emailaddress)
4. Add authorized redirect URIs
5. Copy the client ID and client secret to your `.env` files

## Stripe Setup

1. Create a [Stripe account](https://stripe.com)
2. Get your API keys from the Stripe Dashboard
3. Set up webhook endpoints
4. Copy the publishable key and secret key to your `.env` files

## Security Considerations

- Never commit `.env` files to version control
- Use HTTPS in production
- Implement proper error handling
- Validate all user inputs
- Use secure session management
- Implement rate limiting
- Keep dependencies updated

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 