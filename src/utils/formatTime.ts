export const formatTime = (time: number, showMs = false) => {
  const diffInHrs = time / 3600000;
  const hh = Math.floor(diffInHrs);

  const diffInMin = (diffInHrs - hh) * 60;
  const mm = Math.floor(diffInMin);

  const diffInSec = (time / 1000) % 60;
  const ss = Math.floor(diffInSec);

  const ms = Math.floor(time % 1000 / 10);

  const formattedHH = hh.toString();
  const formattedMM = mm.toString();
  const formattedSS = ss.toString();
  const formattedMS = ms.toString();

  const output = {
    hh: formattedHH,
    mm: formattedMM,
    ss: formattedSS,
  };

  return showMs ? { ...output, ms: formattedMS } : output;
};
