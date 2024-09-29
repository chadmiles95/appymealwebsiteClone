import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { captcha } = req.body;

    if (!captcha) {
      return res.status(400).json({ success: false, message: 'No CAPTCHA token provided' });
    }

    const secretKey = process.env.NEXT_PUBLIC_RECAPTCHA_SECRET_KEY;

    try {
      const response = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `secret=${secretKey}&response=${captcha}`
      });

      const data = await response.json();

      if (data.success) {
        return res.status(200).json({ success: true });
      } else {
        return res.status(400).json({ success: false, message: 'CAPTCHA verification failed' });
      }
    } catch (error) {
      console.error('Server error:', error); // Log error for debugging
      return res.status(500).json({ success: false, message: 'Server error' });
    }
  } else {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}