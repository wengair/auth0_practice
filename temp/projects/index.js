import applySiteMiddleware from 'clients/lib/init-middleware'

export default applySiteMiddleware( (req, res) => {
  res.statusCode = 200
  res.json({ project: 'test' })
})