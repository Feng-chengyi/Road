import { useState, useEffect } from 'react';
import api from '../api.js';
import { Plus, X, Trash2, Pencil } from 'lucide-react';

const COLORS = ['#EF4444', '#3B82F6', '#22C55E', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#F97316'];

export default function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ name: '', color: COLORS[0], targetScore: 100, dailyHours: 1.5 });

  const load = () => api.get('/subjects').then((r) => setSubjects(r.data));
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditItem(null); setForm({ name: '', color: COLORS[0], targetScore: 100, dailyHours: 1.5 }); setShowModal(true); };
  const openEdit = (s) => { setEditItem(s); setForm({ name: s.name, color: s.color, targetScore: s.target_score, dailyHours: s.daily_hours }); setShowModal(true); };

  const save = async () => {
    if (!form.name.trim()) return;
    if (editItem) {
      await api.put(`/subjects/${editItem.id}`, form);
    } else {
      await api.post('/subjects', form);
    }
    setShowModal(false);
    load();
  };

  const remove = async (id) => {
    if (!confirm('确定删除此科目？')) return;
    await api.delete(`/subjects/${id}`);
    load();
  };

  return (
    <div className="page">
      <div className="px-5 pt-12 pb-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">备考科目</h1>
            <p className="text-xs text-gray-500 mt-0.5">管理你的考试科目与目标</p>
          </div>
          <button onClick={openAdd} className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center text-white">
            <Plus size={18} />
          </button>
        </div>
      </div>

      <div className="px-5 pt-4 space-y-3">
        {subjects.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-500 text-sm">暂无科目</p>
            <p className="text-xs text-gray-600 mt-1">点击右上角添加你的备考科目</p>
          </div>
        ) : subjects.map((s) => (
          <div key={s.id} className="card relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: s.color }} />
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ background: s.color }} />
                <span className="font-semibold text-sm">{s.name}</span>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(s)} className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:text-white">
                  <Pencil size={14} />
                </button>
                <button onClick={() => remove(s.id)} className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:text-red-400">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <div className="flex gap-4 text-xs text-gray-400 mb-3">
              <span>目标 <strong className="text-gray-200 font-mono">{s.target_score}</strong> 分</span>
              <span>每日 <strong className="text-gray-200 font-mono">{s.daily_hours}</strong>h</span>
              <span>已学 <strong className="text-gray-200 font-mono">{s.total_hours}</strong>h</span>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all" style={{ width: `${s.progress}%`, background: s.color }} />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-gray-500">进度</span>
              <span className="text-[10px] font-mono" style={{ color: s.color }}>{s.progress}%</span>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center" onClick={() => setShowModal(false)}>
          <div className="bg-surface-1 rounded-t-3xl w-full max-w-[430px] p-6 pb-10 animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold">{editItem ? '编辑科目' : '添加科目'}</h2>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400">
                <X size={16} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">科目名称</label>
                <input className="input-field" placeholder="如：数据结构" value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block">目标分值</label>
                  <input className="input-field" type="number" value={form.targetScore}
                    onChange={(e) => setForm({ ...form, targetScore: +e.target.value })} />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block">每日时长(h)</label>
                  <input className="input-field" type="number" step="0.5" value={form.dailyHours}
                    onChange={(e) => setForm({ ...form, dailyHours: +e.target.value })} />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">颜色标识</label>
                <div className="flex gap-2">
                  {COLORS.map((c) => (
                    <button key={c} onClick={() => setForm({ ...form, color: c })}
                      className={`w-8 h-8 rounded-full transition-all ${form.color === c ? 'ring-2 ring-white ring-offset-2 ring-offset-surface-1' : ''}`}
                      style={{ background: c }} />
                  ))}
                </div>
              </div>
            </div>
            <button className="btn-primary mt-6" onClick={save}>{editItem ? '保存' : '添加'}</button>
          </div>
        </div>
      )}
    </div>
  );
}
