$(function() {

	"use strict";
	
    $.fn.formValidate.addMessages({
        fullname: "Please enter valid full name"
    });
    $.fn.formValidate.addMessages({
        password: "Must be at least 6 characters long, and contain at least one number, one uppercase and one lowercase letter"
    });

    $.fn.formValidate.addRules({
        fullname: function(field) {
            var pattern = /^[a-zA-Z ]*$/;
            return pattern.test($(field).val());
        }
    });

    $("#signup-form").formValidate({
        attributeUsed: 'data-formvalidate',
        triggerUsed: "change keyup",
        scroll: true,
        hideErrorOnChange: true,
        skipHiddenFields: true
    });
});