
/* service configuration settings for UI */
angular.module('config', []).service('config', function() {

    this.services = {ws_url: "https://kbase.us/services/ws/",
                     auth_url: "https://kbase.us/services/authorization/Sessions/Login"};
})
