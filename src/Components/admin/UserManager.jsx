import React, { useState } from 'react';
import './styles/UserManager.css';

const UserManager = () => {
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'user', quizzesTaken: 5 },
    { id: 2, name: 'Sarah Smith', email: 'sarah@example.com', role: 'admin', quizzesTaken: 3 },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'user', quizzesTaken: 8 },
  ]);

  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'user' });

  const handleAddUser = (e) => {
    e.preventDefault();
    setUsers([
      ...users,
      {
        id: users.length + 1,
        ...newUser,
        quizzesTaken: 0,
      },
    ]);
    setNewUser({ name: '', email: '', role: 'user' });
  };

  const handleDeleteUser = (id) => {
    setUsers(users.filter(user => user.id !== id));
  };

  const handleRoleChange = (id, newRole) => {
    setUsers(users.map(user => 
      user.id === id ? { ...user, role: newRole } : user
    ));
  };

  return (
    <div className="user-manager">
      <h2>User Management</h2>
      
      <div className="user-form">
        <h3>Add New User</h3>
        <form onSubmit={handleAddUser}>
          <input
            type="text"
            placeholder="Name"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            required
          />
          <select
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit">Add User</button>
        </form>
      </div>

      <div className="user-list">
        <h3>Existing Users</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Quizzes Taken</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td>{user.quizzesTaken}</td>
                <td>
                  <button onClick={() => handleDeleteUser(user.id)} className="delete-btn">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManager;
