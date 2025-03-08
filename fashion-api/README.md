# Fashion-API

This folder requires:
- Express
- Firebase

# To install Express:
npm install express --no-save

If you have any problems, follow this installation guide: https://expressjs.com/en/starter/installing.html
You should have Express v.4.21.2

# To install Firebase:
npm install -g firebase-tools 
npm install firebase
npm install firebase-admin --save

If that doesn't work, try: sudo npm install -g firebase-tools

If you have any more problems, consult this guide: https://firebase.google.com/docs/cli#mac-linux-npm

# TESTING
To test your endpoint, first please download PostMan

Then, make sure you're in the correct directory and do:
node [name of file].js

VS Code should give you the link to where the API is running (as of right now, should be localhost.)

After that, you should open PostMan and where it says {base_url}, please put the link your VS Code gave you. After {base_url}, you should write the rest of your endpoint (ex. "/:user_id/inventory/upload"). Also, make sure the request on PostMan matches with the request on your endpoint (ex. GET, POST, etc). If your endpoint requires data from a request object, make sure to include that in "Body."
You should a response on PostMan, and any console loggings and access errors will appear on your console.

PostMan ONLY works while the API is running.

DISCARD THIS not sure if we still need it
## Logging into Firebase
firebase login
First question shouldn't matter, I put N
ctrl+click on the link to open it and authenticate yourself

To test if it's properly installed: firebase projects:list
It should show a 4 column table with "Fashion-Project│fashion-project-e2aba│156468025393│[Not specified]"  



