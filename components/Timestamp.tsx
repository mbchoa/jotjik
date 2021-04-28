import React from 'react';

interface Props {
  hours?: number
  minutes?: number
  seconds: number
}

const Timestamp: React.FC<Props> = ({ hours, minutes, seconds }) => (
  <>
    {hours > 0 && (
      <>
        {hours} <span className="text-sm">h</span>
      </>
    )}
    {minutes > 0 && (
      <>
        {minutes} <span className="text-sm">m</span>
      </>
    )}
    {seconds}
    <span className="text-sm">s</span>
  </>
);

export default Timestamp;
