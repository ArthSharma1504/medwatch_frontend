import { useState, useEffect, useRef } from 'react';
import Card from '../../../components/Card';
import Modal from '../../../components/Modal';
import useAppStore from '../../../store/useAppStore';
import { exportToCSV } from '../../../services/csvParser';
import gsap from 'gsap';

const UsersPage = () => {
  const { users, addUser, updateUser, deleteUser } = useAppStore();
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
      );
    }
  }, []);

  const handleAddUser = () => {
    setEditingUser(null);
    setShowModal(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowModal(true);
  };

  const handleSaveUser = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const userData = {
      name: formData.get('name'),
      role: formData.get('role'),
      email: formData.get('email'),
      active: formData.get('active') === 'on',
    };

    if (editingUser) {
      updateUser(editingUser.id, userData);
    } else {
      addUser(userData);
    }

    setShowModal(false);
  };

  const handleExport = () => {
    exportToCSV(users, 'users_export.csv');
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div ref={containerRef} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User & Role Management</h1>
          <p className="text-gray-700 mt-1 font-medium">Manage hospital staff and permissions</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleExport}
            className="bg-accent-blue text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition flex items-center gap-2"
          >
            <i className="ri-download-line"></i>
            Export / Export Karein
          </button>
          <button
            onClick={handleAddUser}
            className="bg-cta-green text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition flex items-center gap-2"
          >
            <i className="ri-user-add-line"></i>
            Add User / User Add Karein
          </button>
        </div>
      </div>

      <Card title="Search Users" icon="ri-search-line">
        <input
          type="text"
          placeholder="Search by name, email, or role..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal"
        />
      </Card>

      <Card title={`All Users (${filteredUsers.length})`} icon="ri-team-line" noPadding>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-light-teal">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-dark-text">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-dark-text">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-dark-text">Role</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-dark-text">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-dark-text">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-light-teal transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-teal text-white rounded-full flex items-center justify-center font-bold">
                        {user.name.charAt(0)}
                      </div>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className="bg-accent-blue text-white px-3 py-1 rounded-full text-sm">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {user.active ? (
                      <span className="text-cta-green flex items-center gap-1">
                        <i className="ri-checkbox-circle-fill"></i>
                        Active
                      </span>
                    ) : (
                      <span className="text-red-500 flex items-center gap-1">
                        <i className="ri-close-circle-fill"></i>
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="text-primary-teal hover:bg-light-teal p-2 rounded transition"
                      >
                        <i className="ri-edit-line"></i>
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this user?')) {
                            deleteUser(user.id);
                          }
                        }}
                        className="text-red-500 hover:bg-red-50 p-2 rounded transition"
                      >
                        <i className="ri-delete-bin-line"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add/Edit User Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingUser ? 'Edit User' : 'Add New User'}
      >
        <form onSubmit={handleSaveUser} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              defaultValue={editingUser?.name}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              defaultValue={editingUser?.email}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Role</label>
            <select
              name="role"
              defaultValue={editingUser?.role}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal"
            >
              <option value="Doctor">Doctor</option>
              <option value="Nurse">Nurse</option>
              <option value="Receptionist">Receptionist</option>
              <option value="Lab Technician">Lab Technician</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="active"
              defaultChecked={editingUser?.active ?? true}
              className="w-5 h-5"
            />
            <label className="font-medium">Active User</label>
          </div>

          <button
            type="submit"
            className="w-full bg-cta-green text-white py-3 rounded-lg hover:bg-opacity-90 transition font-semibold"
          >
            {editingUser ? 'Update User' : 'Add User'} / Save Karein
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default UsersPage;
