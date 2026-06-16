import { useState, useEffect } from 'react';
import api from '../api.js';
import { Plus, X, Check } from 'lucide-react';

function formatDate(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

const DAY_NAMES = ['日', '一', '二', '三', '四', '五', '六'];

export default function Plans() {
  const [plans, setPlans] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', subjectId: '', time: '09:00', duration: '1h' });

  const dateStr = formatDate(selectedDate);

  const load = () => {
    api.get(`/plans?date=${dateStr}`).then((r) => setPlans(r.data));
  };
  useEffect(() => { api.get('/subjects').then((r) => setSubjects(r.data)); }, []);
  useEffect(() => { load(); }, [dateStr]);

  const togglePlan = async (plan) => {
    await api.put(`/plans/${plan.id}`, { done: !plan.done });
    load();
  };

  const addPlan = async () => {
    if (!form.name.trim()) return;
    await api.post('/plans', { ...form, date: dateStr, subjectId: form.subjectId || null });
    setShowModal(false);
    setForm({ name: '', subjectId: '', time: '09:00', duration: '1h' });
    load();
  };

  const weekDates = [];
  for (let i = -3; i <= 3; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    weekDates.push(d);
  }

  const doneCount = plans.filter((p) => p.done).length;
  const completion = plans.length ? Math.round((doneCount / plans.length) * 100) : 0;

  return (
    <div className="page">
      <div className="px-5 pt-12 pb-2">
        <h1 className="text-xl font-bold">学习计划</h1>
        <p className="text-xs text-gray-500 mt-0.5">
          今日完成率 <span className="text-green-400 font-semibold">{completion}%</span>
        </p>
      </div>

      <div className="px-5 mt-4 flex gap-2 overflow-x-auto pb-2">
        {weekDates.map((d) => {
          const isToday = formatDate(d) === formatDate(new Date());
          const isSelected = formatDate(d) === dateStr;
          return (
            <button key={d.toISOString()} onClick={() => setSelectedDate(new Date(d))}
              className={`flex-shrink-0 w-14 h-16 rounded-xl flex flex-col items-center justify-center transition-all ${
                isSelected ? 'bg-brand-500 text-white' : 'bg-surface-1 border border-white/5 text-gray-400'
              }`}>
              <span className="text-[10px]">周{DAY_NAMES[d.getDay()]}</span>
              <span className="text-base font-bold font-mono">{d.getDate()}</span>
              {isToday && <span className="w-1 h-1 rounded-full bg-brand-400 mt-0.5" />}
            </button>
          );
        })}
      </div>

      <div className="px-5 mt-4 space-y-3">
        {plans.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-500 text-sm">这一天还没有计划</p>
            <p className="text-xs text-gray-600 mt-1">点击下方按钮添加</p>
          </div>
        ) : (
          <>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-brand-500 to-green-400 transition-all" style={{ width: `${completion}%` }} />
            </div>
            {plans.map((p) => (
              <div key={p.id} className="card flex items-center gap-3 cursor-pointer" onClick={() => togglePlan(p)}>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                  p.done ? 'bg-green-500 border-green-500' : 'border-gray-600'
                }`}>
                  {p.done && <Check size={12} className="text-white" strokeWidth={3} />}
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
          </>
        )}

        <button onClick={() => { setShowModal(true); setForm({ name: '', subjectId: subjects[0]?.id || '', time: '09:00', duration: '1h' }); }}
          className="w-full py-3 border border-dashed border-white/10 rounded-xl text-sm text-gray-500 flex items-center justify-center gap-2 hover:border-brand-500 hover:text-brand-400 transition-colors">
          <Plus size={16} /> 添加学习计划
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center" onClick={() => setShowModal(false)}>
          <div className="bg-surface-1 rounded-t-3xl w-full max-w-[430px] p-6 pb-10 animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold">添加学习计划</h2>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400">
                <X size={16} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">计划内容</label>
                <input className="input-field" placeholder="如：复习高数第一章" value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">所属科目</label>
                <select className="input-field" value={form.subjectId}
                  onChange={(e) => setForm({ ...form, subjectId: e.target.value })}>
                  <option value="">无</option>
                  {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block">开始时间</label>
                  <input className="input-field" type="time" value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block">时长</label>
                  <input className="input-field" placeholder="如：1.5h" value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })} />
                </div>
              </div>
            </div>
            <button className="btn-primary mt-6" onClick={addPlan}>确认添加</button>
          </div>
        </div>
      )}
    </div>
  );
}
