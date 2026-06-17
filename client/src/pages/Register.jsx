import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { GraduationCap, Eye, EyeOff, ArrowLeft, Plus, X } from 'lucide-react';

const STEPS = ['联系方式', '基本信息', '备考科目'];

const PRESET_SUBJECTS = [
  { name: '政治', color: '#EF4444', targetScore: 75, dailyHours: 1.5 },
  { name: '英语一', color: '#3B82F6', targetScore: 70, dailyHours: 2 },
  { name: '英语二', color: '#06B6D4', targetScore: 70, dailyHours: 2 },
  { name: '数学一', color: '#22C55E', targetScore: 120, dailyHours: 3 },
  { name: '数学二', color: '#10B981', targetScore: 120, dailyHours: 2.5 },
  { name: '数学三', color: '#34D399', targetScore: 120, dailyHours: 2.5 },
  { name: '计算机学科专业基础', color: '#8B5CF6', targetScore: 120, dailyHours: 2.5 },
  { name: '计算机学科专业综合', color: '#A78BFA', targetScore: 120, dailyHours: 2.5 },
  { name: '心理学专业综合', color: '#F472B6', targetScore: 120, dailyHours: 2 },
  { name: '法律硕士专业基础', color: '#F97316', targetScore: 120, dailyHours: 2 },
  { name: '教育学专业基础', color: '#EAB308', targetScore: 120, dailyHours: 2 },
  { name: '经济学综合', color: '#14B8A6', targetScore: 120, dailyHours: 2 },
];

const COLORS = ['#EF4444', '#3B82F6', '#22C55E', '#8B5CF6', '#F97316', '#F472B6', '#06B6D4', '#EAB308', '#14B8A6', '#A78BFA'];

