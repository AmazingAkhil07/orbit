import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { AdminNav } from '@/components/admin/AdminNav';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Check if user is logged in
  if (!session) {
    redirect('/api/auth/signin');
  }

  // Check if user is admin
  const role = (session.user as Record<string, unknown>).role as string;
  if (role !== 'admin') {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Subtle Grid Background */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <AdminNav />
      <main className="relative z-10 container mx-auto px-4 py-8">
        <div style={{ display: 'block', visibility: 'visible' }}>
          {children}
        </div>
      </main>
    </div>
  );
}
