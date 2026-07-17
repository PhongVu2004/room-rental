const { spawn } = require('child_process');

console.log("Starting pinggy tunnel...");
const pinggy = spawn('ssh', ['-p', '443', '-R0:0:localhost:3001', 'a.pinggy.io', '-o', 'StrictHostKeyChecking=no']);

pinggy.stdout.on('data', data => {
  const output = data.toString();
  console.log(`[PINGGY] ${output}`);
});

pinggy.stderr.on('data', data => {
  const output = data.toString();
  console.log(`[PINGGY] ${output}`);
  // Try to find the URL
  const match = output.match(/https:\/\/[a-zA-Z0-9-]+\.pinggy\.link/);
  if (match) {
    console.log(`!!! FOUND URL: ${match[0]} !!!`);
    const fs = require('fs');
    fs.writeFileSync('backend-url.txt', match[0]);
  }
});

pinggy.on('close', code => {
  console.log(`Pinggy process exited with code ${code}`);
});
