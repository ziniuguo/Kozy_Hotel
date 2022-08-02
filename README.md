# ESC C2G6
### To start server:
nodemon:
```
npm run dev
```
normal:
```
npm run start
```

### To start React:
```
npm run start
```

### MongoDB localhost:
Sometimes MongoDB localhost is resolved to ::1 although IPv6 is not enabled.

If you get this error:```
connect ECONNREFUSED ::1:27017```, it means that MongoDB is trying resolving localhost as IPv6 address ```::1```, rather than ```127.0.0.1```. However, your IPv6 is disabled for MongoDB, and that's the reason you get this error message.

To prevent that from happening:
#### Enable IPv6 for MongoDB:
```
sudo nano /etc/mongodb.conf
```
```
# network interfaces:
net:
  port: 27017
  bindIp: ::1, 127.0.0.1 # ::1 is IPv6
  ipv6: true # enable IPv6
```
You can also use ```bindIpAll```. More detailed docs can be found at [MongoDB official docs](https://www.mongodb.com/docs/manual/reference/configuration-options/#net-options).

I suppose your local network config be like:
```
sudo nano /etc/hosts
```
```
127.0.0.1 localhost
::1 localhost
127.0.0.1 yourhostname
```

And I don't think it's appropriate to change ```/etc/hosts```.
### To register a user without using OTP:
**UPDATE: You cannot use OTP from ```sprCatRoll@gmail.com``` now. Please register manually following the steps below.**
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