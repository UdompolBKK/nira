// Test Firebase Admin SDK connection
const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
require('dotenv').config();

async function testFirebaseAdmin() {
  console.log('Testing Firebase Admin SDK...\n');

  // Get credentials from env
  const projectId = process.env.NUXT_FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.NUXT_FIREBASE_ADMIN_CLIENT_EMAIL;
  let privateKey = process.env.NUXT_FIREBASE_ADMIN_PRIVATE_KEY || '';

  console.log('Config check:');
  console.log('- Project ID:', projectId);
  console.log('- Client Email:', clientEmail);
  console.log('- Private Key length:', privateKey.length);

  // Process private key
  if ((privateKey.startsWith('"') && privateKey.endsWith('"')) ||
      (privateKey.startsWith("'") && privateKey.endsWith("'"))) {
    privateKey = privateKey.slice(1, -1);
  }
  privateKey = privateKey.replace(/\\n/g, '\n');

  console.log('- Private Key starts with:', privateKey.substring(0, 27));
  console.log('- Private Key ends with:', privateKey.substring(privateKey.length - 25));
  console.log('');

  if (!projectId || !clientEmail || !privateKey) {
    console.error('ERROR: Missing credentials');
    return;
  }

  try {
    // Initialize
    const app = initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey
      })
    });

    console.log('Firebase Admin initialized successfully!');

    // Test Firestore
    const db = getFirestore(app);
    console.log('Firestore instance created.');

    // Try to read a collection
    const snapshot = await db.collection('users').limit(1).get();
    console.log('Firestore query successful!');
    console.log('Documents found:', snapshot.size);

    console.log('\n✅ Firebase Admin SDK is working correctly!');
  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error('Code:', error.code);
  }
}

testFirebaseAdmin();
