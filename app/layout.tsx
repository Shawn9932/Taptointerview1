
import './(styles)/globals.css';
import Link from 'next/link';

export const metadata = { title: 'Open Interview', description: 'Instant video evaluations' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="header">
          <span className="brand">Open Interview</span>
          <nav style={{display:'flex', gap:12}}>
            <Link href="/">Feed</Link>
            <Link href="/agent">Agent</Link>
            <Link href="/admin">Admin</Link>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
