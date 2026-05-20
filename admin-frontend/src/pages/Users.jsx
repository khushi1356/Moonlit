import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Search, Users, CheckCircle, XCircle } from 'lucide-react';
import { getAllUsers, updateUser, deleteUser } from '../api/adminApi';
import toast from 'react-hot-toast';

const UsersPage = React.memo(() => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getAllUsers();
      setUsers(res.data || res || []);
    } catch {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await deleteUser(id);
      toast.success('User deleted');
      fetchUsers();
    } catch { toast.error('Failed to delete user'); }
  };

  const handleRoleChange = async (id, role) => {
    try {
      await updateUser(id, { role });
      toast.success('Role updated');
      fetchUsers();
    } catch { toast.error('Failed to update role'); }
  };

  const filtered = useMemo(() => {
    return users.filter(u =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
    );
  }, [users, search]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="page-header" style={{ alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Users</h1>
          <p className="page-sub">{users.length} registered accounts</p>
        </div>
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
            <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text" placeholder="Search by name or email..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="input" style={{ paddingLeft: '36px', padding: '9px 12px 9px 36px' }}
            />
          </div>
        </div>

        {loading ? (
          <div className="loading-center"><div className="spinner" /></div>
        ) : (
          <>
            <div className="desktop-only" style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Profile</th>
                    <th>Contact Info</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length > 0 ? filtered.map((u, i) => (
                    <motion.tr key={u._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          {u.profilePic ? (
                            <img src={u.profilePic} alt={u.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                          ) : (
                            <div className="avatar" style={{ width: '40px', height: '40px', background: 'var(--purple-dim)', color: 'var(--purple)' }}>
                              {u.name ? u.name.charAt(0) : 'U'}
                            </div>
                          )}
                          <span style={{ fontWeight: '600', fontSize: '14px', color: 'var(--text-primary)' }}>{u.name || 'Unnamed User'}</span>
                        </div>
                      </td>
                      <td>
                        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '2px' }}>{u.email}</p>
                        <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{u.phone || 'No phone number'}</p>
                      </td>
                      <td>
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u._id, e.target.value)}
                          style={{
                            background: 'var(--bg-input)', border: '1px solid var(--border)',
                            borderRadius: '8px', padding: '4px 8px', fontSize: '12px', fontWeight: '500',
                            color: 'var(--text-primary)', outline: 'none', cursor: 'pointer'
                          }}
                        >
                          <option value="user">User</option>
                          <option value="stylist">Stylist</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td>
                        {u.isEmailVerified ? (
                          <span className="badge badge-green" style={{ display: 'inline-flex', gap: '4px' }}>
                            <CheckCircle size={10} /> Verified
                          </span>
                        ) : (
                          <span className="badge badge-amber" style={{ display: 'inline-flex', gap: '4px' }}>
                            <XCircle size={10} /> Pending
                          </span>
                        )}
                      </td>
                      <td>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <button className="btn-danger hover-opacity" style={{ padding: '8px' }} onClick={() => handleDelete(u._id)}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  )) : (
                    <tr>
                      <td colSpan={5}>
                        <div className="empty-state">
                          <Users size={36} />
                          <p style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>No users found</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {}
            <div className="mobile-only" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {filtered.length > 0 ? filtered.map((u, i) => (
                <div key={u._id || i} style={{ border: '1px solid var(--border)', borderRadius: '12px', padding: '16px', background: 'var(--bg-card)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {u.profilePic ? (
                        <img src={u.profilePic} alt={u.name} style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} />
                      ) : (
                        <div className="avatar" style={{ width: '48px', height: '48px', fontSize: '18px', background: 'var(--purple-dim)', color: 'var(--purple)' }}>
                          {u.name ? u.name.charAt(0) : 'U'}
                        </div>
                      )}
                      <div>
                        <span style={{ fontWeight: '700', fontSize: '15px', color: 'var(--text-primary)', display: 'block' }}>{u.name || 'Unnamed User'}</span>
                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{u.email}</p>
                        {u.phone && <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{u.phone}</p>}
                      </div>
                    </div>
                    {u.isEmailVerified ? (
                      <span className="badge badge-green" style={{ display: 'inline-flex', gap: '4px', padding: '4px 8px' }}>
                        <CheckCircle size={10} />
                      </span>
                    ) : (
                      <span className="badge badge-amber" style={{ display: 'inline-flex', gap: '4px', padding: '4px 8px' }}>
                        <XCircle size={10} />
                      </span>
                    )}
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Role:</span>
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        style={{
                          background: 'var(--bg-input)', border: '1px solid var(--border)',
                          borderRadius: '6px', padding: '4px 8px', fontSize: '12px', fontWeight: '500',
                          color: 'var(--text-primary)', outline: 'none', cursor: 'pointer'
                        }}
                      >
                        <option value="user">User</option>
                        <option value="stylist">Stylist</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    <button className="btn-danger" style={{ padding: '8px' }} onClick={() => handleDelete(u._id)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              )) : (
                <div className="empty-state">
                  <Users size={36} />
                  <p style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>No users found</p>
                </div>
              )}
            </div>

            <style>{`.hover-opacity { opacity: 0; transition: opacity 0.2s; } tr:hover .hover-opacity { opacity: 1; }`}</style>
          </>
        )}
      </div>
    </div>
  );
});

export default UsersPage;
