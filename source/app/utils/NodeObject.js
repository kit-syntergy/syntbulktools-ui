define([],
    function ($, _) {
        return function(path, id, hasMetadata) {
            var privObj = {
                id: id,
                path: path,
                hasMetadata: hasMetadata,
                isSkipped: false,
                isError: false,
                errMsg: null
            };

            return {
                hasMetadata : function(){
                    return privObj.hasMetadata;
                },
                isSkipped : function(){
                    return privObj.isSkipped;
                },
                isError : function(){
                    return privObj.isError;
                }}
        }
    });


