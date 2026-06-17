import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../api.js';
import { Clock, Flame, TrendingUp, Target, Calendar } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [plans, setPlans] = useState([]);
  const [records, setRecords] = useState([]);
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
  const totalElapsed = todayPlans.reduce((sum, p) => sum + (p.elapsed_seconds || 0), 0);
  const goalHours = user?.daily_goal || 6;
  const studiedHours = totalElapsed / 3600;

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 6) return '夜深了';
    if (h < 12) return '早上好';
    if (h < 14) return '中午好';
    if (h < 18) return '下午好';
    return '晚上好';
  })();

  // Generate fake weekly data for chart (in real app, fetch from API)
  const weekData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dayNames = ['日', '一', '二', '三', '四', '五', '六'];
    return {
      label: `周${dayNames[d.getDay()]}`,
      value: i === 6 ? studiedHours : +(Math.random() * 4 + 2).toFixed(1),
    };
  });
  const maxVal = Math.max(...weekData.map((d) => d.value), 1);

  const subjectTotal = subjects.reduce((sum, s) => sum + (s.total_hours || 0), 0);

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
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard icon={<Clock size={16} />} label="今日学时"
            value={`${studiedHours.toFixed(1)}h`} sub={`目标 ${goalHours}h`} color="text-brand-400" />
          <StatCard icon={<Flame size={16} />} label="累计天数"
            value={user?.stats?.totalDays || 0} sub={`连续打卡`} color="text-green-400" />
          <StatCard icon={<TrendingUp size={16} />} label="完成率"
            value={`${completion}%`} sub={`${doneCount}/${totalCount}`} color="text-purple-400" />
        </div>

        {/* Daily goal progress */}
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold flex items-center gap-2">
              <Target size={14} className="text-brand-400" /> 今日目标
            </h2>
            <span className="text-xs font-mono text-brand-400">{Math.min(100, Math.round(studiedHours / goalHours * 100))}%</span>
          </div>
          <div className="h-3 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-brand-500 to-green-400 transition-all duration-500"
              style={{ width: `${Math.min(100, studiedHours / goalHours * 100)}%` }} />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-[10px] text-gray-500">{studiedHours.toFixed(1)}h 已学</span>
            <span className="text-[10px] text-gray-500">{goalHours}h 目标</span>
          </div>
        </div>

        {/* Weekly trend chart */}
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold flex items-center gap-2">
              <Calendar size={14} className="text-brand-400" /> 本周学习趋势
            </h2>
            <span className="text-xs text-gray-500">单位: 小时</span>
          </div>
          <div className="flex items-end gap-1.5" style={{ height: 120 }}>
            {weekData.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[9px] font-mono text-gray-500">{d.value}</span>
                <div className="w-full rounded-t-md transition-all duration-500"
                  style={{
                    height: `${(d.value / maxVal) * 80}px`,
                    background: i === 6
                      ? 'linear-gradient(180deg, #6366F1, #4F46E5)'
                      : 'linear-gradient(180deg, rgba(99,102,241,0.4), rgba(99,102,241,0.15))',
                  }} />
                <span className="text-[9px] text-gray-500">{d.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Subject progress */}
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold">科目进度</h2>
            <span className="text-xs text-gray-500">{subjects.length} 个科目 · 共 {subjectTotal.toFixed(0)}h</span>
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
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-gray-500">{s.total_hours || 0}h</span>
                      <span className="text-xs font-mono" style={{ color: s.color }}>{s.progress}%</span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${s.progress}%`, background: s.color }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Today's plans */}
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold">今日计划</h2>
            <span className="text-xs text-gray-500">{doneCount}/{totalCount} 已完成</span>
          </div>
          {todayPlans.length === 0 ? (
            <p className="text-xs text-gray-500 text-center py-4">今天还没有计划</p>
          ) : (
            <div className="space-y-2">
              {todayPlans.slice(0, 5).map((p) => (
                <div key={p.id} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    p.done ? 'bg-green-500 border-green-500' : 'border-gray-600'
                  }`}>
                    {p.done && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs truncate ${p.done ? 'text-gray-500 line-through' : ''}`}>{p.name}</p>
                    <p className="text-[10px] text-gray-600">{p.time}</p>
                  </div>
                  {p.subject_name && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full flex-shrink-0"
                      style={{ background: `${p.subject_color}20`, color: p.subject_color }}>
                      {p.subject_name}
                    </span>
                  )}
                </div>
              ))}
              {todayPlans.length > 5 && (
                <p className="text-[10px] text-gray-600 text-center">还有 {todayPlans.length - 5} 项</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, sub, color }) {
  return (
    <div className="card flex flex-col items-center py-3">
      <div className={`${color} mb-1`}>{icon}</div>
      <span className={`text-lg font-bold font-mono ${color}`}>{value}</span>
      <span className="text-[10px] text-gray-500 mt-0.5">{label}</span>
      {sub && <span className="text-[9px] text-gray-600 mt-0.5">{sub}</span>}
    </div>
  );
}
