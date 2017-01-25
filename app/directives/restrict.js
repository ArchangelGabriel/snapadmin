snapadmin.directive('restrict', function($auth){
  return{
    restrict: 'A',
    priority: 100000,
    scope: { access: '=' },
    compile:  function(element, attr, linker){
      var accessDenied = true;
      var user = $auth.user;
      console.log(user);
      var attributes = attr.access.split(" ");
      console.log(attr.access)
      for(var i in attributes){
        if(user.role == attributes[i]){
          accessDenied = false;
        }
      }

      if(accessDenied){
        element.children().remove();
        element.remove();
      }

      return function linkFn() {
          /* Optional */
      }
    }
  }
});
