import { motion } from 'framer-motion';
import { Bell, CheckCheck } from 'lucide-react';

const NotificationsList = ({ notifications, onMarkRead, onMarkAllRead }) => (
  <div className="lg:col-span-1">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-[10px] tracking-widest uppercase font-bold text-gray-400">Activity Log</h2>
      {notifications.some(n => !n.isRead) && (
        <button onClick={onMarkAllRead} className="text-[9px] font-bold uppercase tracking-widest text-[var(--color-primary)] hover:text-[#3AA89B] transition-colors flex items-center gap-1">
          <CheckCheck className="w-3 h-3" /> Mark Read
        </button>
      )}
    </div>
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col max-h-[560px]">
      <div className="p-4 border-b border-gray-50 flex items-center gap-2.5">
        <Bell className="w-4 h-4 text-[var(--color-primary)]" />
        <h3 className="font-serif text-base text-[var(--color-primary)]">Notifications</h3>
      </div>
      <div className="overflow-y-auto flex-1 p-2">
        {notifications.length === 0 ? (
          <div className="py-14 text-center">
            <Bell className="w-7 h-7 text-gray-200 mx-auto mb-3" />
            <p className="text-[11px] tracking-widest uppercase text-gray-400 font-bold">No recent activity</p>
          </div>
        ) : notifications.map((notif, i) => (
          <motion.div
            key={notif._id || i}
            initial={{ opacity: 0, x: 16 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => !notif.isRead && onMarkRead(notif._id)}
            className={`p-3 mb-1.5 rounded-lg cursor-pointer transition-all border ${notif.isRead ? 'bg-white border-transparent hover:bg-gray-50' : 'bg-[#3AA89B]/5 border-[#3AA89B]/20'}`}
          >
            <div className="flex gap-3">
              <div className={`mt-2 w-1.5 h-1.5 rounded-full shrink-0 ${notif.isRead ? 'bg-gray-200' : 'bg-[#3AA89B]'}`} />
              <div className="flex-1 min-w-0">
                {notif.title && <p className={`text-[11px] font-bold uppercase tracking-widest mb-1 truncate ${notif.isRead ? 'text-gray-400' : 'text-[var(--color-primary)]'}`}>{notif.title}</p>}
                <p className={`text-[12px] leading-snug ${notif.isRead ? 'text-gray-500' : 'text-gray-700 font-medium'}`}>{notif.message}</p>
                {notif.createdAt && (
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 mt-1.5 font-bold">
                    {new Date(notif.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);

export default NotificationsList;
