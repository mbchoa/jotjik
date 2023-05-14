interface ITimestampProps {
  hours: string;
  minutes: string;
  seconds: string;
}

const Timestamp = ({ hours, minutes, seconds }: ITimestampProps) => (
  <>
    {parseInt(hours) > 0 && (
      <>
        {hours}
        <span className="text-sm">h</span>
        &nbsp;
      </>
    )}
    {parseInt(minutes) > 0 && (
      <>
        {minutes}
        <span className="text-sm">m</span>
        &nbsp;
      </>
    )}
    {seconds}
    <span className="text-sm">s</span>
  </>
);

export default Timestamp;
