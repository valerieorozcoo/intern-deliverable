// Vercel serverless function — keeps the Alpha Vantage key server-side only.
// Set ALPHAVANTAGE_API_KEY in the Vercel project's Settings -> Environment
// Variables. Never commit the key itself.

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const name = req.query.name;
  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'Missing "name" query parameter' });
  }

  const apiKey = process.env.ALPHAVANTAGE_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server is missing ALPHAVANTAGE_API_KEY. Set it in Vercel project settings.' });
  }

  try {
    const searchUrl = 'https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=' +
      encodeURIComponent(name) + '&apikey=' + encodeURIComponent(apiKey);
    const searchResp = await fetch(searchUrl);
    const searchData = await searchResp.json();

    if (searchData.Note || searchData.Information) {
      return res.status(429).json({ error: searchData.Note || searchData.Information });
    }

    const matches = searchData.bestMatches || [];
    if (!matches.length) {
      return res.status(200).json({ found: false });
    }

    const symbol = matches[0]['1. symbol'];
    const matchName = matches[0]['2. name'];

    const overviewUrl = 'https://www.alphavantage.co/query?function=OVERVIEW&symbol=' +
      encodeURIComponent(symbol) + '&apikey=' + encodeURIComponent(apiKey);
    const overviewResp = await fetch(overviewUrl);
    const d = await overviewResp.json();

    if (d.Note || d.Information) {
      return res.status(429).json({ error: d.Note || d.Information });
    }
    if (!d || !d.Symbol) {
      return res.status(200).json({ found: false, symbol, matchName });
    }

    let ebitdaMM = null;
    if (d.EBITDA && d.EBITDA !== 'None' && !isNaN(Number(d.EBITDA))) {
      ebitdaMM = Math.round((Number(d.EBITDA) / 1e6) * 10) / 10;
    }

    let location = null;
    if (d.Address) {
      const m = d.Address.match(/,\s*([^,]+?)\s*,\s*([A-Z]{2})\b/);
      location = m ? (m[1] + ', ' + m[2]) : d.Address;
    }

    const industry = [d.Sector, d.Industry].filter(Boolean).join(' — ') || null;

    return res.status(200).json({
      found: true,
      symbol,
      name: d.Name || matchName,
      ebitdaMM,
      location,
      industry,
      marketCap: d.MarketCapitalization,
      exchange: d.Exchange
    });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
}
