import { Box, Button, Container, Grid2, Typography } from "@mui/material"
import { Link } from "react-router-dom"

const InternalErrorPage = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
      }}
    >
      <Container maxWidth="md">
        <Grid2 container spacing={2}>
          <Grid2 size={6}>
            <Typography variant="h1">
              500
            </Typography>
            <Typography variant="h6">
              Internal Server Error
            </Typography>
            <Button sx={{ mt: 2 }} component={Link} to="/" variant="contained">Back Home</Button>
          </Grid2>
          <Grid2 size={6}>
            <img
              src="/error_500.svg"
              alt=""
              width={500} height={280}
            />
          </Grid2>
        </Grid2>
      </Container>
    </Box>
  )
}

export default InternalErrorPage