require('dotenv').config({ path: '.env.local' });
const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

console.log('Testing API Key:', apiKey ? '✓ Key found' : '✗ Key not found');
console.log('Key value:', apiKey);

if (!apiKey) {
  console.error('API key is missing!');
  process.exit(1);
}

const testPayload = {
  contents: [
    {
      parts: [
        { text: 'Say hello' }
      ]
    }
  ]
};

fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(testPayload)
})
  .then(res => res.json())
  .then(data => {
    console.log('\n✓ API Key is VALID and working!');
    console.log('Response:', JSON.stringify(data, null, 2));
  })
  .catch(err => {
    console.error('\n✗ API Key test FAILED:');
    console.error(err.message);
    process.exit(1);
  });
