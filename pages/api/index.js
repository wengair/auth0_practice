import nextConnect from 'next-connect'
import applySiteMiddleware from '../../lib/init-middleware'
 
const handler = nextConnect()
console.log('in /pages/api/index.js')
handler.use('/*',applySiteMiddleware())
        // .get((req, res) => {
        //     res.send('Hello world');
        // })
        // .post((req, res) => {
        //     res.json({ hello: 'world' });
        // })
        // .put(async (req, res) => {
        //     res.end('async/await is also supported!');
        // })
        // .patch(async (req, res) => {
        //     throw new Error('Throws me around! Error can be caught and handled.')
        // })
// handler.use((req, res) => {
//     console.log('in handler.use')
//     res.send('Hello world')
//   })

export default handler

// export default applySiteMiddleware( (req, res) => {
//     res.statusCode = 200
//     res.json({ status: 'Success' })
// })