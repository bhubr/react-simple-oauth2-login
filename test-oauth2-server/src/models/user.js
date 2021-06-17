const users = [
  {
    id: 1,
    name: 'Peggy Ross',
    picture: 'https://randomuser.me/api/portraits/women/94.jpg',
    email: 'peggy@example.com',
    password: 'pass',
  },
  {
    id: 2,
    name: 'Dwight Gonzales',
    picture: 'https://randomuser.me/api/portraits/men/77.jpg',
    email: 'dwight@example.com',
    password: 'pass',
  },
];

module.exports = {
  findById: async (id) => {
    const user = users.find(u => u.id === id);
    if (!user) {
      throw new Error(`Could not find user with id ${id}`);
    } else {
      return user;
    }
  },

  findOneByEmail: async (email) => {
    const user = users.find(u => u.email === email);
    if (!user) {
      throw new Error(`Could not find user with email ${email}`);
    } else {
      return user;
    }
  },

  findOne: async (email, password) => {
    const user = await this.findOneByEmail(email);
    if (user.password !== password) {
      throw new Error(`Invalid password for user ${user.id}`);
    }
    return user;
  },
};
