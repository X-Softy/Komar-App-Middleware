import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy, ExtractJwt } from 'passport-firebase-jwt';
import * as firebase from 'firebase-admin';
import { FirebaseFactory } from 'src/utils/firebase.factory';

@Injectable()
export class AuthStrategy extends PassportStrategy(Strategy, 'firebase-auth') {
  private app: firebase.app.App;

  constructor() {
    super({ jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken() });
    this.app = FirebaseFactory.shared.app;
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
