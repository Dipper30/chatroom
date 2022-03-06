const v1 = require('./v1.ts')

module.exports = ((app: any) => {
  app.use('/api/v1', v1)
})