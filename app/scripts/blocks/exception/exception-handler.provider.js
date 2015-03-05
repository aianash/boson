angular
  .module('blocks.exception')
  .provider('exceptionHandler', exceptionHandlerProvider)
  .config(configure);


function exceptionHandlerProvider() {
  this.config = {
    appErrorPrefix: undefined
  };

  this.configure = function(appErrorPrefix) {
    this.config.appErrorPrefix = appErrorPrefix;
  };

  this.$get = function() {
    return {config: this.config};
  };
}

configure.$inject = ['$provide'];

function configure($provide) {
  $provide.decorator('$exceptionHandler', extendExceptionHandler);
}


extendExceptionHandler.$inject = ['$delegate', 'exceptionHandler', 'logger'];

function extendExceptionHandler($delegate, exceptionHandler, logger) {
  return function(exception, cause) {
    var appErrorPrefix = exceptionHandler.config.appErrorPrefix || '';
    var errorData = {exception: exception, cause: cause};
    exception.message = appErrorPrefix + exception.message;
    $delegate(exception, cause);

    /**
     * Could add the error to a service's collection,
     * add errors to $rootScope, log errors to remote web server,
     * or log locally. Or throw hard. It is entirely up to you.
     * throw exception;
     */

    logger.error(exception.message, errorData);
  }
}