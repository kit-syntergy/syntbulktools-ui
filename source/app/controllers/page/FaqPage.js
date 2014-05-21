define(["jquery", "RootPageController"],
    function ($, RootPageController) {
        return function() {
            var controller = Object.create(RootPageController);
            return controller;
        };
   });