const sendBtn = document.getElementById('send');
const promptInput = document.getElementById('prompt');
const messages = document.getElementById('messages');

const loader = document.createElement('div');
loader.className = 'loader';
loader.style.display = 'none';
loader.innerHTML = `
  <span>Loading...</span>
`;

messages.parentElement.insertBefore(loader, messages);

sendBtn.onclick = async () => {
  messages.innerHTML = '';
  loader.style.display = 'block';

  let markdown = '';

  const prompt = encodeURIComponent(promptInput.value);

  const accessToken =
    'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyXzAxS1M2Wk1CU0ZTMko1UTFHWkFTNjRLUDVEIiwiZW1haWwiOiJtdWxhbmlhc2hpdEBnbWFpbC5jb20iLCJwaG9uZSI6Iis5MTkzMTMxOTQxMTAiLCJpYXQiOjE3ODQ4OTU0MzksImV4cCI6MTc4NDg5NjMzOSwiaXNzIjoiYXV0aC5mbHVvY2UuY29tIn0.w__TRkpLBc6uW6zPQe8_XWEtSri_9xHFscu4BGoRJkSqFOZ6P6g_9ulQpqydULv6d4ZvmmwZITxSP1UtKS9LqQyAfFCzKyVZqC_9tD_7p5F1GleQubhbb2Y9d88Vu-9nRWi2rsvWUUwRbmqusUYSqqKxxceaJdA3shAFiR7JkhAYyg9ZTpGJc1tAjYnF0mGvxLJg-knqcYLkYcGetxeLBYpmlQLOF8JdzR0l8sByQMOt3Ojkz3kEtILqJRKWxgJsSjjHhR3Ue67dAFZLUw-Cwbi8OZr22aKxBZNJDHhroIlhjURGqsLg0yDA9ItIlH23z5pk73rMqhu6o4MUp4_oag';
  const source = new EventSource(
    `http://localhost:8000/chat/db/db_pg_01KY6WE76XCVRXGKXY4BP32PW0?message=${prompt}&access_token=${encodeURIComponent(accessToken)}`,
  );

  source.onmessage = (event) => {
    markdown += event.data;

    messages.innerHTML = marked.parse(markdown);

    messages.scrollTop = messages.scrollHeight;
  };

  source.onerror = () => {
    source.close();
    loader.style.display = 'none';
  };

  source.onopen = () => {
    // Optionally do nothing or still keep loader visible
  };

  // Hide loader when the stream is done.
  source.addEventListener('end', () => {
    loader.style.display = 'none';
  });

  // Fallback: Hide loader on first message if you expect a single response per query
  source.onmessage = (event) => {
    markdown += event.data;

    messages.innerHTML = marked.parse(markdown);

    messages.scrollTop = messages.scrollHeight;
    // Hide loader after receiving first chunk or last chunk
    loader.style.display = 'none';
  };
};
