import { Icon } from '@/components/icons';
export const metadata = { title: 'En maintenance' };

export default function MaintenancePage() {
  return (
    <div style={{ minHeight: '100vh', background: '#f5f0e8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ textAlign: 'center', maxWidth: 480, padding: '2rem' }}>
        <div style={{ marginBottom: '1.5rem', color: '#2d5f54', display: 'flex', justifyContent: 'center' }}><Icon name="wrench" size={48} /></div>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#2d5f54', marginBottom: '1rem', fontFamily: 'Georgia, serif' }}>
          Site en maintenance
        </h1>
        <p style={{ color: '#78716c', fontSize: '1rem', lineHeight: 1.6 }}>
          Happy Humans est actuellement en cours de mise à jour.<br />
          Nous revenons très vite !
        </p>
        <p style={{ color: '#a8a29e', fontSize: '0.85rem', marginTop: '2rem' }}>
          <Icon name="chat" size={14} style={{ display: 'inline', verticalAlign: '-2px', marginRight: 6 }} />Besoin d&apos;aide ? Écrivez à{' '}
          <a href="mailto:happyhumans.coaching@gmail.com" style={{ color: '#2d5f54' }}>
            happyhumans.coaching@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
}
