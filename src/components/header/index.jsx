import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Typography,
  IconButton,
  Box,
  Toolbar,
  Menu,
  Container,
  Button,
  MenuItem,
  AppBar,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const pages = ['Home', 'Adicionar', 'Grafico', 'Importar', 'Configurações'];

function Header() {
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = useState(null);
  const headerRef = useRef(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = (e) => {
    switch (e.nativeEvent.target.outerText.toLocaleLowerCase()) {
      case 'home':
        navigate('/');
        break;
      case 'adicionar':
        navigate('/add_expense/:id');
        break;
      case 'grafico':
        navigate('/graphic');
        break;
      case 'configurações':
        navigate('/configs');
        break;
      case 'importar':
        navigate('/import');
        break;

      default:
        navigate('/');
        break;
    }
    setAnchorElNav(null);
  };

  return (
    <div>
      <AppBar position='static'>
        <Container maxWidth='xl' ref={headerRef}>
          <Toolbar disableGutters>
            <Typography
              variant='h6'
              noWrap
              component='a'
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },

                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              Financeiro
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size='large'
                aria-label='account of current user'
                aria-controls='menu-appbar'
                aria-haspopup='true'
                onClick={handleOpenNavMenu}
                color='inherit'
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id='menu-appbar'
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' },
                }}
              >
                {pages.map((page) => (
                  <MenuItem key={page} onClick={handleCloseNavMenu}>
                    <Typography textAlign='center'>{page}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            <Typography
              variant='h5'
              noWrap
              component='a'
              href='#app-bar-with-responsive-menu'
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              Financeiro
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {pages.map((page) => (
                <Button
                  key={page}
                  onClick={handleCloseNavMenu}
                  sx={{ color: 'white', display: 'block' }}
                >
                  {page}
                </Button>
              ))}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </div>
  );
}
export default Header;
