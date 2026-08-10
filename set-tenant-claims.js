const admin = require('firebase-admin');
const serviceAccount = require('./service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

async function setTenantClaims(uid, tenantId, role) {
  const user = await admin.auth().getUser(uid);
  const customClaims = { tenantId, role };
  await admin.auth().setCustomUserClaims(uid, customClaims);
  console.log(`[USPJEH] Claims postavljeni za ${user.email}:`, customClaims);
  return customClaims;
}

if (require.main === module) {
  const args = process.argv.slice(2);
  setTenantClaims(args[0], args[1], args[2])
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('[GREŠKA]', err.message);
      process.exit(1);
    });
}