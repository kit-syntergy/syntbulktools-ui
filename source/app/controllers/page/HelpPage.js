define(["jquery", "RootPageController"],
    function ($, RootPageController) {
        return function() {
            return Object.create(RootPageController);
        };
   });