import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { GraduationCap, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(account, password);
    } catch (err) {
      setError(err.response?.data?.error || '登录失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full flex flex-col bg-surface-0 px-6 pt-16">
      <div className="flex-1 flex flex-col justify-center">
        <div className="w-16 h-16 bg-brand-500 rounded-2xl flex items-center justify-center mb-8 mx-auto shadow-lg shadow-brand-500/20">
          <GraduationCap size={32} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold text-center mb-1">欢迎回来</h1>
        <p className="text-sm text-gray-400 text-center mb-8">登录以继续追踪你的备考进度</p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-4 text-sm text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-400 mb-1.5 block">邮箱 / 手机号</label>
            <input
              className="input-field"
              placeholder="请输入邮箱或手机号"
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-400 mb-1.5 block">密码</label>
            <div className="relative">
              <input
                className="input-field pr-10"
                type={showPwd ? 'text' : 'password'}
                placeholder="请输入密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                onClick={() => setShowPwd(!showPwd)}
              >
                {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <button type="submit" className="btn-primary mt-2" disabled={loading}>
            {loading ? '登录中...' : '登录'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          还没有账号？
          <Link to="/register" className="text-brand-500 font-medium ml-1 hover:text-brand-400">
            立即注册
          </Link>
        </p>
      </div>
    </div>
  );
}
