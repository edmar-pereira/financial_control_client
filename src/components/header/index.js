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
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import MenuItem from '@mui/material/MenuItem';

const pages = ['Home', 'Adicionar', 'Grafico'];

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
  },
}));

function Header() {
  const { handleFilter } = useAPI();
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [pageWidth, setPageWidth] = useState(0);
  const headerRef = useRef(null);
  const myRef = useRef(null);

  const [clickedOutside, setClickedOutside] = useState(true);

  const handleClickOutside = (e) => {
    if (myRef.current && !myRef.current.contains(e.target)) {
      setClickedOutside(true);
    } else {
      setClickedOutside(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  });

  useEffect(() => {
    const handleResize = () => {
      setPageWidth(headerRef.current.offsetWidth);
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    clickedOutside === false
      ? setPageWidth(400)
      : setPageWidth(headerRef.current.offsetWidth);

    if (searchTerm !== '') {
      const delayDebounceFn = setTimeout(() => {
        handleFilter(searchTerm);
      }, 1500);

      return () => clearTimeout(delayDebounceFn);
    }
  }, [searchTerm, clickedOutside]);

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
            FInanceiro
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
            FInanceiro
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
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder={pageWidth >= 400 ? 'Search…' : ''}
              inputProps={{ 'aria-label': 'search' }}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: pageWidth >= 400 ? '200px' : '50px' }}
              ref={myRef}
              onClick={handleClickOutside}
            />
          </Search>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Header;
