// This example displays an address form, using the autocomplete feature
// of the Google Places API to help users fill in the information.
// for shipping
"use strict";
var CURKLEAUTOCOMPLETE_SHIPPING = CURKLEAUTOCOMPLETE_SHIPPING || {};

CURKLEAUTOCOMPLETE_SHIPPING.event = {};
CURKLEAUTOCOMPLETE_SHIPPING.method = {
    placeSearch: "", //
    IdSeparator: "", //
    autocomplete : "",
    streetNumber : "",
    formFields : {
        'street1': '',
        'street2': '',
        'city': '',
        // 'region': '',
        'postcode': '',
        'region_id' : ''
    },
    formFieldsValue : {
        'street1': '',
        'street2': '',
        'city': '',
        // 'region': '',
        'postcode': '',
        'region_id' : ''
    },
    component_form : "",

    initialize: function(){
        //init form
        this.getIdSeparator();
        this.initFormFields();

        this.autocomplete = new google.maps.places.Autocomplete(
            /** @type {HTMLInputElement} */(document.getElementById('shipping:street1')),
            { types: ['geocode']});
        // When the user selects an address from the dropdown,
        // populate the address fields in the form.
        google.maps.event.addListener(this.autocomplete, 'place_changed', function( event ) {CURKLEAUTOCOMPLETE_SHIPPING.method.fillInAddress()});
        var shipping_address = document.getElementById("shipping:street1");
        if(shipping_address != null){
			 	  shipping_address.addEventListener("focus", function( event ) {CURKLEAUTOCOMPLETE_SHIPPING.method.setAutocompleteCountry()}, true);
			 	} 

        var shipping_country = document.getElementById("shipping:country_id");
        if(shipping_country != null){
        	 shipping_country.addEventListener("change", function( event ) {CURKLEAUTOCOMPLETE_SHIPPING.method.setAutocompleteCountry()}, true);
        }
       

    },
    getIdSeparator : function() {
        if (!document.getElementById('shipping:street1')) {
           this.IdSeparator = "_";
            return "_";
        }
        this.IdSeparator = ":";
        return ":";
    },
    initFormFields: function ()
    {
        for (var field in this.formFields) {
            this.formFields[field] = ('shipping' + this.IdSeparator + field);
        }
        this.component_form =
        {
            //      'administrative_area_level_3': ['street1', 'long_name'],
            //     'neighborhood': ['street1', 'long_name'],
            //     'subpremise': ['street1', 'short_name'],
            'street_number': ['street1', 'short_name'],
            'route': ['street1', 'long_name'],
            //    'sublocality': ['street2', 'long_name'],
            //    'sublocality_level_1': ['street2', 'long_name'],
            'locality': ['city', 'long_name'],
            //'administrative_area_level_1': [formFields.region, 'long_name'],
            'administrative_area_level_1': ['region_id', 'long_name'],
            'postal_code': ['postcode', 'short_name']
        };
    },
    // [START region_fillform]
    fillInAddress : function () {
        this.clearFormValues();
        // Get the place details from the autocomplete object.
        var place = this.autocomplete.getPlace();
        this.resetForm();
        var type = '';
        for (var field in place.address_components) {
            for (var t in  place.address_components[field].types)
            {
                for (var f in this.component_form) {
                    var types = place.address_components[field].types;
                    if(f == types[t])
                    {
                        if(f == "street_number")
                        {
                            this.streetNumber = place.address_components[field]['short_name'];
                        }

                        var prop = this.component_form[f][1];
                        if(place.address_components[field].hasOwnProperty(prop)){
                            this.formFieldsValue[this.component_form[f][0]] = place.address_components[field][prop];
                        }

                    }
                }
            }
        }

        this.appendStreetNumber();
        this.fillForm();
        //for firecheckout only change zipcode
        if(typeof  FireCheckout !== 'undefined')
        {
        	 checkout.update(checkout.urls.shipping_address);
        }
    },

    clearFormValues: function ()
    {
        for (var f in this.formFieldsValue) {
            this.formFieldsValue[f] = '';
        }
    },
    appendStreetNumber : function ()
    {
        if(this.streetNumber != '')
        {
            this.formFieldsValue['street1'] =  this.streetNumber + ' '
            + this.formFieldsValue['street1'];
        }
    },
    fillForm : function()
    {
        for (var f in this.formFieldsValue) {
            if(f == 'region_id' )
            {
                this.selectRegion( f,this.formFieldsValue[f]);
            }
            else
            {
            	 if(document.getElementById(('shipping' + this.IdSeparator + f)) === null){
							   continue;
							 }
							 else
							 {
							 		document.getElementById(('shipping' + this.IdSeparator + f)).value = this.formFieldsValue[f];
							 }
              
            }
        } 
    },
    selectRegion:function (id,regionText)
    {
    	 if(document.getElementById(('shipping' + this.IdSeparator + id)) == null){
			   return false;
			 } 
        var el = document.getElementById(('shipping' + this.IdSeparator + id));
        for(var i=0; i<el.options.length; i++) {
            if ( el.options[i].text == regionText ) {
                el.selectedIndex = i;
                break;
            }
        }
    },
    resetForm :function ()
    {
    	 if(document.getElementById(('shipping' + this.IdSeparator + 'street2')) !== null){
			   document.getElementById(('shipping' + this.IdSeparator + 'street2')).value = '';
			 }   
    },


    setAutocompleteCountry : function () {
    	
    	 if(document.getElementById('shipping:country_id') === null){
			   country = 'US';//change your codes for default country 
			 }
			 else
			 {
        var country = document.getElementById('shipping:country_id').value;
      }
       this.autocomplete.setComponentRestrictions({ 'country': country });
    }


}

window.addEventListener('load', function(){ CURKLEAUTOCOMPLETE_SHIPPING.method.initialize() });
