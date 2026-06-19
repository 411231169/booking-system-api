const authService = require('../src/modules/auth/auth.service');
const authRepository = require('../src/modules/auth/auth.repository');
const bcrypt = require('bcrypt');

jest.mock('../src/modules/auth/auth.repository');
jest.mock('bcrypt');

describe('Auth Service', () => {
  describe('register', () => {
    it('should throw an error if email is already in use', async () => {
      authRepository.findUserByEmail.mockResolvedValue({ id: 1, email: 'test@example.com' });
      
      await expect(authService.register({ email: 'test@example.com', password: 'password' }))
        .rejects
        .toThrow('Email already in use');
    });

    it('should create a new user successfully', async () => {
      authRepository.findUserByEmail.mockResolvedValue(null);
      bcrypt.genSalt.mockResolvedValue('salt');
      bcrypt.hash.mockResolvedValue('hashedPassword');
      
      const mockUser = {
        id: 1,
        name: 'Test',
        email: 'test@example.com',
        role: 'CUSTOMER'
      };
      authRepository.createUser.mockResolvedValue(mockUser);
      
      const result = await authService.register({
        name: 'Test',
        email: 'test@example.com',
        password: 'password'
      });

      expect(result).toEqual(mockUser);
      expect(authRepository.createUser).toHaveBeenCalledWith({
        name: 'Test',
        email: 'test@example.com',
        password: 'hashedPassword'
      });
    });
  });
});
