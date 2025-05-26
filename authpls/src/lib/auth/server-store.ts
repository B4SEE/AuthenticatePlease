import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

interface User {
  id: string;
  username: string;
  hashedPassword: string;
}

const USERS_FILE = path.join(process.cwd(), 'users.json');
const SALT_ROUNDS = 10;

// Initialize users file if it doesn't exist
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify([]));
}

// Load users from file
const loadUsers = (): User[] => {
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

// Save users to file
const saveUsers = (users: User[]): void => {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

export const findUser = (username: string): User | undefined => {
  const users = loadUsers();
  return users.find(u => u.username === username);
};

export const createUser = async (username: string, password: string): Promise<User> => {
  const users = loadUsers();
  
  if (findUser(username)) {
    throw new Error('User already exists');
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const user: User = {
    id: Math.random().toString(36).substr(2, 9),
    username,
    hashedPassword
  };

  users.push(user);
  saveUsers(users);
  return user;
};

export const verifyPassword = async (user: User, password: string): Promise<boolean> => {
  return bcrypt.compare(password, user.hashedPassword);
}; 