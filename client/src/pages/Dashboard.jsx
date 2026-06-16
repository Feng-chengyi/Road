import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../api.js';
import { Clock, Flame, TrendingUp, ChevronRight } from 'lucide-react';

const COLORS = ['#6366F1', '#22C55E', '#F59E0B', '#EF4444', '#3B82F6', '#8B5CF6'];

export default function Dashboard() {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [plans, setPlans] = useState([]);
  const [todayStr] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  });

  useEffect(() => {
    api.get('/subjects').then((r) => setSubjects(r.data));
    api.get(`/plans?date=${todayStr}`).then((r) => setPlans(r.data));
  }, [todayStr]);

  const todayPlans = plans;
  const doneCount = todayPlans.filter((p) => p.done).length;
  const totalCount = todayPlans.length;
  const completion = totalCount ? Math.round((doneCount / totalCount) * 100) : 0;

  const togglePlan = async (plan) => {
    await api.put(`/plans/${plan.id}`, { done: !plan.done });
    setPlans((prev) => prev.map((p) => p.id === plan.id ? { ...p, done: !p.done } : p));
  };

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 6) return '夜深了';
    if (h < 12) return '早上好';
    if (h < 14) return '中午好';
    if (h < 18) return '下午好';
    return '晚上好';
  })();

  return (
    <div className="page">
      <div className="px-5 pt-12 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">{greeting}</p>
            <h1 className="text-xl font-bold mt-0.5">{user?.name || '同学'}</h1>
          </div>
          <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center text-white font-bold text-sm">
            {user?.name?.charAt(0) || '?'}
          </div>
        </div>
      </div>

      <div className="px-5 space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <StatCard icon={<Clock size={16} />} label="今日学时" value={`${(subjects.reduce((s, sub) => s + sub.daily_hours, 0)).toFixed(1)}h`} color="text-brand-400" />
          <StatCard icon={<Flame size={16} />} label="累计天数" value={user?.stats?.totalDays || 0} color="text-green-400" />
          <StatCard icon={<TrendingUp size={16} />} label="完成率" value={`${completion}%`} color="text-purple-400" />
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold">科目进度</h2>
            <span className="text-xs text-gray-500">{subjects.length} 个科目</span>
          </div>
          {subjects.length === 0 ? (
            <p className="text-xs text-gray-500 text-center py-4">暂无科目，请先添加</p>
          ) : (
            <div className="space-y-3">
              {subjects.map((s) => (
                <div key={s.id}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                      {s.name}
                    </span>
                    <span className="text-xs text-gray-500 font-mono">{s.progress}%</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${s.progress}%`, background: s.color }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold">今日计划</h2>
            <span className="text-xs text-gray-500">{doneCount}/{totalCount} 已完成</span>
          </div>
          {todayPlans.length === 0 ? (
            <p className="text-xs text-gray-500 text-center py-4">今天还没有计划</p>
          ) : (
            <div className="space-y-2">
              {todayPlans.map((p) => (
                <div key={p.id} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0"
                  onClick={() => togglePlan(p)}>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                    p.done ? 'bg-green-500 border-green-500' : 'border-gray-600'
                  }`}>
                    {p.done && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm truncate ${p.done ? 'text-gray-500 line-through' : ''}`}>{p.name}</p>
                    <p className="text-xs text-gray-500">{p.time} · {p.duration}</p>
                  </div>
                  {p.subject_name && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full flex-shrink-0"
                      style={{ background: `${p.subject_color}20`, color: p.subject_color }}>
                      {p.subject_name}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <div className="card flex flex-col items-center py-4">
      <div className={`${color} mb-1`}>{icon}</div>
      <span className={`text-xl font-bold font-mono ${color}`}>{value}</span>
      <span className="text-[10px] text-gray-500 mt-0.5">{label}</span>
    </div>
  );
}
