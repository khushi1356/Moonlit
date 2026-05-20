import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Edit2, Save, X, Star, Briefcase, Clock } from 'lucide-react';
import { getStylistProfile, updateStylistProfile } from '../api/stylistApi';
import toast from 'react-hot-toast';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '' });

  const fetchProfile = async () => {
    try {
      const res = await getStylistProfile();
      const data = res.data || res;
      setProfile(data);
      setForm({ name: data?.name || '', phone: data?.phone || '' });
    } catch {
      const stored = JSON.parse(localStorage.getItem('stylistUser') || '{}');
      setProfile(stored);
      setForm({ name: stored?.name || '', phone: stored?.phone || '' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await updateStylistProfile(form);
      const updated = res.user || res.data || { ...profile, ...form };
      setProfile(updated);
      localStorage.setItem('stylistUser', JSON.stringify(updated));
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="loading-center"><div className="spinner" /></div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <div className="page-header" style={{ marginBottom: '0' }}>
        <div>
          <h1 className="page-title">My Profile</h1>
          <p className="page-sub">Manage your personal information</p>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ overflow: 'hidden' }}>
        {}
        <div style={{ height: '120px', background: 'linear-gradient(135deg, var(--rose-dim), var(--purple-dim))' }}></div>

        <div style={{ padding: '0 32px 32px' }}>
          {}
          <div style={{ position: 'relative', marginTop: '-48px', marginBottom: '24px' }}>
            <div style={{
              width: '96px', height: '96px', borderRadius: '50%',
              border: '4px solid var(--bg-card)', background: 'var(--bg-input)',
              overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
            }}>
              {profile?.profilePic ? (
                <img src={profile.profilePic} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={profile?.name} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--amber-dim)', color: 'var(--amber)', fontSize: '32px', fontWeight: '700' }}>
                  {profile?.name ? profile.name.charAt(0) : 'S'}
                </div>
              )}
            </div>
          </div>

          {isEditing ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Full Name</label>
                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Phone Number</label>
                <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="input" placeholder="+91 XXXXX XXXXX" />
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button onClick={handleSave} disabled={saving} className="btn-primary" style={{ opacity: saving ? 0.7 : 1 }}>
                  <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button onClick={() => setIsEditing(false)} className="btn-ghost">
                  <X size={16} /> Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px', fontWeight: '700', color: 'var(--text-primary)' }}>{profile?.name || 'Stylist'}</h2>
                  <p style={{ fontSize: '14px', color: 'var(--rose)', fontWeight: '600', marginTop: '4px' }}>{profile?.specialization || 'Hair & Beauty Specialist'}</p>
                </div>
                <button onClick={() => setIsEditing(true)} className="btn-ghost" style={{ padding: '8px 16px', fontSize: '12px' }}>
                  <Edit2 size={14} /> Edit
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '32px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--bg-card-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                    <Mail size={18} />
                  </div>
                  <div>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: '600' }}>Email</p>
                    <p style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: '500' }}>{profile?.email || '—'}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--bg-card-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                    <Phone size={18} />
                  </div>
                  <div>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: '600' }}>Phone</p>
                    <p style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: '500' }}>{profile?.phone || 'Not set'}</p>
                  </div>
                </div>

                {profile?.experience && (
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--bg-card-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                      <Briefcase size={18} />
                    </div>
                    <div>
                      <p style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: '600' }}>Experience</p>
                      <p style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: '500' }}>{profile.experience} years</p>
                    </div>
                  </div>
                )}

                {profile?.rating && (
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--amber-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--amber)' }}>
                      <Star size={18} style={{ fill: 'var(--amber)' }} />
                    </div>
                    <div>
                      <p style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: '600' }}>Rating</p>
                      <p style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: '500' }}>{profile.rating} / 5.0</p>
                    </div>
                  </div>
                )}
              </div>

              {profile?.bio && (
                <div style={{ marginTop: '32px', padding: '20px', background: 'var(--bg-card-hover)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: '600', marginBottom: '8px' }}>About Me</p>
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{profile.bio}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '20px' }}>Account Details</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid var(--border)' }}>
            <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Account Type</span>
            <span className="badge badge-purple" style={{ textTransform: 'capitalize' }}>{profile?.role || 'Stylist'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid var(--border)' }}>
            <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Email Verified</span>
            {profile?.isEmailVerified ? (
              <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--green)' }}>✓ Verified</span>
            ) : (
              <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--amber)' }}>Pending</span>
            )}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Member Since</span>
            <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)' }}>
              {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : '—'}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
