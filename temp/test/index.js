export default (req, res) => {
  // applySiteMiddleware(req,res)
  res.statusCode = 200
  res.json({ name: 'John Doeeeae test' })
}