export default async function handler(req,res){

  const { video } = req.query;

  // normally you'd verify user subscription here

  const url = `https://your-storage.com/${video}`;

  res.json({url});
}