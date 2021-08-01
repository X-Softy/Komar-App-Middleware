import * as config from './config.json';
import * as firebase from 'firebase-admin';

export class FirebaseFactory {
  static shared = new FirebaseFactory();

  app: firebase.app.App;

  private constructor() {
    const params = {
      type: config.type,
      projectId: config.project_id,
      privateKeyId: config.private_key_id,
      privateKey: config.private_key,
      clientEmail: config.client_email,
      clientId: config.client_id,
      authUri: config.auth_uri,
      tokenUri: config.token_uri,
      authProviderX509CertUrl: config.auth_provider_x509_cert_url,
      clientC509CertUrl: config.client_x509_cert_url,
    };
    this.app = firebase.initializeApp({
      credential: firebase.credential.cert(params),
    });
  }
}
