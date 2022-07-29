# ESC C2G6
### To start server (nodemon):
```
npm run dev
```

### To start server:
```
npm run start
```

### To start React:
```
npm run start
```

### To register a user without using OTP:
```
curl -X POST \
  http://localhost:5000/register \
  -H 'Content-Type: application/json' \
  -d '{
 "email": "me@example.com",
 "password": "mypassword"
}'
```