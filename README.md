Boson
=====

An app for users to search local stores, select collection and then plan shopping destinations.
Apart from this they can also invite friends and hangout with then in nearby areas.


Platform
--------

App is is build using [Ionic Framework](http://ionicframework.com/) - an hybrid mobile framework
built on top of Cordova and AngularJs .


Installation
------------

### Prerequisites
* Latest stable nodejs release
* npm cli
* bower

```bash
$ npm install -g bower
$ npm install -g gulp
$ npm install -g cordova ionic
```


### Checkout and install dependencies

```bash
$ git clone git@bitbucket.org:kumarishan/boson.git
$ cd boson
$ npm install
$ bower install
```

### Run in development mode

```bash
$ gulp
```
View the app in browser @ [http://localhost:9000](http://localhost:9000)

### Build and run on android emulater or connected device

```bash
$ gulp -r
```