import { AppBar, Box, Container,IconButton,Menu,MenuItem,Skeleton,Toolbar, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import Tooltip from '@mui/material/Tooltip';
import { AccountCircle } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import api from "../utils/axios";

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<{
    profile:{
      id: string
      username: string
      productName: string
    }
  } | null>(null);

  useEffect(() => {
    const getProfile = async () => {
      try {
        const response = await api.get("/v1/auth/me");
        if (response.status !== 200) {
          navigate("/login");
        }

        setUser(response.data);
      } catch (error) {
        navigate("/login");
      }
    }

    getProfile();
  }, []);

  const [anchorElUser , setAnChorElUser] = useState<null | HTMLElement>(null)

  const handleCloseUserMenu = () => {
    setAnChorElUser(null)
  }

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnChorElUser(event.currentTarget);
  };

  const logout = () => {
    localStorage.clear()
    navigate("/login")
  }

  if (!user) {
    return (
      <div>
        <Skeleton sx={{mt: 5, py: 5}} />
        <Skeleton animation="wave" sx={{ py: 5}} />
        <Skeleton animation={false} sx={{py: 5}} />
      </div>
    )
  }

  return (
    <AppBar position="sticky" color="inherit">
      <Container>
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            <img src="/krungsri_logo.ico" width="50px" alt="logo" />
          </Typography>
          <Typography 
            variant="h5"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              flexGrow: 1,
              letterSpacing: '.3rem',
              textDecoration: 'none',
              fontFamily: 'monospace',
              fontWeight: 700,
              color: 'inherit',
            }}
          >
            E-Statement
          </Typography>
          <Box sx={{ flexGrow: 0 , display: 'flex', alignItems: 'center'}}>
            <Typography>Hi, {user?.profile.username} | {user?.profile.productName}</Typography>
            <Tooltip title="Open settings">             
                <IconButton 
                  onClick={handleOpenUserMenu}
                  size="large"
                  aria-label="account of current user"
                  aria-controls="primary-search-account-menu"
                  aria-haspopup="true"
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
            </Tooltip>
            
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem key="logout" onClick={handleCloseUserMenu}>
                <Typography 
                  onClick={logout}
                  style={{ 
                    textDecoration: 'none', 
                    color: 'inherit',
                  }}
                >
                  Logout
                </Typography>
              </MenuItem>
            </Menu>
          </Box>
            
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar