import * as React from 'react';
import '../pages/styles.css';

export default function Loader({ label = 'Loading data...' }) {
  return (
    <div className='dot-wave-wrapper'>
      <div className='dot-wave-loader'>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <span className='loader-label'>{label}</span>
    </div>
  );
}
