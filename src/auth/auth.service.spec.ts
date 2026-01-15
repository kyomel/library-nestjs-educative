import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  genSalt: jest.fn().mockResolvedValue('someSalt'),
  hash: jest.fn().mockResolvedValue('hashedPassword'),
  compare: jest.fn().mockResolvedValue(true),
}));

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
type MockJwtService = Partial<Record<keyof JwtService, jest.Mock>>;

let mockJwtService = {
  signAsync: jest.fn(),
};
let mockRepository = {
  create: jest.fn(),
  save: jest.fn(),
  findOneBy: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: MockJwtService;
  let userRepository: MockRepository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get(AuthService);
    userRepository = module.get(getRepositoryToken(User));
    jwtService = module.get(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signUp', () => {
    it('should throw ConflictException if email is in use', async () => {
      const signUpDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      userRepository.save.mockRejectedValue({
        code: '23505',
        detail: 'Key (email)=(test@example.com) already exists.',
      });
      const signUpAction = service.signUp(signUpDto);
      await expect(signUpAction).rejects.toThrow(ConflictException);
    });

    it('should throw an error if an unexpected error occurs', async () => {
      const signUpDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      userRepository.save.mockRejectedValue(new Error('Unexpected error'));
      const signUpAction = service.signUp(signUpDto);
      await expect(signUpAction).rejects.toThrow(Error);
    });

    it('should create a new user with a hashed password if the email is not in use', async () => {
      const signUpDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      userRepository.create.mockImplementation((userData) => ({ ...userData }));
      userRepository.save.mockResolvedValue({});

      const signUpAction = service.signUp(signUpDto);
      await expect(signUpAction).resolves.not.toThrowError();
      expect(userRepository.create).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'hashedPassword',
      });
      expect(userRepository.save).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'hashedPassword',
      });
    });
  });

  describe('signIn', () => {
    it("should throw UnauthorizedException if email doesn't exists", async () => {
      const signInDto = {
        email: 'invalid@example.com',
        password: 'wrongPassword',
      };
      userRepository.findOneBy.mockResolvedValue(null);
      const signInAction = service.signIn(signInDto);
      await expect(signInAction).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is wrong', async () => {
      const signInDto = {
        email: 'valid@example.com',
        password: 'wrongPassword',
      };

      const mockUser = {
        id: 1,
        email: 'valid@example.com',
        password: 'hashedPassword',
      };
      userRepository.findOneBy.mockResolvedValue(mockUser);
      const compare = jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(false));
      const signInAction = service.signIn(signInDto);
      await expect(signInAction).rejects.toThrow(UnauthorizedException);
      expect(compare).toHaveBeenCalledWith('wrongPassword', 'hashedPassword');
    });

    it('should return an access token for valid credentials', async () => {
      const signInDto = {
        email: 'valid@example.com',
        password: 'password123',
      };

      const user = {
        id: 1,
        email: 'valid@example.com',
        password: 'hashedPassword',
      };
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(true));
      userRepository.findOneBy.mockResolvedValue(user);
      mockJwtService.signAsync.mockResolvedValue('token123');

      const result = await service.signIn(signInDto);
      expect(result).toEqual({ accessToken: 'token123' });
    });
  });
});
