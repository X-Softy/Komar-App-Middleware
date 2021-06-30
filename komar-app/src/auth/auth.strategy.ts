import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy, ExtractJwt } from 'passport-firebase-jwt';
import * as config from './auth.config.json';
import * as firebase from 'firebase-admin';

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

@Injectable()
export class AuthStrategy extends PassportStrategy(Strategy, 'firebase-auth') {
  private app: firebase.app.App;

  constructor() {
    super({ jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken() });

    this.app = firebase.initializeApp({
      credential: firebase.credential.cert(params),
    });
  }

  async validate(token: string) {
    const user = await this.app
      .auth()
      .verifyIdToken(token, true)
      .catch((error) => {
        throw new UnauthorizedException(error.message);
      });
    if (!user) {
      throw new UnauthorizedException();
    } else {
      return user;
    }
  }
}
