const admin = require('firebase-admin')
const serviceAccount = require('../Config/firebase-admin.json')

/**
 * Initialize Firebase Admin SDK (singleton pattern).
 * Admin SDK lets the backend VERIFY Firebase ID tokens from the frontend.
 * It never deals with authentication itself — only verification.
 */

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

module.exports = admin