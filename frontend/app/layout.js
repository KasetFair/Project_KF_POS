import './globals.css';

export const metadata = {
  title: 'POS System',
  description: 'POS System using Next.js and Tailwind CSS',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
