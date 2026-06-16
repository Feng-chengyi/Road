import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { GraduationCap, Eye, EyeOff, ArrowLeft } from 'lucide-react';

const STEPS = ['联系方式', '基本信息', '备考科目'];

const DEFAULT_SUBJECTS = [
  { name: '政治', color: '#EF4444' },
  { name: '英语', color: '#3B82F6' },
  { name: '数学', color: '#22C55E' },
  { name: '专业课', color: '#8B5CF6' },
];

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

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const toggleSubject = (name) => {
    set('subjects', form.subjects.includes(name)
      ? form.subjects.filter((s) => s !== name)
      : [...form.subjects, name]);
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

      <div className="flex-1">
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
            <p className="text-sm text-gray-400">选择你需要备考的科目（可多选）</p>
            <div className="flex flex-wrap gap-3">
              {DEFAULT_SUBJECTS.map(({ name, color }) => (
                <button
                  key={name}
                  onClick={() => toggleSubject(name)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                    form.subjects.includes(name)
                      ? 'border-brand-500 bg-brand-500/10 text-brand-400'
                      : 'border-white/10 bg-surface-1 text-gray-400'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                  {name}
                </button>
              ))}
            </div>
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
    </div>
  );
}
