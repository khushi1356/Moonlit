import { Mail, Phone, Edit2, LogOut } from 'lucide-react';
import { FadeUp } from '../../../components/animations';

const ProfileCard = ({ user, isEditing, setIsEditing, editForm, setEditForm, onUpdate, onLogout, loading }) => (
  <FadeUp>
    <div className="mb-14 flex flex-col md:flex-row items-center md:items-start gap-8 border-b border-gray-200 pb-12">
      <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-lg flex-shrink-0 bg-white">
        {user.profilePic ? (
          <img src={user.profilePic} alt={user.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-50 text-[var(--color-primary)] text-4xl font-serif uppercase">
            {user.name?.charAt(0) || '?'}
          </div>
        )}
      </div>

      <div className="flex-1 text-center md:text-left w-full">
        {isEditing ? (
          <div className="space-y-4 max-w-sm mx-auto md:mx-0">
            <div>
              <label className="text-[10px] tracking-widest uppercase font-bold text-gray-500">Name</label>
              <input type="text" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="w-full p-2.5 mt-1.5 bg-gray-50 border border-gray-200 text-sm text-[var(--color-primary)] rounded-lg outline-none focus:border-[var(--color-primary)] transition-all" />
            </div>
            <div>
              <label className="text-[10px] tracking-widest uppercase font-bold text-gray-500">Phone</label>
              <input type="text" value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} className="w-full p-2.5 mt-1.5 bg-gray-50 border border-gray-200 text-sm text-[var(--color-primary)] rounded-lg outline-none focus:border-[var(--color-primary)] transition-all" />
            </div>
            <div className="flex justify-center md:justify-start gap-3 pt-2">
              <button onClick={onUpdate} disabled={loading} className="px-5 py-2.5 bg-[var(--color-primary)] text-white text-[10px] font-bold uppercase tracking-widest rounded-lg shadow-sm hover:bg-[var(--color-primary)]/90 transition-all">
                {loading ? 'Saving...' : 'Save'}
              </button>
              <button onClick={() => setIsEditing(false)} className="px-5 py-2.5 border border-gray-200 text-gray-500 text-[10px] font-bold uppercase tracking-widest hover:border-gray-300 hover:bg-gray-50 transition-colors rounded-lg">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <h1 className="text-3xl md:text-4xl font-serif uppercase tracking-widest mb-3 text-[var(--color-primary)]">{user.name}</h1>
            <div className="flex flex-col gap-1.5 mb-6 items-center md:items-start">
              <span className="flex items-center gap-2 tracking-widest uppercase text-[11px] font-medium text-gray-500"><Mail className="w-3.5 h-3.5 text-[var(--color-primary)]" /> {user.email}</span>
              {user.phone && <span className="flex items-center gap-2 tracking-widest uppercase text-[11px] font-medium text-gray-500"><Phone className="w-3.5 h-3.5 text-[var(--color-primary)]" /> {user.phone}</span>}
            </div>
            <div className="flex justify-center md:justify-start gap-3">
              <button onClick={() => setIsEditing(true)} className="px-5 py-2.5 border border-gray-200 bg-white text-gray-700 text-[10px] font-bold uppercase tracking-widest hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all flex items-center gap-1.5 rounded-lg shadow-sm">
                <Edit2 className="w-3.5 h-3.5" /> Edit Profile
              </button>
              <button onClick={onLogout} className="px-5 py-2.5 border border-red-100 bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-widest hover:bg-red-100 transition-all flex items-center gap-1.5 rounded-lg">
                <LogOut className="w-3.5 h-3.5" /> Disconnect
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  </FadeUp>
);

export default ProfileCard;
