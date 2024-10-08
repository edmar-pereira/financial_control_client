import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import { styled, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import { useAPI } from '../../context/mainContext';
import Button from '@mui/material/Button';
import InputBase from '@mui/material/InputBase';
import MenuItem from '@mui/material/MenuItem';
import TableChartIcon from '@mui/icons-material/TableChart';
import ViewListIcon from '@mui/icons-material/ViewList';

const pages = ['Home', 'Adicionar', 'Grafico'];

function Header() {
  const { showTableView, setShowTableView } = useAPI();
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = React.useState(null);
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
                sx={{ my: 2, color: 'white', display: 'block' }}
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
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Header;
