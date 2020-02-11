# LGTV On and Off
I did this app just to turn on and off my LG TV with WebOS (LG UH6030 43") with a little bit of help of IFTTT and Google Assistant

# How to use it
You don't, or if you have like 30 mins of time just to mount this and do nothing relevant more than turn it of and on, then go ahead. 
...wait, you can turn it on and off from outside of your house!, so maybe that is a little bit helpful.

- Modify the config values insite the app.js (IP, MAC and Token)
- Install the npm dependencies: `npm install`
- Run `node app.js` to see if you don't have any issues, then, stop it
- Almost there! only like 20 mins more!
- Open the port 3000 in your PC to the public (yup, you need it, so use https://www.yougetsignal.com/tools/open-ports/ to test if its open as intended)
- Install IFTTT in your SmartPhone
- Create an Apple that "if -> command in Google Assistant then -> Webhook"
- In the Webhook, add a "GET" request to "http://your-public-ip:3000/turn-on?token=THE_TOKEN_IN_APP" and name it "Turn on" (nice name!), and then add the phrase you want like "turn on the tv" or stuff like that and what you want to get as an answer from Google Assistant like "ok my master, I will turn on your tv!"
- Repeat for turn off, but change "turn-on" with "turn-off" in the URL, remember to include the token :)
- I promise only 5 more minutes!
- You already have the webhook, the API and then, you need... TO TURN THIS ON! \*insert metal music here\*
- Run `node app.js` again and test it!

# Credits:
- WoL creators
- Express and Body-parse creators
- LGTV2 dependency creator 
- Me
- You, because you used this sh\*t

# More:
Follow me for more sh\*tty code and sh\*tty projects
