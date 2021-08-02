import { Params } from '@feathersjs/feathers';
import { NotAuthenticated, NotFound } from '@feathersjs/errors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Application } from '@/declarations';

interface Data {
  email: string;
  password: string;
}

export class Session {
  app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  async create(data: Data, params: Params): Promise<{ user: Record<string, any>, token: string }> {
    const { email, password } = data;

    //@ts-ignore
    const user: Record<string, any> = (await this.app
      .service('security/user')
      .find({
        query: {
          email,
          $resolve: {
            role: true,
          },
        },
        paginate: false,
        internal: true,
       }))[0];

    if (!user) {
      throw new NotFound('No user found with this email');
    }

    if (!bcrypt.compareSync(password, user.password)) {
      throw new NotAuthenticated('Invalid credentials');
    }

    const token = jwt.sign({ _id: user._id }, this.app.get('jwtSecret'));

    return { user, token };
  }

  async find(params: Params): Promise<{ data: Record<string, any> }> {
    if (!params.user) throw new Error('An error occured');

    return { data: params.user };    
  }
}
