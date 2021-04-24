import { format } from 'date-fns';

import Timer from '../components/Timer';

export default function Home() {
  const currentTime = Date.now();
  const dayTokens = format(currentTime, 'do').split(/(\d+)/).slice(1);
  const month = format(currentTime, 'MMMM');
  const year = format(currentTime, 'yyyy');
  return (
    <>
      <header className="text-center">
        <h1 className="flex justify-center text-3xl">
          {month} {dayTokens[0]}
          <sup className="text-base pt-2">{dayTokens[1]}</sup>, {year}
        </h1>
        <p className="text-xl mt-2">{format(currentTime, 'EEEE')}</p>
      </header>
      <div className="flex flex-1 justify-center items-center">
        <Timer />
      </div>
    </>
  );
}
