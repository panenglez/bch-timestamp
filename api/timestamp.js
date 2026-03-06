// Use require for Vercel serverless (CommonJS)
const { Wallet, Network, relay } = require('mainnet-js');

export default async function handler(req, res) {
  // Allow CORS for local testing
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { wif, fileHash } = req.body;
    
    if (!wif || !fileHash) {
      return res.status(400).json({ error: 'Missing wif or fileHash' });
    }

    // Create wallet and transaction
    const wallet = new Wallet(wif, Network.mainnet);
    
    const tx = await wallet.send({
      to: wallet.address,
      amount: 0,
       fileHash  // OP_RETURN data
    });

    // Broadcast to network
    const txid = await relay(tx);

    return res.status(200).json({ 
      success: true, 
      txid: txid,
      address: wallet.address 
    });

  } catch (error) {
    console.error('Timestamp API Error:', error);
    return res.status(500).json({ 
      error: error.message || 'Failed to create timestamp',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
