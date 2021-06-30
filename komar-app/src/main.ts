import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import * as express from 'express';
import * as functions from 'firebase-functions';
/*
import * as admin from 'firebase-admin';

const authMiddleWare = async (req, res, next) => {
  console.log('Check if request is authorized with Firebase ID token');

  if (
    (!req.headers.authorization ||
      !req.headers.authorization.startsWith('Bearer ')) &&
    !(req.cookies && req.cookies.__session)
  ) {
    console.error(
      'No Firebase ID token was passed as a Bearer token in the Authorization header.',
      'Make sure you authorize your request by providing the following HTTP header:',
      'Authorization: Bearer <Firebase ID Token>',
      'or by passing a "__session" cookie.',
    );
    res.status(403).send('No id token passed');
    return;
  }

  let idToken;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    console.log('Found "Authorization" header');
    // Read the ID Token from the Authorization header.
    idToken = req.headers.authorization.split('Bearer ')[1];
  } else if (req.cookies) {
    console.log('Found "__session" cookie');
    // Read the ID Token from cookie.
    idToken = req.cookies.__session;
  } else {
    // No cookie
    res.status(403).send('Error parsing id token');
    return;
  }

  try {
    const decodedIdToken = await admin.auth().verifyIdToken(idToken);
    console.log('ID Token correctly decoded', decodedIdToken);
    req.user = decodedIdToken;
    next();
    return;
  } catch (error) {
    console.error('Error while verifying Firebase ID token:', error);
    res.status(403).send('Id token could not be decoded');
    return;
  }
};
*/

const regionalFunctions = functions.region('europe-west3');
const server = express();

export const createNestServer = async (expressInstance) => {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance),
  );
  return app.init();
};

createNestServer(server)
  .then(() => console.log('Nest Ready'))
  .catch((err) => console.error('Nest broken', err));

export const api = regionalFunctions.https.onRequest(server);

/*
// Temps Table Services
const temps = express();
temps.use(authMiddleWare);
admin.initializeApp();

temps.get('/', async (request, response) => {
  const snapshot = await admin.firestore().collection('temps').get();
  const idToken = request.headers.authorization.split('Bearer ')[1];

  admin
    .auth()
    .verifyIdToken(idToken)
    .then((decodedToken) => {
      const uid = decodedToken.uid;
      const temps = [];
      snapshot.forEach((document) => {
        const id = document.id;
        const data = document.data();
        if (data.uid === uid) {
          temps.push({ id, ...data });
        }
      });
      response.status(200).send(JSON.stringify(temps));
    })
    .catch((error) => {
      // Handle error
    });
});

temps.post('/', async (request, response) => {
  const idToken = request.headers.authorization.split('Bearer ')[1];

  admin
    .auth()
    .verifyIdToken(idToken)
    .then(async (decodedToken) => {
      const uid = decodedToken.uid;
      const temp = request.body;
      await admin.firestore().collection('temps').add({
        uid: uid,
        data: temp,
      });
      response.status(201).send();
    })
    .catch((error) => {
      // Handle error
    });
});

export const temp = regionalFunctions.https.onRequest(temps);
*/
