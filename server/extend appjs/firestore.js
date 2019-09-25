// import * as firebase from 'firebase/app';
// import 'firebase/firestore';
const firebase = require('firebase/app')
require('firebase/firestore')

const firebaseConfig = {
  apiKey: process.env.FIRESTORE_API_KEY,
  authDomain: process.env.FIRESTORE_AUTHDOMAIN,
  projectId: process.env.FIRESTORE_PROJECTID,
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

module.exports =  db;

// 'use strict';
// Object.defineProperty(exports, "__esModule", {
//   value: true
// });
// var _app = require('firebase/app');
// var firebase = _interopRequireWildcard(_app);
// require('firebase/firestore');
// function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
// var firebaseConfig = {
//   apiKey: process.env.FIRESTORE_API_KEY,
//   authDomain: process.env.FIRESTORE_AUTHDOMAIN,
//   projectId: process.env.FIRESTORE_PROJECTID
// };
// firebase.initializeApp(firebaseConfig);
// var db = firebase.firestore();
// exports.default = db;
