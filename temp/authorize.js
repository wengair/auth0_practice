import {applySiteMiddleware} from '../../lib/init-middleware'

export default applySiteMiddleware( (req, res) => {
  res.send('Secured Resource')
})