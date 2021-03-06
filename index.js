module.exports = function() {
  var userAgent = new require('./lib/useragent').UserAgent();

  return function*(next) {
    var source =  this.request.headers['user-agent'] || '';
    var ua = userAgent;

    ua.reset();

    if (typeof source === 'undefined') {
        source = "unknown";
    }

    ua.Agent.source = source.replace(/^\s*/, '').replace(/\s*$/, '');
    ua.Agent.os = ua.getOS(ua.Agent.source);
    ua.Agent.platform = ua.getPlatform(ua.Agent.source);
    ua.Agent.browser = ua.getBrowser(ua.Agent.source);
    ua.Agent.version = ua.getBrowserVersion(ua.Agent.source);
    ua.testNginxGeoIP(this.request.headers);
    ua.testBot();
    ua.testMobile();
    ua.testAndroidTablet();
    ua.testTablet();
    ua.testCompatibilityMode();
    ua.testSilk();
    ua.testKindleFire();

    this.state.userAgent = ua.Agent;

    yield next;
  };
};
