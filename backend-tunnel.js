const { spawn } = require('child_process');

function startTunnel() {
  console.log("Starting backend localtunnel with subdomain room-rental-backend-api...");
  const lt = spawn('npx localtunnel --port 3001 --subdomain room-rental-backend-api', [], { stdio: 'inherit', shell: true });
  
  lt.on('close', code => {
    console.log(`Localtunnel exited with code ${code}. Restarting in 3 seconds...`);
    setTimeout(startTunnel, 3000);
  });
}

startTunnel();
