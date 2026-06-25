import React, { useState } from 'react';
import { User, Lock, ShieldAlert, Key } from 'lucide-react';
import './AdminLogin.css';

export default function AdminLogin({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [wiggle, setWiggle] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validar credenciales
    if (username === 'admin' && password === 'portenos2026') {
      setError(false);
      onLoginSuccess();
    } else {
      setError(true);
      setWiggle(true);
      // Animación de sacudida (wiggle) en caso de error
      setTimeout(() => {
        setWiggle(false);
      }, 500);
    }
  };

  return (
    <div className="login-wrapper-pro">
      <div className={`login-card-pro ${wiggle ? 'wiggle' : ''}`}>
        <div className="login-header-pro">
          <div className="login-shield-icon">
            <ShieldAlert size={28} />
          </div>
          <h2>Acceso de Control</h2>
          <p>Solo personal autorizado del taller Los Porteños</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form-pro">
          <div className="login-group-pro">
            <label>Nombre de Usuario</label>
            <div className="input-with-icon-pro">
              <User className="input-icon-pro" size={18} />
              <input 
                type="text" 
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ej: admin"
              />
            </div>
          </div>

          <div className="login-group-pro">
            <label>Contraseña de Acceso</label>
            <div className="input-with-icon-pro">
              <Lock className="input-icon-pro" size={18} />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <div className="login-error-message">
              Usuario o contraseña incorrectos. Reintentar.
            </div>
          )}

          <button type="submit" className="btn-primary login-submit-btn">
            Ingresar al Tablero
          </button>
        </form>

        <div className="login-hint-tooltip">
          <Key size={12} />
          <span>Demo: <strong>admin</strong> / <strong>portenos2026</strong></span>
        </div>
      </div>
    </div>
  );
}
