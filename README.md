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


### Install platforms and plugins

```bash
$ ionic platform add android
$ cordova -d plugin add /path/to/cloned/phonegap-facebook-plugin --variable APP_ID="800587516688651" --variable APP_NAME="ShopLane"
$ cordova plugin add org.apache.cordova.splashscreen

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

Dev Notes
---------

### Services and Controllers

```
                                               +-------------+    /** selected Stores + Collection
                                               |  StoreCart  |        Diff based data structure **/
                                               +-------------+
                                                      ^
                                                      |  /** Higgs Backend Service API
                                                      |      Lazy Async Persistence of Store cart data **/
        +-------------------------------------> +-----+-----+ <---------------------------------------+
        |                                       | Higgs Api |                                           |
        |                     +---------------> +-----------+ <---------------------+                 |
        |                     |               +----^    ^-------+                   |                 |
        |                     |               |                 |                   |                 |
        |                     |               |                 |                   |                 |
        |                     |               |                 |                   |                 |
+-------+--------+   +--------+------+  +-----+------+  +-------+--------+  +-------+-------+  +------+------+
| ListingService |   | SearchService |  | MapService |  | FriendsService |  | NearbyService |  | PlanService |
+----------------+   +---------------+  +------------+  +----------------+  +---------------+  +-------------+
        ^                   ^                 ^                 ^                  ^                 ^
        |                   |                 |                 |                  |                 |
 +-------------+      +------------+     +---------+     +-------------+     +------------+     +----------+
 | ListingCtrl |      | SearchCtrl |     | MapCtrl |     | FriendsCtrl |     | NearbyCtrl |     | PlanCtrl |
 +-------------+      +------------+     +---------+     +-------------+     +------------+     +----------+

```