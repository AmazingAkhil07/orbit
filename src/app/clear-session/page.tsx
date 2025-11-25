import { signOut } from 'next-auth/react';

export default function LogoutPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Logging out...</h1>
        <p className="text-slate-400 mb-8">Clearing your session and redirecting...</p>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (async () => {
                // Clear all cookies
                document.cookie.split(";").forEach((c) => {
                  document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
                });
                
                // Sign out
                window.location.href = '/api/auth/signout?callbackUrl=/auth/signin';
              })();
            `,
          }}
        />
      </div>
    </div>
  );
}
