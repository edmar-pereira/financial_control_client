import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Typography,
  IconButton,
  FormControlLabel,
  Box,
  Toolbar,
  Menu,
  Container,
  Button,
  MenuItem,
  AppBar,
  Switch,
} from '@mui/material';
import TableChartIcon from '@mui/icons-material/TableChart';
import ViewListIcon from '@mui/icons-material/ViewList';
import MenuIcon from '@mui/icons-material/Menu';

import { useAPI } from '../../context/mainContext';

const pages = ['Home', 'Adicionar', 'Grafico'];

function Header() {
  const { showTableView, setShowTableView, handleThemeChange, isDarkMode } = useAPI();
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = useState(null);
  const headerRef = useRef(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleChangeViewType = () => {
    setShowTableView(!showTableView);
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

      default:
        navigate('/');
        break;
    }
    setAnchorElNav(null);
  };

  return (
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

          <Box
            sx={{
              display: { xs: 'none', md: 'flex', flexDirection: 'column' },
            }}
          >
            {showTableView ? (
              <IconButton
                style={{ color: 'white' }}
                onClick={() => handleChangeViewType()}
              >
                <TableChartIcon />
              </IconButton>
            ) : (
              <IconButton
                style={{ color: 'white' }}
                onClick={() => handleChangeViewType()}
              >
                <ViewListIcon />
              </IconButton>
            )}
          </Box>

          <Box
            sx={{
              display: { xs: 'none', md: 'flex', flexDirection: 'column' },
            }}
          >
            <FormControlLabel
              control={
                <Switch checked={isDarkMode} onChange={handleThemeChange} />
              }
              label={isDarkMode ? 'Dark' : 'Light'}
            />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Header;
