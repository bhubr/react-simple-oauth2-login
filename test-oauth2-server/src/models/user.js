const users = [
  {
    id: 1,
    name: 'Peggy Ross',
    picture: 'https://randomuser.me/api/portraits/women/94.jpg',
    email: 'peggy.ross@example.com',
    password: 'pass',
  },
  {
    id: 2,
    name: 'Dwight Gonzales',
    picture: 'https://randomuser.me/api/portraits/men/77.jpg',
    email: 'dwight.gonzales@example.com',
    password: 'pass',
  },
];

module.exports = {
  findById: (id, cb) => {
    const user = users.find(u => u.id === id);
    if (!user) {
      cb(new Error(`Could not find user with id ${id}`));
    } else {
      cb(null, user)
    }
  },

  findOne: ({ email }, cb) => {
    const user = users.find(u => u.email === email);
    if (!user) {
      cb(new Error(`Could not find user with email ${email}`));
    } else {
      cb(null, user)
    }
  }
};
