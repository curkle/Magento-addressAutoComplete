// This example displays an address form, using the autocomplete feature
// of the Google Places API to help users fill in the information.
"use strict";
var CURKLEAUTOCOMPLETE = CURKLEAUTOCOMPLETE || {};

CURKLEAUTOCOMPLETE.event = {};
CURKLEAUTOCOMPLETE.method = {
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
            /** @type {HTMLInputElement} */(document.getElementById('billing:street1')),
            { types: ['geocode']});
        // When the user selects an address from the dropdown,
        // populate the address fields in the form.
        google.maps.event.addListener(this.autocomplete, 'place_changed', function( event ) {CURKLEAUTOCOMPLETE.method.fillInAddress()});
        var billing_address = document.getElementById("billing:street1");
        billing_address.addEventListener("focus", function( event ) {CURKLEAUTOCOMPLETE.method.setAutocompleteCountry()}, true);

        var billing_country = document.getElementById("billing:country_id");
        billing_country.addEventListener("change", function( event ) {CURKLEAUTOCOMPLETE.method.setAutocompleteCountry()}, true);

    },
    getIdSeparator : function() {
        if (!document.getElementById('billing:street1')) {
           this.IdSeparator = "_";
            return "_";
        }
        this.IdSeparator = ":";
        return ":";
    },
    initFormFields: function ()
    {
        for (var field in this.formFields) {
            this.formFields[field] = ('billing' + this.IdSeparator + field);
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
                document.getElementById(('billing' + this.IdSeparator + f)).value = this.formFieldsValue[f];
            }
        }
    },
    selectRegion:function (id,regionText)
    {
        var el = document.getElementById(('billing' + this.IdSeparator + id));
        for(var i=0; i<el.options.length; i++) {
            if ( el.options[i].text == regionText ) {
                el.selectedIndex = i;
                break;
            }
        }
    },
    resetForm :function ()
    {
        document.getElementById(('billing' + this.IdSeparator + 'street2')).value = '';
    },


    setAutocompleteCountry : function () {
        var country = document.getElementById('billing:country_id').value;

        this.autocomplete.setComponentRestrictions({ 'country': country });
    }


}

window.addEventListener('load', function(){ CURKLEAUTOCOMPLETE.method.initialize() });
