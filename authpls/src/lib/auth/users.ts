interface User {
  id: string;
  username: string;
  // We don't store passwords on the client side at all
}

// Load users from localStorage or initialize empty array
const loadUsers = (): User[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('users');
  return stored ? JSON.parse(stored) : [];
};

// Save users to localStorage
const saveUsers = (users: User[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('users', JSON.stringify(users));
};

// Get users array
const getUsers = (): User[] => {
  const users = loadUsers();
  return users;
};

// Find user by username
export const findUser = (username: string): User | undefined => {
  const users = getUsers();
  return users.find(u => u.username === username);
};

// Add user to local storage (only stores public info)
export const addUserToLocalStorage = (user: { id: string; username: string }): User => {
  const users = getUsers();
  
  if (findUser(user.username)) {
    throw new Error('User already exists in local storage');
  }

  const localUser: User = {
    id: user.id,
    username: user.username
  };

  users.push(localUser);
  saveUsers(users);
  return localUser;
}; 