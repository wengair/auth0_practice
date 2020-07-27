import applySiteMiddleware from '../../../lib/init-middleware'

export default applySiteMiddleware( (req, res) => {
  res.statusCode = 200
})