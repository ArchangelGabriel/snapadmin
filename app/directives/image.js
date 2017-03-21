snapadmin.directive('image', function($auth){
  return{
    scope: { image: '=' },
    link: function(scope, el, attrs){
      el.bind('change', function(event) {
        var image = event.target.files[0];


        if (image) {
          scope.image = image;
          var reader = new FileReader();
          reader.onload = function (e) {
            $('.img-preview').attr('src', e.target.result);
          }
          reader.readAsDataURL(image);
        } else {
          scope.image = undefined;
        }
        scope.$apply();
      });
    }
  }
});
