import React, { useState } from 'react';
import { auth, googleProvider, signInWithGoogle } from '../services/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { Activity, Mail, Lock, ArrowRight, Check, UserPlus, LogIn } from 'lucide-react';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); // Added name for signup
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Optional: Update display name immediately after signup
        if (name) {
             await updateProfile(userCredential.user, {
                 displayName: name
             });
        }
      }
    } catch (err: any) {
      let errorMessage = "An error occurred";
      if (err.code === 'auth/email-already-in-use') errorMessage = "That email is already in use.";
      else if (err.code === 'auth/invalid-email') errorMessage = "Invalid email address.";
      else if (err.code === 'auth/weak-password') errorMessage = "Password should be at least 6 characters.";
      else if (err.code === 'auth/wrong-password') errorMessage = "Incorrect password.";
      else if (err.code === 'auth/user-not-found') errorMessage = "No account found with this email.";
      else errorMessage = err.message.replace('Firebase: ', '');
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSign = async () => {
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setError("Failed to sign in with Google.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="p-8">
          <div className="flex justify-center mb-6">
            <div className="bg-teal-600 p-3 rounded-xl shadow-lg shadow-teal-200">
              <Activity className="text-white" size={32} />
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-center text-slate-800 mb-2">BioNurse Pro</h2>
          <p className="text-center text-slate-500 mb-8">
            {isLogin ? "Welcome Back" : "Create Your Account"}
          </p>

          {/* Toggle Buttons */}
          <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
            <button
              onClick={() => { setIsLogin(true); setError(''); }}
              className={`flex-1 flex items-center justify-center py-2 text-sm font-semibold rounded-lg transition-all ${isLogin ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-500'}`}
            >
              <LogIn size={16} className="mr-2" />
              Log In
            </button>
            <button
              onClick={() => { setIsLogin(false); setError(''); }}
              className={`flex-1 flex items-center justify-center py-2 text-sm font-semibold rounded-lg transition-all ${!isLogin ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-500'}`}
            >
              <UserPlus size={16} className="mr-2" />
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <UserPlus className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    required={!isLogin}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                  placeholder="name@example.com"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
              {!isLogin && <p className="text-xs text-slate-400 mt-1">Must be at least 6 characters.</p>}
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight size={18} className="ml-2" />
                </>
              )}
            </button>
          </form>

          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-slate-200"></div>
            <span className="px-4 text-xs text-slate-400 font-medium">OR CONTINUE WITH</span>
            <div className="flex-1 border-t border-slate-200"></div>
          </div>

          <button
            onClick={handleGoogleSign}
            className="w-full py-3 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
