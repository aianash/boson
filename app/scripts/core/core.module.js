angular.module('boson.core', [

  'ionic',
  'ionic-material',

  /**
   * Angular modules
   */
  'ngCordova',
  'LocalForageModule',

  /**
   * Reusable cross app modules
   */
  'blocks.logger', 'blocks.exception',

  /**
   * Find a better way for this
   */
]);