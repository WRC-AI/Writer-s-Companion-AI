export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ valid: false, message: 'No token provided.' });
  }

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY;

  console.log('Token received:', token);
  console.log('Supabase URL:', SUPABASE_URL);
  console.log('Key present:', !!SUPABASE_KEY);

  try {
    // Clean up URL - remove trailing /rest/v1/ if present
    const projectUrl = SUPABASE_URL.replace('/rest/v1/', '').replace(/\/$/, '');
    const apiUrl = `${projectUrl}/rest/v1/beta_tokens?token=eq.${encodeURIComponent(token)}&select=*`;

    console.log('Calling:', apiUrl);

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Response status:', response.status);
    const responseText = await response.text();
    console.log('Response body:', responseText);

    const rows = JSON.parse(responseText);

    if (!rows || rows.length === 0) {
      return res.status(200).json({ valid: false, message: "That code wasn't recognised. Check your invite email and try again." });
    }

    const record = rows[0];

    if (record.is_redeemed) {
      return res.status(200).json({ valid: false, message: 'That code has already been used.' });
    }

    // Mark as redeemed
    const updateUrl = `${projectUrl}/rest/v1/beta_tokens?id=eq.${record.id}`;
    await fetch(updateUrl, {
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
    });

    return res.status(200).json({ valid: true });

  } catch (err) {
    console.error('Token validation error:', err);
    return res.status(500).json({ valid: false, message: 'Server error: ' + err.message });
  }
}
