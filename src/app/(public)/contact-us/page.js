import { Button, Container, Grid, Paper, Stack, Typography } from "@mui/material";

export default function ContactUs() {
  return (
    <Container maxWidth="xl">
      <Typography variant="h2">Contact Us!</Typography>
      <Grid container spacing={1} flexDirection="row">
        <Grid item size={12}>
          <Typography variant="body1">
            Have a custom resin idea?<br/>
            Questions about sizes or pricing?<br/>
            Reach out and see what we can do.
          </Typography>
        </Grid>
        <Grid item size={12}>
          <Typography variant="body1">
            Phone: 989-293-7975<br/>
            E-mail: <a href="mailto:theresinbunch@gmail.com">TheResinBunch@gmail.com</a>
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
}
