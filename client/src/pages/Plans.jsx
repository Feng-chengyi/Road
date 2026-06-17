import { useState, useEffect, useRef, useCallback } from 'react';
import api from '../api.js';
import { Plus, X, Check, Play, Pause, RotateCcw, Square, Repeat, Pencil, Trash2 } from 'lucide-react';

function formatDate(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function formatTimer(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

const DAY_NAMES = ['日', '一', '二', '三', '四', '五', '六'];

export default function Plans() {
  const [plans, setPlans] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [activeTimerId, setActiveTimerId] = useState(null);
  const [timerElapsed, setTimerElapsed] = useState(0);
  const timerRef = useRef(null);
  const [form, setForm] = useState({ name: '', subjectId: '', duration: '1h' });
  const [batchForm, setBatchForm] = useState({
    name: '', subjectId: '', duration: '1h',
    recurrence: 'daily', repeatStart: formatDate(new Date()), repeatEnd: formatDate(new Date(Date.now() + 30 * 86400000)),
  });
  const [editPlan, setEditPlan] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', subjectId: '', duration: '' });

  const dateStr = formatDate(selectedDate);

  const load = useCallback(() => {
    api.get(`/plans?date=${dateStr}`).then((r) => {
      setPlans(r.data);
      const active = r.data.find((p) => p.started_at && !p.done);
      if (active) {
        setActiveTimerId(active.id);
        setTimerElapsed(active.elapsed_seconds || 0);
      }
    });
  }, [dateStr]);

  useEffect(() => { api.get('/subjects').then((r) => setSubjects(r.data)); }, []);
  useEffect(() => { load(); }, [load]);

  // Timer tick
  useEffect(() => {
    if (activeTimerId) {
      timerRef.current = setInterval(() => {
        setTimerElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [activeTimerId]);

  const startTimer = async (plan) => {
    if (activeTimerId && activeTimerId !== plan.id) {
      await api.put(`/plans/${activeTimerId}/timer`, { action: 'pause' });
    }
    await api.put(`/plans/${plan.id}/timer`, { action: 'start' });
    setActiveTimerId(plan.id);
    setTimerElapsed(plan.elapsed_seconds || 0);
    load();
  };

  const pauseTimer = async () => {
    if (!activeTimerId) return;
    await api.put(`/plans/${activeTimerId}/timer`, { action: 'pause' });
    setActiveTimerId(null);
    setTimerElapsed(0);
    load();
  };

  const resetTimer = async (plan) => {
    await api.put(`/plans/${plan.id}/timer`, { action: 'reset' });
    if (activeTimerId === plan.id) {
      setActiveTimerId(null);
      setTimerElapsed(0);
    }
    load();
  };

  const finishTimer = async (plan) => {
    await api.put(`/plans/${plan.id}/timer`, { action: 'finish' });
    if (activeTimerId === plan.id) {
      setActiveTimerId(null);
      setTimerElapsed(0);
    }
    load();
  };

  const addPlan = async () => {
    if (!form.name.trim()) return;
    await api.post('/plans', { ...form, date: dateStr, subjectId: form.subjectId || null });
    setShowAddModal(false);
    setForm({ name: '', subjectId: '', duration: '1h' });
    load();
  };

  const addBatchPlans = async () => {
    if (!batchForm.name.trim()) return;
    await api.post('/plans/batch', { ...batchForm, subjectId: batchForm.subjectId || null });
    setShowBatchModal(false);
    setBatchForm({
      name: '', subjectId: '', duration: '1h',
      recurrence: 'daily', repeatStart: formatDate(new Date()), repeatEnd: formatDate(new Date(Date.now() + 30 * 86400000)),
    });
    load();
  };

  const openEdit = (plan) => {
    setEditPlan(plan);
    setEditForm({ name: plan.name, subjectId: plan.subject_id || '', duration: plan.duration });
  };

  const saveEdit = async () => {
    if (!editForm.name.trim() || !editPlan) return;
    await api.put(`/plans/${editPlan.id}`, {
      name: editForm.name,
      subjectId: editForm.subjectId || null,
      duration: editForm.duration,
    });
    setEditPlan(null);
    load();
  };

  const deletePlan = async (plan) => {
    if (!confirm(`确定删除计划「${plan.name}」？`)) return;
    await api.delete(`/plans/${plan.id}`);
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
  const totalElapsed = plans.reduce((sum, p) => {
    if (p.id === activeTimerId) return sum + timerElapsed;
    return sum + (p.elapsed_seconds || 0);
  }, 0);

  return (
    <div className="page">
      <div className="px-5 pt-12 pb-2">
        <h1 className="text-xl font-bold">学习计划</h1>
        <div className="flex items-center gap-4 mt-1">
          <p className="text-xs text-gray-500">
            完成率 <span className="text-green-400 font-semibold">{completion}%</span>
          </p>
          {totalElapsed > 0 && (
            <p className="text-xs text-gray-500">
              已学习 <span className="text-brand-400 font-mono">{formatTimer(totalElapsed)}</span>
            </p>
          )}
        </div>
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
              <PlanCard
                key={p.id} plan={p}
                isActive={activeTimerId === p.id}
                elapsed={activeTimerId === p.id ? timerElapsed : (p.elapsed_seconds || 0)}
                onStart={() => startTimer(p)}
                onPause={pauseTimer}
                onReset={() => resetTimer(p)}
                onFinish={() => finishTimer(p)}
                onEdit={() => openEdit(p)}
                onDelete={() => deletePlan(p)}
              />
            ))}
          </>
        )}

        <div className="flex gap-2">
          <button onClick={() => { setShowAddModal(true); setForm({ name: '', subjectId: subjects[0]?.id || '', duration: '1h' }); }}
            className="flex-1 py-3 border border-dashed border-white/10 rounded-xl text-sm text-gray-500 flex items-center justify-center gap-2 hover:border-brand-500 hover:text-brand-400 transition-colors">
            <Plus size={16} /> 添加计划
          </button>
          <button onClick={() => { setShowBatchModal(true); setBatchForm((f) => ({ ...f, name: '', subjectId: subjects[0]?.id || '' })); }}
            className="flex-1 py-3 border border-dashed border-white/10 rounded-xl text-sm text-gray-500 flex items-center justify-center gap-2 hover:border-brand-500 hover:text-brand-400 transition-colors">
            <Repeat size={16} /> 重复计划
          </button>
        </div>
      </div>

      {/* Add single plan modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center" onClick={() => setShowAddModal(false)}>
          <div className="bg-surface-1 rounded-t-3xl w-full max-w-[430px] p-6 pb-10 animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold">添加学习计划</h2>
              <button onClick={() => setShowAddModal(false)} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400">
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
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">计划学时</label>
                <input className="input-field" placeholder="如：1.5h 或 90min" value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: e.target.value })} />
              </div>
            </div>
            <button className="btn-primary mt-6" onClick={addPlan}>确认添加</button>
          </div>
        </div>
      )}

      {/* Batch recurrence plan modal */}
      {showBatchModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center" onClick={() => setShowBatchModal(false)}>
          <div className="bg-surface-1 rounded-t-3xl w-full max-w-[430px] p-6 pb-10 animate-slide-up max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold">批量创建重复计划</h2>
              <button onClick={() => setShowBatchModal(false)} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400">
                <X size={16} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">计划内容</label>
                <input className="input-field" placeholder="如：每日英语阅读" value={batchForm.name}
                  onChange={(e) => setBatchForm({ ...batchForm, name: e.target.value })} />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">所属科目</label>
                <select className="input-field" value={batchForm.subjectId}
                  onChange={(e) => setBatchForm({ ...batchForm, subjectId: e.target.value })}>
                  <option value="">无</option>
                  {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">计划学时</label>
                <input className="input-field" placeholder="如：1.5h" value={batchForm.duration}
                  onChange={(e) => setBatchForm({ ...batchForm, duration: e.target.value })} />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">重复类型</label>
                <div className="grid grid-cols-3 gap-2">
                  {[{ v: 'daily', l: '每天' }, { v: 'weekly', l: '每周' }, { v: 'monthly', l: '每月' }].map(({ v, l }) => (
                    <button key={v} onClick={() => setBatchForm({ ...batchForm, recurrence: v })}
                      className={`py-2 rounded-xl border text-xs font-medium transition-all ${
                        batchForm.recurrence === v ? 'border-brand-500 bg-brand-500/10 text-brand-400' : 'border-white/10 text-gray-400'
                      }`}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block">开始日期</label>
                  <input className="input-field" type="date" value={batchForm.repeatStart}
                    onChange={(e) => setBatchForm({ ...batchForm, repeatStart: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block">结束日期</label>
                  <input className="input-field" type="date" value={batchForm.repeatEnd}
                    onChange={(e) => setBatchForm({ ...batchForm, repeatEnd: e.target.value })} />
                </div>
              </div>
              <div className="bg-surface-2 rounded-xl p-3 text-xs text-gray-500">
                将生成 {calcCount(batchForm.recurrence, batchForm.repeatStart, batchForm.repeatEnd)} 个计划
              </div>
            </div>
            <button className="btn-primary mt-6" onClick={addBatchPlans}>批量创建</button>
          </div>
        </div>
      )}

      {/* Edit plan modal */}
      {editPlan && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center" onClick={() => setEditPlan(null)}>
          <div className="bg-surface-1 rounded-t-3xl w-full max-w-[430px] p-6 pb-10 animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold">编辑计划</h2>
              <button onClick={() => setEditPlan(null)} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400">
                <X size={16} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">计划内容</label>
                <input className="input-field" value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">所属科目</label>
                <select className="input-field" value={editForm.subjectId}
                  onChange={(e) => setEditForm({ ...editForm, subjectId: e.target.value })}>
                  <option value="">无</option>
                  {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">计划学时</label>
                <input className="input-field" value={editForm.duration}
                  onChange={(e) => setEditForm({ ...editForm, duration: e.target.value })} />
              </div>
            </div>
            <button className="btn-primary mt-6" onClick={saveEdit}>保存修改</button>
          </div>
        </div>
      )}
    </div>
  );
}

function PlanCard({ plan, isActive, elapsed, onStart, onPause, onReset, onFinish, onEdit, onDelete }) {
  const displayTime = isActive ? elapsed : (plan.elapsed_seconds || 0);
  const isRunning = isActive;

  return (
    <div className={`card ${plan.done ? 'opacity-60' : ''}`}>
      <div className="flex items-center gap-3">
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
          plan.done ? 'bg-green-500 border-green-500' : 'border-gray-600'
        }`}>
          {plan.done && <Check size={12} className="text-white" strokeWidth={3} />}
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm truncate ${plan.done ? 'text-gray-500 line-through' : ''}`}>{plan.name}</p>
          <p className="text-xs text-gray-500">计划 {plan.duration}</p>
        </div>
        {plan.subject_name && (
          <span className="text-[10px] px-2 py-0.5 rounded-full flex-shrink-0"
            style={{ background: `${plan.subject_color}20`, color: plan.subject_color }}>
            {plan.subject_name}
          </span>
        )}
        {plan.recurrence !== 'none' && (
          <Repeat size={12} className="text-gray-600 flex-shrink-0" />
        )}
        {!isRunning && !plan.done && (
          <div className="flex gap-1 flex-shrink-0">
            <button onClick={(e) => { e.stopPropagation(); onEdit(); }}
              className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-gray-500 hover:text-brand-400 transition-colors">
              <Pencil size={12} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); onDelete(); }}
              className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-gray-500 hover:text-red-400 transition-colors">
              <Trash2 size={12} />
            </button>
          </div>
        )}
      </div>

      {!plan.done && (
        <div className="mt-3 flex items-center gap-3">
          <div className={`font-mono text-xl font-bold tracking-wider ${
            isRunning ? 'text-brand-400' : displayTime > 0 ? 'text-green-400' : 'text-gray-600'
          }`}>
            {formatTimer(displayTime)}
          </div>
          <div className="flex-1" />
          <div className="flex gap-2">
            {!isRunning ? (
              <button onClick={onStart}
                className="h-9 px-4 rounded-xl bg-brand-500 flex items-center justify-center gap-1.5 text-white text-xs font-medium hover:bg-brand-600 transition-colors">
                <Play size={14} fill="currentColor" /> 开始
              </button>
            ) : (
              <>
                <button onClick={onPause}
                  className="h-9 px-3 rounded-xl bg-amber-500/20 flex items-center justify-center gap-1 text-amber-400 text-xs font-medium hover:bg-amber-500/30 transition-colors">
                  <Pause size={14} /> 暂停
                </button>
                {displayTime > 0 && (
                  <button onClick={onFinish}
                    className="h-9 px-3 rounded-xl bg-green-500/20 flex items-center justify-center gap-1 text-green-400 text-xs font-medium hover:bg-green-500/30 transition-colors">
                    <Square size={12} fill="currentColor" /> 完成
                  </button>
                )}
              </>
            )}
            {!isRunning && displayTime > 0 && (
              <button onClick={onReset}
                className="h-9 w-9 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:bg-white/10 transition-colors">
                <RotateCcw size={14} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function calcCount(type, start, end) {
  if (!start || !end) return 0;
  const s = new Date(start);
  const e = new Date(end);
  if (e < s) return 0;
  if (type === 'daily') return Math.floor((e - s) / 86400000) + 1;
  if (type === 'weekly') return Math.floor((e - s) / (7 * 86400000)) + 1;
  if (type === 'monthly') {
    let count = 0;
    const cur = new Date(s);
    while (cur <= e) { count++; cur.setMonth(cur.getMonth() + 1); }
    return count;
  }
  return 0;
}
