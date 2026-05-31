import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:3000';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [key, setKey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !key) {
      setError('Email e License Key são obrigatórios');
      return;
    }

    if (!/^MXPRO-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(key)) {
      setError('Formato de key inválido. Use: MXPRO-XXXX-XXXX-XXXX');
      return;
    }

    setLoading(true);
    try {
      // Validar key
      const keyRes = await fetch(`${API_URL}/api/keys/validate?code=${key}`);
      if (!keyRes.ok) {
        const data = await keyRes.json();
        throw new Error(data.error || 'Key inválida');
      }

      // Ativar como desktop
      await fetch(`${API_URL}/api/keys/activate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: key, deviceId: 'desktop-' + Date.now(), deviceType: 'desktop' }),
      });

      // Login com email
      const loginRes = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: key }), // MVP: key como senha temporária
      });

      if (loginRes.ok) {
        const data = await loginRes.json();
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('pilot_id', data.pilot.id);
        localStorage.setItem('license_key', key);
      }

      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Erro ao conectar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>🏁 MenteMX Pro</h1>
        <p style={styles.subtitle}>Desktop — Análise de Performance</p>

        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>License Key</label>
            <input
              type="text"
              value={key}
              onChange={(e) => setKey(e.target.value.toUpperCase())}
              placeholder="MXPRO-XXXX-XXXX-XXXX"
              style={styles.input}
            />
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Conectando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#1a1a2e' },
  card: { backgroundColor: '#16213e', borderRadius: 16, padding: 48, width: 400, textAlign: 'center' },
  title: { color: '#fff', fontSize: 32, margin: 0 },
  subtitle: { color: '#a0a0b0', fontSize: 14, marginBottom: 32 },
  form: { display: 'flex', flexDirection: 'column', gap: 16 },
  field: { textAlign: 'left' },
  label: { color: '#a0a0b0', fontSize: 12, marginBottom: 4, display: 'block' },
  input: { width: '100%', padding: 14, borderRadius: 8, border: '1px solid #2a2a4e', backgroundColor: '#0f1a30', color: '#fff', fontSize: 16, boxSizing: 'border-box' },
  error: { color: '#f44336', fontSize: 13, margin: 0 },
  button: { padding: 16, borderRadius: 12, border: 'none', backgroundColor: '#e94560', color: '#fff', fontSize: 18, fontWeight: 700, cursor: 'pointer' },
};
