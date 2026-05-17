export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ valid: false, message: 'No token provided.' });
  }

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY;

  try {
    // Look up the token in Supabase
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/beta_tokens?token=eq.${encodeURIComponent(token)}&select=*`,
      {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const rows = await response.json();

    // Token not found
    if (!rows || rows.length === 0) {
      return res.status(200).json({ valid: false, message: 'That code wasn\'t recognised. Check your invite email and try again.' });
    }

    const record = rows[0];

    // Token already used
    if (record.is_redeemed) {
      return res.status(200).json({ valid: false, message: 'That code has already been used.' });
    }

    // Mark token as redeemed
    await fetch(
      `${SUPABASE_URL}/rest/v1/beta_tokens?id=eq.${record.id}`,
      {
        method: 'PATCH',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          is_redeemed: true,
          redeemed_at: new Date().toISOString()
        })
      }
    );

    return res.status(200).json({ valid: true });

  } catch (err) {
    console.error('Token validation error:', err);
    return res.status(500).json({ valid: false, message: 'Server error. Please try again.' });
  }
}
