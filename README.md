# spotify-supermemo

Applying the supermemo method to study songs. The songs are extracted from a list of spotify playlist. The application list the song in a so-called buffer. The buffer is used to create other spotify playlist (named by date - yyyy-MM-dd, eg 2020-09-21), which are used for studying.

## Getting started

    nvm use
    npm install
    npm run serve

## Deploying

Deployment is done by github actions. See the .github folder for details.

### Manually deploying to  Firebase

    npm install -g firebase-tools
    npm run build
    firebase deploy --only hosting


## Run your tests
```
npm run test
```


 