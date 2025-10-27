const webpush = require('web-push');

// Generate VAPID keys
const vapidKeys = webpush.generateVAPIDKeys();

console.log('=== VAPID Keys Generated ===');
console.log('Public Key (Use this in frontend):');
console.log(vapidKeys.publicKey);
console.log('\nPrivate Key (Use this in backend):');
console.log(vapidKeys.privateKey);
console.log('\n=== Add to Environment Variables ===');
console.log('NEXT_PUBLIC_VAPID_PUBLIC_KEY=' + vapidKeys.publicKey);
console.log('VAPID_PRIVATE_KEY=' + vapidKeys.privateKey);
