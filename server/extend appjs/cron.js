const cron = require('node-cron');
const Company = require('../model/Company')

module.exports = () => {
  /* istanbul ignore next: can't test cron */
cron.schedule('0 0 * * *', () => {
  // Setiap 7 detik (untuk keperluan contoh: */7 * * * * *
  // console.log('running a task every second');
  /* istanbul ignore next: can't test cron */
  Company.updateMany({}, {queue: []})
    .then((status) => {
      console.log('company queue cleared')
    })
    .catch((err)=>{
      console.log(err)
    })
})
}