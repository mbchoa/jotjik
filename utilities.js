export const formatTime = (time, showMs = false) => {
  const diffInHrs = time / 3600000;
  const hh = Math.floor(diffInHrs);

  const diffInMin = (diffInHrs - hh) * 60;
  const mm = Math.floor(diffInMin);

  const diffInSec = (diffInMin - mm) * 60;
  const ss = Math.floor(diffInSec);

  const diffInMs = (diffInSec - ss) * 100;
  const ms = Math.floor(diffInMs);

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
