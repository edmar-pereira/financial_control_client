// import React, { useEffect, useState } from 'react';
// import { Typography, Box, Switch, FormControlLabel } from '@mui/material';

// import { styled } from '@mui/material/styles';
// import Paper from '@mui/material/Paper';
// import Grid from '@mui/material/Grid2';

// const Item = styled(Paper)(({ theme }) => ({
//   backgroundColor: '#fff',
//   ...theme.typography.body2,
//   padding: theme.spacing(1),
//   textAlign: 'center',
//   color: theme.palette.text.secondary,
//   ...theme.applyStyles('dark', {
//     backgroundColor: '#1A2027',
//   }),
// }));

// import { useAPI } from '../context/mainContext';

// export default function Config() {
//   const {
//     selectedMonth,
//     arrMonths,
//     handleChangeMonth,
//     arrCategory,
//     handleChangeCategory,
//     currentCategory,
//     showTableView,
//     isDarkMode,
//     handleThemeChange,
//   } = useAPI();

//   const { month, year, expenses, pageInfo } = selectedMonth;

//   return (
//     <div>
//       <Box sx={{ flexGrow: 1 }}>
//         <Grid container spacing={2}>
//           <Grid size={8}>
//             <Item>size=8</Item>
//           </Grid>
//           <Grid size={4}>
//             <Item>size=4</Item>
//           </Grid>
//           <Grid size={4}>
//             <Item>size=4</Item>
//           </Grid>
//           <Grid size={8}>
//             <Item>size=8</Item>
//           </Grid>
//         </Grid>
//       </Box>

//       <Box
//         sx={{
//           // display: { xs: 'none', md: 'flex', flexDirection: 'column' },

//           display: 'flex',
//           justifyContent: 'left',
//           alignItems: 'center',
//         }}
//       >
//         <Typography
//           variant='h6'
//           sx={{ marginBottom: '0.3rem', marginTop: '1300px' }}
//         >
//           Seleção do tema
//         </Typography>
//       </Box>

//       <Box
//         sx={{
//           // display: { xs: 'none', md: 'flex', flexDirection: 'column' },

//           display: 'flex',
//           justifyContent: 'left',
//           alignItems: 'center',
//         }}
//       >
//         <FormControlLabel
//           control={<Switch checked={isDarkMode} onChange={handleThemeChange} />}
//           label={isDarkMode ? 'Dark' : 'Light'}
//           labelPlacement='start'
//         />
//       </Box>
//     </div>
//   );
// }
