// Claude API 키 테스트 스크립트
// 사용법: node test-api.js YOUR_API_KEY

const https = require('https');

const apiKey = process.argv[2];

if (!apiKey) {
  console.log('사용법: node test-api.js YOUR_API_KEY');
  process.exit(1);
}

const data = JSON.stringify({
  model: 'claude-3-5-sonnet-20241022',
  max_tokens: 10,
  messages: [
    {
      role: 'user',
      content: 'Hello'
    }
  ]
});

const options = {
  hostname: 'api.anthropic.com',
  port: 443,
  path: '/v1/messages',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': apiKey,
    'anthropic-version': '2023-06-01',
    'Content-Length': data.length
  }
};

const req = https.request(options, (res) => {
  let responseData = '';
  
  res.on('data', (chunk) => {
    responseData += chunk;
  });
  
  res.on('end', () => {
    if (res.statusCode === 200) {
      console.log('✅ API 키가 유효합니다!');
      console.log('응답:', JSON.parse(responseData));
    } else {
      console.log('❌ API 키 오류:');
      console.log('상태:', res.statusCode);
      console.log('응답:', responseData);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ 요청 오류:', error.message);
});

req.write(data);
req.end(); 