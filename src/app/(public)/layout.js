/* eslint-disable @next/next/no-img-element */
import { ThemeProvider } from '@mui/material/styles';
import theme from '../../theme';
import { Container, Button, Stack } from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';

export default function PublicLayout({ children }) {
  return (
    <div>
      <Container maxWidth={false} style={{
            backgroundImage: `url('/background.jpg')`,
            backgroundAttachment: 'fixed',
            backgroundSize: 'cover',
            backgroundPosition: '0px -585px',
            backgroundRepeat: 'no-repeat',
          }}>
          <img
            width="150px"
            alt="The Resin Bunch" src="/logo.jpg"
          />
      </Container>
      <Stack direction="row">
        <Button>Home</Button>
        <Button>Contact Us</Button>
      </Stack>
      <AppRouterCacheProvider>
        <ThemeProvider theme={theme}>
          {children}
        </ThemeProvider>
      </AppRouterCacheProvider>
    </div>
  );
}
