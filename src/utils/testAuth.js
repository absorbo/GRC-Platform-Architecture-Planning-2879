```javascript
export const testAuth = {
  createTestUser: async (database, userData) => {
    try {
      const user = await database.createUser(userData);
      console.log('Test user created:', user);
      return user;
    } catch (error) {
      console.error('Error creating test user:', error);
      throw error;
    }
  },

  loginTestUser: async (auth, email, password) => {
    try {
      const user = await auth.login(email, password);
      console.log('Test user logged in:', user);
      return user;
    } catch (error) {
      console.error('Error logging in test user:', error);
      throw error;
    }
  },

  verifyUserAccess: (user, expectedRole) => {
    console.log('Verifying user access:', {
      user,
      expectedRole,
      hasAccess: user?.role === expectedRole
    });
    return user?.role === expectedRole;
  }
};
```