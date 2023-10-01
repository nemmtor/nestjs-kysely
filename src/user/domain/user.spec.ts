import { UserImplement, UserProperties } from './user';

describe('User', () => {
  describe('compareId', () => {
    it('should return true on same ids', () => {
      const user = new UserImplement({ id: 'id' } as UserProperties);
      expect(user.compareId('id')).toBe(true);
    });

    it('should return flase on different ids', () => {
      const user = new UserImplement({ id: 'id' } as UserProperties);
      expect(user.compareId('non-id')).toBe(false);
    });
  });
});
