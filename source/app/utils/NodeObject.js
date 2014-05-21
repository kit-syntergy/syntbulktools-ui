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
                getId : function(){
                    return privObj.getId();
                },
                hasMetadata : function(){
                    return privObj.hasMetadata;
                },
                getPath : function(){
                    return privObj.path;
                },
                isSkipped : function(){
                    return privObj.isSkipped;
                },
                getError : function(){
                    return privObj.errMsg;
                },
                isError : function(){
                    return privObj.isError;
                },
                setError: function(errMsg){
                    privObj.errMsg = errMsg;
                    privObj.isError = true;
                },
                setSuccess: function(){
                    privObj.errMsg = null;
                    privObj.isError = false;
                },
                setSkipped: function(){
                    privObj.isSkipped = true;
                },
                setIncluded: function(){
                    privObj.isSkipped = false;
                }
            }
        }
    });


