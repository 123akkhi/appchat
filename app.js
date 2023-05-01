const express = require('express');
const fs = require('fs');
const app = express();
const port = 6000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  const username = req.query.username;
  const messages = readMessagesFromFile();
  res.send(`
    <html>
      <head>
        <title>Chat App</title>
      </head>
      <body>
        <h1>Welcome to the Chat App</h1>
        <form action="/message" method="POST">
          <label for="message">Message:</label><br>
          <textarea id="message" name="message" rows="4" cols="50"></textarea><br>
          <input type="submit" value="Send">
        </form>
        <ul>
          ${messages.map(m => `<li>${m.username}: ${m.message}</li>`).join('')}
        </ul>
        <script>
          const username = localStorage.getItem('username');
          if (!username) {
            const newUsername = prompt('Please enter your username:');
            localStorage.setItem('username', newUsername);
            window.location.href = '/?username=' + newUsername;
          }
        </script>
      </body>
    </html>
  `);
});

app.post('/message', (req, res) => {
  const username = localStorage.getItem('username');
  const message = req.body.message;
  storeMessageToFile(username, message);
  res.redirect('/');
});

app.get('/login', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Login to Chat App</title>
      </head>
      <body>
        <h1>Login to Chat App</h1>
        <form action="/" method="GET">
          <label for="username">Username:</label><br>
          <input type="text" id="username" name="username"><br>
          <input type="submit" value="Login">
        </form>
      </body>
    </html>
  `);
});

function readMessagesFromFile() {
  const data = fs.readFileSync('messages.txt', 'utf8');
  if (!data) {
    return [];
  }
  return JSON.parse(data);
}

function storeMessageToFile(username, message) {
  const messages = readMessagesFromFile();
  messages.push({ username, message });
  fs.writeFileSync('messages.txt', JSON.stringify(messages));
}

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