export default function Register() {
  const { register } = useAuth();
  const [step, setStep] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '',
    school: '', major: '', examYear: 2026,
    subjects: [],
  });
  const [showPwd, setShowPwd] = useState(false);
  const [showCustom, setShowCustom] = useState(false);
  const [customForm, setCustomForm] = useState({ name: '', color: COLORS[0], targetScore: 100, dailyHours: 1.5 });

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const toggleSubject = (subj) => {
    const exists = form.subjects.find((s) => s.name === subj.name);
    if (exists) {
      set('subjects', form.subjects.filter((s) => s.name !== subj.name));
    } else {
      set('subjects', [...form.subjects, { ...subj }]);
    }
  };

  const updateSubject = (name, key, val) => {
    set('subjects', form.subjects.map((s) => s.name === name ? { ...s, [key]: val } : s));
  };

  const addCustomSubject = () => {
    if (!customForm.name.trim()) return;
    if (form.subjects.find((s) => s.name === customForm.name)) return;
    set('subjects', [...form.subjects, { ...customForm }]);
    setCustomForm({ name: '', color: COLORS[0], targetScore: 100, dailyHours: 1.5 });
    setShowCustom(false);
  };

  const canNext = () => {
    if (step === 0) return form.password.length >= 6 && (form.email || form.phone);
    if (step === 1) return form.name.trim();
    return form.subjects.length > 0;
  };

  const handleRegister = async () => {
    setError('');
    setLoading(true);
    try {
      await register(form);
    } catch (err) {
      setError(err.response?.data?.error || '注册失败');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full flex flex-col bg-surface-0 px-6 pt-12">
      <div className="flex items-center gap-4 mb-6">
        {step > 0 ? (
          <button onClick={() => setStep(step - 1)} className="w-10 h-10 rounded-xl bg-surface-1 border border-white/5 flex items-center justify-center">
            <ArrowLeft size={18} />
          </button>
        ) : (
          <Link to="/login" className="w-10 h-10 rounded-xl bg-surface-1 border border-white/5 flex items-center justify-center">
            <ArrowLeft size={18} />
          </Link>
        )}
        <h1 className="text-lg font-bold">{STEPS[step]}</h1>
      </div>

      <div className="flex gap-2 mb-6">
        {STEPS.map((_, i) => (
          <div key={i} className={`flex-1 h-1 rounded-full ${i <= step ? 'bg-brand-500' : 'bg-white/5'}`} />
        ))}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-4 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {step === 0 && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-gray-400 mb-1.5 block">手机号</label>
              <input className="input-field" placeholder="请输入手机号" value={form.phone}
                onChange={(e) => set('phone', e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-400 mb-1.5 block">邮箱（选填）</label>
              <input className="input-field" type="email" placeholder="请输入邮箱" value={form.email}
                onChange={(e) => set('email', e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-400 mb-1.5 block">密码</label>
              <div className="relative">
                <input className="input-field pr-10" type={showPwd ? 'text' : 'password'}
                  placeholder="请设置6-32位密码" value={form.password}
                  onChange={(e) => set('password', e.target.value)} />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  onClick={() => setShowPwd(!showPwd)}>
                  {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-gray-400 mb-1.5 block">姓名</label>
              <input className="input-field" placeholder="请输入你的姓名" value={form.name}
                onChange={(e) => set('name', e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-400 mb-1.5 block">目标院校</label>
              <input className="input-field" placeholder="如：北京大学" value={form.school}
                onChange={(e) => set('school', e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-400 mb-1.5 block">目标专业</label>
              <input className="input-field" placeholder="如：计算机科学与技术" value={form.major}
                onChange={(e) => set('major', e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-400 mb-1.5 block">考试年份</label>
              <select className="input-field" value={form.examYear}
                onChange={(e) => set('examYear', +e.target.value)}>
                <option value={2026}>2026年考研</option>
                <option value={2027}>2027年考研</option>
                <option value={2028}>2028年考研</option>
              </select>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <p className="text-sm text-gray-400">选择你需要备考的科目（可多选，选后可调整目标分值和每日时长）</p>

            <div className="flex flex-wrap gap-2">
              {PRESET_SUBJECTS.map((subj) => {
                const selected = form.subjects.find((s) => s.name === subj.name);
                return (
                  <button key={subj.name} onClick={() => toggleSubject(subj)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-medium transition-all ${
                      selected ? 'border-brand-500 bg-brand-500/10 text-brand-400' : 'border-white/10 bg-surface-1 text-gray-400'
                    }`}>
                    <span className="w-2 h-2 rounded-full" style={{ background: subj.color }} />
                    {subj.name}
                  </button>
                );
              })}
              <button onClick={() => setShowCustom(true)}
                className="flex items-center gap-1 px-3 py-2 rounded-xl border border-dashed border-white/10 text-xs text-gray-500 hover:border-brand-500 hover:text-brand-400 transition-colors">
                <Plus size={12} /> 自定义
              </button>
            </div>

            {form.subjects.length > 0 && (
              <div className="space-y-3 mt-4">
                {form.subjects.map((s) => (
                  <div key={s.name} className="card !p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
                        {s.name}
                      </span>
                      <button onClick={() => toggleSubject(s)} className="text-gray-500 hover:text-red-400">
                        <X size={14} />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] text-gray-500 block mb-1">目标分值</label>
                        <input className="input-field !py-1.5 !text-xs" type="number" value={s.targetScore}
                          onChange={(e) => updateSubject(s.name, 'targetScore', +e.target.value)} />
                      </div>
                      <div>
                        <label className="text-[10px] text-gray-500 block mb-1">每日时长(h)</label>
                        <input className="input-field !py-1.5 !text-xs" type="number" step="0.5" value={s.dailyHours}
                          onChange={(e) => updateSubject(s.name, 'dailyHours', +e.target.value)} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="pb-8 pt-4">
        {step < 2 ? (
          <button className="btn-primary" disabled={!canNext()} onClick={() => setStep(step + 1)}>
            下一步
          </button>
        ) : (
          <button className="btn-primary" disabled={!canNext() || loading} onClick={handleRegister}>
            {loading ? '注册中...' : '完成注册'}
          </button>
        )}
      </div>

      {showCustom && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center" onClick={() => setShowCustom(false)}>
          <div className="bg-surface-1 rounded-t-3xl w-full max-w-[430px] p-6 pb-10 animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold">自定义科目</h2>
              <button onClick={() => setShowCustom(false)} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400">
                <X size={16} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">科目名称</label>
                <input className="input-field" placeholder="如：日语" value={customForm.name}
                  onChange={(e) => setCustomForm({ ...customForm, name: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block">目标分值</label>
                  <input className="input-field" type="number" value={customForm.targetScore}
                    onChange={(e) => setCustomForm({ ...customForm, targetScore: +e.target.value })} />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block">每日时长(h)</label>
                  <input className="input-field" type="number" step="0.5" value={customForm.dailyHours}
                    onChange={(e) => setCustomForm({ ...customForm, dailyHours: +e.target.value })} />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">颜色</label>
                <div className="flex gap-2">
                  {COLORS.map((c) => (
                    <button key={c} onClick={() => setCustomForm({ ...customForm, color: c })}
                      className={`w-7 h-7 rounded-full transition-all ${customForm.color === c ? 'ring-2 ring-white ring-offset-2 ring-offset-surface-1' : ''}`}
                      style={{ background: c }} />
                  ))}
                </div>
              </div>
            </div>
            <button className="btn-primary mt-6" onClick={addCustomSubject}>添加</button>
          </div>
        </div>
      )}
    </div>
  );
}
