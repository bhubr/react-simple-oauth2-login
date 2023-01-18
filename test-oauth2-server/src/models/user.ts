export interface MyUser {
  id: string;
  name: string;
  picture: string;
  identifier: string;
  password: string;
}

export const users: MyUser[] = [
  {
    id: "uuid-0001",
    name: "Peggy Ross",
    picture: "https://randomuser.me/api/portraits/women/94.jpg",
    identifier: "peggy@example.com",
    password: "pass",
  },
  {
    id: "uuid-0002",
    name: "Dwight Gonzales",
    picture: "https://randomuser.me/api/portraits/men/77.jpg",
    identifier: "dwight@example.com",
    password: "pass",
  },
];

const userModel = {
  async findById(id: string) {
    const user = users.find((u) => u.id === id);
    if (!user) {
      throw new Error(`Could not find user with id ${id}`);
    } else {
      return user;
    }
  },

  async findOneByEmail(email: string) {
    const user = users.find((u) => u.identifier === email);
    if (!user) {
      throw new Error(`Could not find user with email ${email}`);
    } else {
      return user;
    }
  },

  async findOne(email: string, password: string) {
    const user = await this.findOneByEmail(email);
    if (user.password !== password) {
      throw new Error(`Invalid password for user ${user.id}`);
    }
    return user;
  },
};

export default userModel;
