import { Link } from 'react-router-dom';
import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import { AuthContext } from '../../context/AuthContext';

import Avatar from '@mui/material/Avatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';

const pages = ['Home', 'Class', 'Teacher'];
const settings = ['Profile'];

function Navigation() {
  const { isAuthenticated, logout } = React.useContext(AuthContext);
  const [anchorElNav, setAnchorElNav] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" style={{ backgroundColor: 'cadetblue' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters >
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleOpenNavMenu}
            sx={{ mr: 2, display: { xs: 'flex', md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AdbIcon sx={{ mr: 1 }} />

            <Typography
              variant="h6"
              noWrap
              component={Link}
              to="/"
              sx={{
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              FILM
            </Typography>


            <Box sx={{ flexGrow: 1, transform: "translateX(900px)" }}>
              <Box sx={{
                display: { xs: 'none', md: 'flex' },
              }}>
                {pages.map((page, index) => (
                  <Button
                    key={index}
                    color="inherit"
                    component={Link}
                    to={page === "Home" ? "/" : `/${page.toLowerCase()}`}
                    sx={{ mx: 1 }}
                  >
                    {page}
                  </Button>
                ))}
              </Box>
            </Box>

            <Box sx={{ flexGrow: 1, transform: "translateX(900px)" }}>
              <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                {!isAuthenticated ? (
                  <div>
                    <Button
                      color="inherit"
                      component={Link}
                      to="/login"
                      sx={{ mx: 1 }}
                    >
                      Login
                    </Button>
                    <Button
                      color="inherit"
                      component={Link}
                      to="/register"
                      sx={{ mx: 1 }}

                    >
                      Register
                    </Button>
                  </div>
                ) : (
                  <Box>
                    {settings.map((setting, index) => (
                      <Button
                        key={index}
                        color="inherit"
                        component={Link}
                        to={`/${setting.toLowerCase()}`}
                        sx={{ mx: 1 }}
                      >
                        {setting}
                      </Button>
                    ))}
                    <Button
                      key="logout"
                      color="inherit"
                      onClick={logout}
                      sx={{ mx: 1 }}
                    >
                      Logout
                    </Button>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>

          <Menu
            anchorEl={anchorElNav}
            open={Boolean(anchorElNav)}
            onClose={handleCloseNavMenu}
          >
            <Box sx={{ display: { xs: 'flex', md: 'flex' }, flexDirection: { xs: 'column', md: 'column' } }}>
              {pages.map((page, index) => (
                <MenuItem
                  key={index}
                  component={Link}
                  to={page === "Home" ? "/" : `/${page.toLowerCase()}`}
                  onClick={handleCloseNavMenu}
                >
                  {page}
                </MenuItem>
              ))}
              {!isAuthenticated ? (
                <Box>
                  <MenuItem
                    component={Link}
                    to="/login"
                    onClick={handleCloseNavMenu}
                  >
                    Login
                  </MenuItem>
                  <MenuItem
                    component={Link}
                    to="/register"
                    onClick={handleCloseNavMenu}
                  >
                    Register
                  </MenuItem>
                </Box>
              ) : (
                <Box>
                  <MenuItem
                    component={Link}
                    to="/profile"
                    onClick={handleCloseNavMenu}
                  >
                    Profile
                  </MenuItem>
                  <MenuItem
                    onClick={logout}
                  >
                    Logout
                  </MenuItem>
                </Box>
              )}


            </Box>
          </Menu>
        </Toolbar>

      </Container>
    </AppBar>
  );
}

export default Navigation;
