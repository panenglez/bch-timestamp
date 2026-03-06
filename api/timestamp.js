const { Wallet, Network, relay } = require('mainnet-js');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { wif, fileHash } = req.body;

    if (!wif || !fileHash) {
      return res.status(400).json({ error: 'Missing wif or fileHash' });
    }

    const wallet = new Wallet(wif, Network.mainnet);
    
    const tx = await wallet.send({
      to: wallet.address,
      amount: 0,
       fileHash
    });

    const txid = await relay(tx);

    res.status(200).json({ 
      success: true, 
      txid: txid,
      address: wallet.address
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to create timestamp' 
    });
  }
}
