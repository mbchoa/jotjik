import React from 'react';

interface Props {
  hours?: string
  minutes?: string
  seconds: string
}

const Timestamp: React.FC<Props> = ({ hours, minutes, seconds }) => (
  <>
    {parseInt(hours) > 0 && (
      <>
        {hours} <span className="text-sm">h</span>
      </>
    )}
    {parseInt(minutes) > 0 && (
      <>
        {minutes} <span className="text-sm">m</span>
      </>
    )}
    {seconds}
    <span className="text-sm">s</span>
  </>
);

export default Timestamp;
