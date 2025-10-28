import './globals.css';
import { AuthProvider } from '../context/AuthContext';
// You might also need to correct this import based on your path:
// import { AuthProvider } from '@/context/AuthContext'; 

export const metadata = {
  title: 'Voting Application',
  description: 'A modern, secure voting platform.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {/* THIS WRAPPER IS ESSENTIAL */}
        <AuthProvider> 
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
