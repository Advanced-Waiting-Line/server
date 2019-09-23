const axios = require('axios');
const qs = require('querystring');

module.exports = (req, res, next) => {
  if (!req.body.image) {
    next();
  } else {
    axios({
      method: 'POST',
      url: `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`,
      config: {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      },
      data: qs.stringify({ image: req.body.image }),
    })
      .then(({ data }) => {
        req.body.image = data.data.image.url
        next();
      })
      .catch(({ response }) => {
        next(response);
      })
  }
}


// full version
// const axios = require('axios');
// const qs = require('querystring');

// module.exports = (req, res, next) => {
//   if (!req.body.poster_path) {
//     next();
//   } else {
//     axios({
//       method: 'POST',
//       url: `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`,
//       config: {
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded'
//         }
//       },
//       data: qs.stringify({ image: req.body.poster_path }),
//     })
//       .then(({ data }) => {
//         req.body.poster_path = {
//           image_url: data.data.image.url,
//           delete_url: data.data.delete_url,
//         }
//         next();
//       })
//       .catch(({ response }) => {
//         next(response);
//       })
//   }
// }