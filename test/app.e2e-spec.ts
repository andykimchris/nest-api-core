import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { describe } from 'node:test';
import * as pactum from 'pactum';
import { AuthDto } from 'src/auth/dto';
import { EditBookmarkDTO } from 'src/bookmark/dto';
import { DbPrismaService } from '../src/db-prisma/db-prisma.service';
import { EditUserDto } from '../src/user/dto';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prisma: DbPrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
    await app.listen(3333);

    prisma = app.get(DbPrismaService);
    await prisma.cleanDatabase();

    pactum.request.setBaseUrl('http://localhost:3333');
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'abcad@gmail.com',
      password: '2134wer',
    };
    describe('Register', () => {
      it('should check password is non empty', () => {
        const dtoWithoutPassword = {
          email: 'abca@gmail.com',
        };
        return pactum
          .spec()
          .post('/auth/register')
          .withBody(dtoWithoutPassword)
          .expectStatus(400);
      });

      it('should register a user', () => {
        return pactum
          .spec()
          .post('/auth/register')
          .withBody(dto)
          .expectStatus(201);
      });
    });
    describe('Login', () => {
      it('should login a user', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody(dto)
          .expectStatus(200)
          .stores('user_access_token', 'access_token');
      });
    });
  });

  describe('User', () => {
    describe('Get', () => {
      it('should get a user', () => {
        return pactum
          .spec()
          .get('/users/')
          .withHeaders({ Authorization: 'Bearer $S{user_access_token}' })
          .expectStatus(200);
      });
    });

    describe('Patch', () => {
      it('should update a user', () => {
        const dto: EditUserDto = {
          firstName: 'Andrew',
          lastName: 'Kim',
        };
        return pactum
          .spec()
          .patch('/users/')
          .withHeaders({ Authorization: 'Bearer $S{user_access_token}' })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.firstName)
          .expectBodyContains(dto.lastName);
      });
    });
  });
});
