# 4261Prog1

After cloning the repo, you may need to install a few packages. 

Install Node.js which includes npm. Use the LTS version for stability. You can check your installations of node and npm by doing `node -v` and `npm -v` respectively. You should have a version 18+ for node, otherwise you may run into issues with Expo and Firebase. 

Next, you may need to install Expo CLI by doing `npm install -g expo-cli`. You can check your Expo version by doing `npx expo --version`.

Navigate to the repo in your local and `cd` into `FitnessDiaryApp`. Run `npm install` to ensure all dependencies are installed from the `package.json`. In the meantime, download Expo Go on your iPhone or Android and create an account to run the application. Make sure your phone and computer are on the same Wi-Fi network. 

Then, you can run `npx expo start -c` (the `-c` flag is optional and clears the Metro bundler cache). Then scan the QR code using your phone's camera and you should see the application running on your phone after it installs and downloads the applications. 

You can also run the web emulator using the `w` key on your laptop. 

Other steps that we accomplished to configure Firebase:
- `npm install firebase` - installing Firebase 
- `gsutil cors set cors.json gs://fitnessdiaryapp-37a1b.firebasestorage.app` - configuring CORS on Firebase Storage with the custom `cors.json` file.
