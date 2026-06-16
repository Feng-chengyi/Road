import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../api.js';
import { LogOut, ChevronRight, Pencil, X } from 'lucide-react';

export default function Profile() {
  const { user, logout, updateUser } = useAuth();
  const [stats, setStats] = useState({ totalHours: 0, totalDays: 0, avgProgress: 0, subjectCount: 0 });
  const [showEdit, setShowEdit] = useState(false);
  const [form, setForm] = useState({ name: '', school: '', major: '', examYear: 2026 });

  useEffect(() => {
    api.get('/profile').then((r) => {
      setStats(r.data.stats);
      setForm({ name: r.data.name, school: r.data.school, major: r.data.major, examYear: r.data.exam_year });
    });
  }, []);

  const saveProfile = async () => {
    const res = await api.put('/profile', form);
    updateUser(res.data);
    setShowEdit(false);
  };

  return (
    <div className="page">
      <div className="px-5 pt-12 pb-2">
        <h1 className="text-xl font-bold">个人中心</h1>
      </div>

      <div className="px-5 mt-4">
        <div className="card text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-br from-brand-500/10 to-purple-500/10" />
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-brand-500 flex items-center justify-center text-white text-2xl font-bold mx-auto border-4 border-surface-1">
              {user?.name?.charAt(0) || '?'}
            </div>
            <h2 className="text-lg font-bold mt-3">{user?.name}</h2>
            <p className="text-xs text-gray-500 mt-1">
              {user?.school && `目标：${user.school}`}
              {user?.major && ` · ${user.major}`}
            </p>
            <div className="grid grid-cols-3 gap-px bg-white/5 rounded-xl overflow-hidden mt-4">
              <div className="bg-surface-1 py-3 text-center">
                <div className="text-lg font-bold font-mono text-brand-400">{stats.totalHours}</div>
                <div className="text-[10px] text-gray-500">总学时/h</div>
              </div>
              <div className="bg-surface-1 py-3 text-center">
                <div className="text-lg font-bold font-mono text-green-400">{stats.totalDays}</div>
                <div className="text-[10px] text-gray-500">累计天数</div>
              </div>
              <div className="bg-surface-1 py-3 text-center">
                <div className="text-lg font-bold font-mono text-purple-400">{stats.avgProgress}%</div>
                <div className="text-[10px] text-gray-500">平均进度</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <button onClick={() => setShowEdit(true)}
            className="card w-full flex items-center gap-3 hover:bg-surface-2 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-400">
              <Pencil size={16} />
            </div>
            <div className="flex-1 text-left">
              <div className="text-sm font-medium">编辑资料</div>
              <div className="text-[10px] text-gray-500">姓名、院校、专业</div>
            </div>
            <ChevronRight size={16} className="text-gray-600" />
          </button>

          <button onClick={logout}
            className="card w-full flex items-center gap-3 hover:bg-surface-2 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400">
              <LogOut size={16} />
            </div>
            <div className="flex-1 text-left">
              <div className="text-sm font-medium text-red-400">退出登录</div>
            </div>
            <ChevronRight size={16} className="text-gray-600" />
          </button>
        </div>

        <p className="text-center text-[10px] text-gray-600 mt-6">研途 v1.0.0</p>
      </div>

      {showEdit && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center" onClick={() => setShowEdit(false)}>
          <div className="bg-surface-1 rounded-t-3xl w-full max-w-[430px] p-6 pb-10 animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold">编辑资料</h2>
              <button onClick={() => setShowEdit(false)} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400">
                <X size={16} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">姓名</label>
                <input className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">目标院校</label>
                <input className="input-field" value={form.school} onChange={(e) => setForm({ ...form, school: e.target.value })} />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">目标专业</label>
                <input className="input-field" value={form.major} onChange={(e) => setForm({ ...form, major: e.target.value })} />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">考试年份</label>
                <select className="input-field" value={form.examYear} onChange={(e) => setForm({ ...form, examYear: +e.target.value })}>
                  <option value={2026}>2026年考研</option>
                  <option value={2027}>2027年考研</option>
                  <option value={2028}>2028年考研</option>
                </select>
              </div>
            </div>
            <button className="btn-primary mt-6" onClick={saveProfile}>保存</button>
          </div>
        </div>
      )}
    </div>
  );
}
