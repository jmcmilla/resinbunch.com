/* eslint-disable @next/next/no-img-element */
import { Button, Container, Grid, ImageList, ImageListItem, Paper, Stack, Typography } from "@mui/material";

export default function Home() {
  return (
    <Grid container>
        <Grid size={{ xs: 12, md: 8 }} offset={{ xs: 0, md: 2 }}>
          <Paper>
            <Typography variant="h2" style={{ textAlign: 'center' }}>Resin is What We Do!</Typography>
            <Grid container p={2}>
              <Grid size={{ xs: 12, md: 8 }}>
                <ImageList variant="masonry" cols={3} gap={4}>
                  <ImageListItem>
                    <img src="/frog.jpg" alt="Frogs" loading="lazy" />
                  </ImageListItem>
                  <ImageListItem>
                    <img src="/homedecor.jpg" alt="Home Decor" loading="lazy" />
                  </ImageListItem>
                <ImageListItem>
                  <img src="/licensed.jpg" alt="Licensed Figures" loading="lazy" />
                </ImageListItem>
                  <ImageListItem>
                    <img src="/nightlight.jpg" alt="Night Lights" loading="lazy" />
                  </ImageListItem>
                  <ImageListItem>
                    <img src="/nightlight1.jpg" alt="Licensed Figures" loading="lazy" />
                  </ImageListItem>
                  <ImageListItem>
                    <img src="/trays.jpg" alt="Serving Trays" loading="lazy" />
                  </ImageListItem>
                </ImageList>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }} p={1}>
                <Typography variant="body1">
                  The Resin Bunch is a 100% family owned and operated crafting shop who are inspired
                  by producing fun and exciting epoxy resin projects at prices that people can really afford.
                </Typography>
                <hr/>
                <Typography variant="body1">
                  We create frogs, turtles, snakes, and many other animals
                  or night-lights with popular licensed figures like Pokémon, Hello Kitty, My Little Pony, Lelo & Stich.
                </Typography>
                <hr/>
                <Typography variant="body1">
                  Inspiration comes from everywhere but we feel our greatest inspiration comes from Jesus which is why
                  we also have a large selection of crosses for home decoration or jewelry.
                </Typography>
                <hr/>
                <Typography variant="body1">
                  If you are looking for other household trinkets you could consider some of our ring holders, trinket and serving trays,
                  or even start a project refinishing your tables, counters, or floors.
                </Typography>
                <hr/>
                <Typography variant="body1">
                  Have a special occasion you want to remember forever?  We will create custom resin layouts for your
                  memories. Imagine your wedding bouquet preserved forever in an elegant heart shaped piece of artwork
                  that will brighten your home for years to come.
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
    </Grid>
  );
}
