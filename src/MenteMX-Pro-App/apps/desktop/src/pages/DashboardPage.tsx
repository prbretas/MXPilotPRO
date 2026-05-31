export function DashboardPage() {
  return (
    <div style={styles.container}>
      <nav style={styles.sidebar}>
        <h2 style={styles.logo}>🏁 MenteMX</h2>
        <ul style={styles.nav}>
          <li style={styles.navItem}>📊 Analytics</li>
          <li style={styles.navItem}>🏆 Sessões</li>
          <li style={styles.navItem}>🔧 Setups</li>
          <li style={styles.navItem}>📅 Eventos</li>
          <li style={styles.navItem}>📄 Relatórios</li>
        </ul>
      </nav>
      <main style={styles.main}>
        <h1 style={styles.title}>Dashboard</h1>
        <p style={styles.subtitle}>Análise de performance — versão desktop</p>

        <div style={styles.cards}>
          <div style={styles.card}>
            <span style={styles.cardLabel}>MX Score</span>
            <span style={styles.cardValue}>---</span>
          </div>
          <div style={styles.card}>
            <span style={styles.cardLabel}>Streak</span>
            <span style={styles.cardValue}>0 dias</span>
          </div>
          <div style={styles.card}>
            <span style={styles.cardLabel}>Sessões (30d)</span>
            <span style={styles.cardValue}>0</span>
          </div>
        </div>
      </main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { display: 'flex', minHeight: '100vh', backgroundColor: '#1a1a2e' },
  sidebar: { width: 220, backgroundColor: '#16213e', padding: 24, borderRight: '1px solid #2a2a4e' },
  logo: { color: '#fff', fontSize: 18, marginBottom: 32 },
  nav: { listStyle: 'none', padding: 0, margin: 0 },
  navItem: { color: '#a0a0b0', padding: '12px 0', cursor: 'pointer', fontSize: 14 },
  main: { flex: 1, padding: 48 },
  title: { color: '#fff', fontSize: 28, margin: 0 },
  subtitle: { color: '#a0a0b0', marginBottom: 32 },
  cards: { display: 'flex', gap: 24 },
  card: { backgroundColor: '#16213e', borderRadius: 12, padding: 24, flex: 1, textAlign: 'center' },
  cardLabel: { display: 'block', color: '#a0a0b0', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 },
  cardValue: { display: 'block', color: '#e94560', fontSize: 36, fontWeight: 700, marginTop: 8 },
};
