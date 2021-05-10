import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import * as express from 'express';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

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
  .then((v) => console.log('Nest Ready'))
  .catch((err) => console.error('Nest broken', err));

export const api = regionalFunctions.https.onRequest(server);

// Temps Table Services
const temps = express();
admin.initializeApp();

temps.get('/', async (request, response) => {
  const snapshot = await admin.firestore().collection('temps').get();
  const temps = [];
  snapshot.forEach((document) => {
    const id = document.id;
    const data = document.data();
    temps.push({ id, ...data });
  });
  response.status(200).send(JSON.stringify(temps));
});

temps.post('/', async (request, response) => {
  const temp = request.body;
  await admin.firestore().collection('temps').add(temp);
  response.status(201).send();
});

export const temp = regionalFunctions.https.onRequest(temps);
