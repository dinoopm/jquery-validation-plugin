Usage
------
* Validation message shall be given in data-formvalidate attribute

-example
<input type="text" id="email" name="email" data-formvalidate="email" required>


* API for add/overriding existing messages
-example
$.fn.formValidate.addMessages({name:"Please enter valid name"});  

* API for add/overriding existing rules	

$.fn.formValidate.addRules({name:function(field){
	var pattern = /^[\\p{L} .'-]+$/;
	return pattern.test($(field).val());
}});

Please note that above API should be invoked before the form validate plug-in. 

* Invoking the validation plug-in
  
$("#signup-form").formValidate(
	{attributeUsed:'data-formvalidate', // Custom html input attribute for giving form validation rules
	triggerUsed:"change keyup",  // Trigger used for validating individual fields
	scroll:true, // After form submission window will scroll to the first error message  
	hideErrorOnChange:true, // Error messages shall be when use changes the value 
	skipHiddenFields:true //Excludes in hidden fields
});

 
* How to configure custom message for the Asynchronous rules
 
  -Input ID should be give an key for the message
  
  Example
  
  $.fn.formValidate.addMessages({password:"Please enter valid name"});

 
 
 