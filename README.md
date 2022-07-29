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
 "password": "000000"
}'
```
Then, go to mongodb ```auth/users```, and delete ```createdAt``` so that it wll never expire.

Always use this email and OTP combination for login.

### To change expiration time:
 - OTP expiration time:
```javascript
// Users.js
const UserSchema = new mongoose.Schema({
    /* Other code */
    createdAt: { type: Date, 
        expires: '3m', // expiration
        default: Date.now }
});
```
You can also delete ```createdAt``` as mentioned above.
 - Login status (cookie) expiration time:
```javascript
// auth.js
router.post('/authenticate', function (req, res) {
    /* Other code */
    User.findOne({email}, function (err, user) {
        if (err) {
            /* Other code */
        } else {
            user.isCorrectPassword(password, function (err, same) {
                if (err) {
                    /* Other code */
                } else {
                    /* Other code */
                    const token = jwt.sign(payload, secret, {
                        expiresIn: 60 * 3 * 2000 // expiration
                    });
                    /* Other code */
                }
            })
        }
    })
})
```
### Possible credentials exposure:
 - [x] OTP sender email & pwd
 - [ ] ```secret = "mySecret"```