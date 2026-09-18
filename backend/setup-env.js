const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');
const envContent = `MONGODB_URI=mongodb://localhost:27017/getsetai
JWT_SECRET=your_jwt_secret_key_here_change_this_in_production
GOOGLE_CLIENT_ID=509974976339-bpan5hceh940oqgki7adq041nnv6gldc.apps.googleusercontent.com
`;

try {
  if (fs.existsSync(envPath)) {
    console.log('.env file already exists. Please add the following line:');
    console.log('GOOGLE_CLIENT_ID=509974976339-bpan5hceh940oqgki7adq041nnv6gldc.apps.googleusercontent.com');
  } else {
    fs.writeFileSync(envPath, envContent);
    console.log('.env file created successfully with Google Client ID');
  }
} catch (error) {
  console.error('Error setting up .env file:', error);
}