import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

import PropTypes from 'prop-types';

export default function DateInfo({ selectedDate }) {
  return (
    <Box sx={{ width: '100%', maxWidth: '100%' }}>
      <Divider>
        <Typography variant="h5" gutterBottom>
          {selectedDate}
        </Typography>
      </Divider>
    </Box>
  );
}

DateInfo.propTypes = {
  selectedDate: PropTypes.string.isRequired,
};
