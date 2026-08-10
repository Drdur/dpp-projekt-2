const express = require('express');
const admin = require('firebase-admin');

// Inicijalizacija Firebase Admin SDK-a
admin.initializeApp();
const db = admin.firestore();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

// GS1 Digital Link & DPP Gateway ruta (EN 18222 / EN 18223)
app.get('/:tenantId/products/:productId', async (req, res) => {
  const { tenantId, productId } = req.params;
  const acceptHeader = req.headers['accept'] || '';

  try {
    const passportRef = db.collection('tenants').doc(tenantId).collection('products').doc(productId).collection('passports').doc('main');
    const passportDoc = await passportRef.get();

    if (!passportDoc.exists) {
      return res.status(404).json({ error: 'Digitalna putovnica nije pronađena.' });
    }

    const passportData = passportDoc.data();

    if (acceptHeader.includes('application/ld+json') || acceptHeader.includes('application/json') || req.query.format === 'json') {
      return res.setHeader('Content-Type', 'application/ld+json').status(200).json(passportData);
    }

    const targetUrl = passportData.consumerUrl || `https://dpp-frontend-portal.web.app/viewer/${tenantId}/${productId}`;
    return res.redirect(302, targetUrl);

  } catch (error) {
    console.error('Greška pri dohvaćanju putovnice:', error);
    return res.status(500).json({ error: 'Interna pogreška poslužitelja.' });
  }
});

app.listen(PORT, () => {
  console.log(`DPP Router pokrenut na portu ${PORT}`);
});