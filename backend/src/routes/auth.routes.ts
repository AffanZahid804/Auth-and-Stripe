import { Router } from 'express';
import { OAuth2Client } from 'google-auth-library';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { AuthError, User } from '../types/auth';

const router = Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Google Sign-In
router.post('/google', async (req, res, next) => {
  try {
    const { idToken } = req.body;
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      throw new AuthError('Invalid Google token', 'INVALID_TOKEN');
    }

    const user: User = {
      id: payload.sub,
      email: payload.email!,
      name: payload.name!,
      picture: payload.picture,
      provider: 'google',
    };

    const token = jwt.sign(
      { userId: user.id, email: user.email, provider: user.provider },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRATION }
    );

    res.json({ user, token });
  } catch (error) {
    next(error);
  }
});

// LinkedIn Sign-In
router.get('/linkedin', (req, res) => {
  const { redirect_uri } = req.query;
  const linkedinAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${
    process.env.LINKEDIN_CLIENT_ID
  }&redirect_uri=${encodeURIComponent(redirect_uri as string)}&scope=r_liteprofile%20r_emailaddress`;
  
  res.json({ url: linkedinAuthUrl });
});

// LinkedIn Callback
router.post('/linkedin/callback', async (req, res, next) => {
  try {
    const { code } = req.body;
    const { redirect_uri } = req.query;

    // Exchange code for access token
    const tokenResponse = await axios.post('https://www.linkedin.com/oauth/v2/accessToken', null, {
      params: {
        grant_type: 'authorization_code',
        code,
        redirect_uri,
        client_id: process.env.LINKEDIN_CLIENT_ID,
        client_secret: process.env.LINKEDIN_CLIENT_SECRET,
      },
    });

    const accessToken = tokenResponse.data.access_token;

    // Get user profile
    const profileResponse = await axios.get('https://api.linkedin.com/v2/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const emailResponse = await axios.get('https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const user: User = {
      id: profileResponse.data.id,
      email: emailResponse.data.elements[0]['handle~'].emailAddress,
      name: `${profileResponse.data.localizedFirstName} ${profileResponse.data.localizedLastName}`,
      provider: 'linkedin',
    };

    const token = jwt.sign(
      { userId: user.id, email: user.email, provider: user.provider },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRATION }
    );

    res.json({ user, token });
  } catch (error) {
    next(error);
  }
});

export const authRouter = router; 