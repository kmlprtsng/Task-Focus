self.addEventListener('install', (event) => {
  console.log('Timer Service Worker installed');
});

self.addEventListener('activate', (event) => {
  console.log('Timer Service Worker activated');
});

self.addEventListener('message', (event) => {
  const { type, endTime } = event.data;
  
  if (type === 'START_TIMER') {
    console.log('Service Worker: Starting timer for:', new Date(endTime));
    
    const timeUntilEnd = endTime - Date.now();
    
    setTimeout(() => {
      self.registration.showNotification('Timer Complete!', {
        body: 'Your timer has finished',
        icon: '/favicon.ico',
        requireInteraction: true
      });
      
      // Post message back to main thread to play sound and update UI
      self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({
            type: 'TIMER_COMPLETE'
          });
        });
      });
    }, timeUntilEnd);
  }
});