const { Wallet, Network, relay } = require('mainnet-js');

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  try {
    const { wif, fileHash } = req.body;
    if (!wif || !fileHash) return res.status(400).json({ error: 'Missing params' });

    const wallet = new Wallet(wif, Network.mainnet);
    const tx = await wallet.send({ to: wallet.address, amount: 0,  fileHash });
    const txid = await relay(tx);

    res.status(200).json({ success: true, txid, address: wallet.address });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
}
