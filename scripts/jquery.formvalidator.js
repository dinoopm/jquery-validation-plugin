/**
 * Author: Dinoop Mathew
 * Date: 17/02/05
 * Description: Mcfayden assignment  
 */

(function($) {

    "use strict";

    var formValidate = {};
      
    /* Validation messages for each rules */
    formValidate.messages = {
        number: "Please enter valid number",
        string: "Please enter valid string",
        email: "Please enter a valid E-mail ID",
        phone: "Please enter a valid Phone number",
        required: "Please enter a value"
    };

    /* Validation rules */
    formValidate.rules = {
        number: function() {
            var pattern = /^[1-9]\d*(\.\d+)?$/;
            return pattern.test($(this).val());
        },
        string: function() {
            var pattern = /^[A-z]+$/;
            return pattern.test($(this).val());
        },
        email: function() {
            var pattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

            return pattern.test($(this).val());
        },
        phone: function() {
            var pattern = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
            return pattern.test($(this).val());
        },
        required: function(field) {
            if ($(field).val() === "")
                return false;
            else
                return true;
        }
    };

    $.fn.formValidate = function(options) {

        var defaults = {
            attributeUsed: 'data-formvalidate',
            triggerUsed: "blur",
            scroll: true,
            hideErrorOnChange: true,
            skipHiddenFields: true,
            submitHandler: function() {
                $(this).submit();
            }
        };
        
		/* Overriding and extending default plug-in values  */
        var opts = $.extend(defaults, options);

        formValidate.util = {

            /**
             * Renders form error messages
             * @param {String} field
             * @param {string} ruleName
             */
            renderErrorMsgs: function(field, ruleName) {
               
                $(field).addClass("error");
                $(field).next(".error-message").remove();
                $(field).after("<p class='error-message'>" + formValidate["messages"][ruleName] + "</p>");

            },
            /**
             * Validates each form fields
             * @param {String} field
             */
            validateField: function(field) {

                var validForm;

                var ruleName;
           
                if ($(field).attr('required')) {

                    validForm = formValidate["rules"]["required"].call(this, field);
                   
                    if (!validForm) {
					
                        ruleName = "required";
						
                    } else {

                        ruleName = $(field).attr("" + opts.attributeUsed + "");

                        //true if field has validation attribute 
                        if (ruleName){
                            validForm = formValidate.rules[ruleName].call(this, field);
					    } 		
                    }

                } else {
                    if ($(field).val() !== "") {
					
					    if ($(field).attr("" + opts.attributeUsed + "")) {
                           ruleName = $(field).attr("" + opts.attributeUsed + "");
                           validForm = formValidate.rules[ruleName].call(this, field);
						}   
						
						
                    } else {
                        validForm = true;
                    }
                }
                
				/* checks if the field has assync-pattern */
				
                if ($(field).attr('data-assync-pattern')) {

                    $.ajax({
                        url: $(field).attr('data-server-url'),  
                        async: false,
                        data: $(field).attr("id"),
                        success: function(data) {
						
                         var pattern = eval(data);
						 
							validForm = pattern.test($(field).val());
							ruleName = 	$(field).attr("id");
							
                        }
                    });		
                };

                if (!validForm) {
                    formValidate.util.renderErrorMsgs(this, ruleName);
                } else {
                    if (opts.hideErrorOnChange) {
                        formValidate.util.removeErroMsgs(this);
                    }
                }
				
				return validForm;
				
            },
            /**
             * Removes form error messages
             * @param {String} field
             */
            removeErroMsgs: function(field) {
                $(field).removeClass("error");
                $(field).next(".error-message").remove();
            },
            /**
             * Screen scrolls to the first element
             * @param {Integer} position
             */
            scrollTofirstError: function(position) {
                $('html, body').animate({
                    scrollTop: position
                }, 500);
            },
            /**
             * Event handler for for submission
             * @param {object}fieldsToValidate 
             * @return {boolean} validForm
             */
            onSubmitForm: function(fieldsToValidate) {
                var lastfield = fieldsToValidate.length - 1;

                formValidate.valid = true;

                $.each(fieldsToValidate, function(index, field) {

                    /* Each fields are passed to validateField method for validating the fields */
					
                     var validForm = formValidate["util"]["validateField"].call(this, field);
						
					 if(validForm===false){
						formValidate.valid = false;				
					 }
						
                    /* Checks whether the looping has completed */ 					
                    if (index === lastfield) {
					  if($(fieldsToValidate.context).find(".error:first").length){
                        formValidate["util"]["scrollTofirstError"].call(this, $(fieldsToValidate.context).find(".error:first").position().top);
					  }	
                    }

                });
				
                return formValidate.valid;
            }
        };


        return this.each(function() {
            var $this = $(this);
            var fieldsToValidate = $this.find("[" + opts.attributeUsed + "],[required],[data-assync-pattern='true']");

            /* novalidate attribute is added to the form, if HTML5*/
            $this.attr("novalidate", "novalidate");


            /*excluding the hidden fields if option set to true*/
            if (opts.skipHiddenFields) {
                fieldsToValidate = fieldsToValidate.not(':hidden');
            }

            /*input trigger event added based on the option triggerUsed*/
            fieldsToValidate.on(opts.triggerUsed, function(event) {
                //  console.log(event.target);
                formValidate["util"]["validateField"].call(this, event.target);
            });

            /* Event handler for submit button*/
            $this.find("button[type=submit]").on("click", function(event) {
                event.preventDefault();
                var valid = formValidate.util.onSubmitForm(fieldsToValidate);
                if (valid) {
                    opts.submitHandler.call($this);
                }
            });
        });
    };

    /* For overriding/extending existing rules */
    $.fn.formValidate.addRules = function(customRules) {
	   
        formValidate.rules = $.extend(formValidate.rules, customRules);
		
    };

    /* For overriding/extending existing error messages */
    $.fn.formValidate.addMessages = function(customMessages) {
        formValidate.messages = $.extend(formValidate.messages, customMessages);
    };

})(jQuery);