import { Roboto } from 'next/font/google';

const roboto = Roboto({
 weight: ['300', '400', '500', '700'],
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-roboto',
});

export const metadata = {
  title: "The Resin Bunch",
  description: "Creative Hands, Faithful Hearts",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: '0px', padding: '0px' }} className={`${roboto.variable}`}>
        {children}
      </body>
    </html>
  );
}
