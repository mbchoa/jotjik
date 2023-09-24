let startTime;
let elapsedTime = 0;
let isRunning = false;

addEventListener('message', function (event) {
  const { type } = event.data;

  switch (type) {
    case 'START':
      if (!isRunning) {
        startTime = Date.now() - elapsedTime;
        isRunning = true;
        this.requestAnimationFrame(tick);
      }
      break;

    case 'PAUSE':
      if (isRunning) {
        isRunning = false;
      }
      break;

    case 'RESET':
      elapsedTime = 0;
      isRunning = false;
      this.self.postMessage({ type: 'TICK', elapsedTime });
      break;
  }
});

function tick() {
  if (isRunning) {
    elapsedTime = Date.now() - startTime;
    self.postMessage({ type: 'TICK', elapsedTime });
    requestAnimationFrame(tick);
  }
}
