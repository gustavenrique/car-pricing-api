import { ResponseWrapper } from 'src/domain/dtos/response-wrapper';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { UserDto } from 'src/domain/dtos/users/user.dto';
import { UsersModule } from 'src/modules/users.module';
import { AppModule } from 'src/modules/app.module';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';

describe('Authentication', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture = await Test.createTestingModule({
            imports: [AppModule, UsersModule],
        }).compile();

        app = moduleFixture.createNestApplication();

        await app.init();
    });

    afterAll(async () => await app.close());

    it('signup', async () => {
        const emailReq = 'test@user.com';

        const res: request.Response = await request(app.getHttpServer())
            .post('/auth/signup')
            .send({ email: emailReq, password: 'testing' });

        const { data, status, message } = res.body as ResponseWrapper<UserDto>;

        expect(data).toBeDefined();
        expect(status).toEqual(HttpStatus.CREATED);
        expect(message).toContain('User created successfully');

        expect(data.id).toBeDefined();
        expect(data.email).toEqual(emailReq);
    });

    it('signin', async () => {
        // sign up first
        const authReq = { email: 'test@user.com', password: 'testing' };

        const res: request.Response = await request(app.getHttpServer()).post('/auth/signup').send(authReq);

        const { data: signupResponse, status, message } = res.body as ResponseWrapper<UserDto>;

        expect(signupResponse).toBeDefined();
        expect(status).toEqual(HttpStatus.CREATED);
        expect(message).toContain('User created successfully');

        expect(signupResponse.id).toBeDefined();
        expect(signupResponse.email).toEqual(authReq.email);

        const authCookie = res.get('Set-Cookie');

        // check if it is really signed in
        const resWhoAmI = await request(app.getHttpServer()).get('/auth/whoami').set('Cookie', authCookie);

        const signedInUser = resWhoAmI.body as ResponseWrapper<UserDto>;

        expect(signedInUser.data).toBeDefined();
        expect(signedInUser.status).toEqual(HttpStatus.OK);
        expect(signedInUser.message).toContain('User returned successfully');

        expect(signedInUser.data.id).toEqual(signupResponse.id);
        expect(signedInUser.data.email).toEqual(authReq.email);
    });
});
