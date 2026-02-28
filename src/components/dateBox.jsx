import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

import PropTypes from 'prop-types';

export default function DateInfo({ info }) {
  return (
    <Box sx={{ width: '100%', maxWidth: '100%' }}>
      <Divider>
        <Typography variant='h5' gutterBottom>
          {info}
        </Typography>
      </Divider>
    </Box>
  );
}

DateInfo.defaultProps = {
  info: '',
};

DateInfo.propTypes = {
  info: PropTypes.string.isRequired,
};
