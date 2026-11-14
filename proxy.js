// Vercel Serverless Function — GAS CORS 프록시
// 브라우저 → Vercel(여기) → GAS → Vercel → 브라우저
// GAS는 서버끼리 통신이라 CORS 없음

export default async function handler(req, res) {
  // CORS 허용 헤더
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, msg: 'Method not allowed' });
  }

  const { gasUrl, fn, arg } = req.body;
  if (!gasUrl || !fn) {
    return res.status(400).json({ ok: false, msg: 'gasUrl, fn 필수' });
  }

  try {
    const response = await fetch(gasUrl, {
      method: 'POST',
      body: JSON.stringify({ fn, arg: arg ?? null }),
      redirect: 'follow',
    });
    const text = await response.text();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(text);
  } catch (err) {
    res.status(500).json({ ok: false, msg: err.message });
  }
}
