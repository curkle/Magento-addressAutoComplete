// This example displays an address form, using the autocomplete feature
// of the Google Places API to help users fill in the information.

var placeSearch, autocomplete;
var IdSeparator = ':';
var streetNumber = '';
//magento fields name
var formFields = {
    'street1': '',
    'street2': '',
    'city': '',
   // 'region': '',
    'postcode': '',
    'region_id' : ''
};

var formFieldsValue = {
    'street1': '',
    'street2': '',
    'city': '',
    // 'region': '',
    'postcode': '',
    'region_id' : ''
};

  //var placeSearch,autocomplete;
  var component_form = {};


function initialize() {

    //init form
    getIdSeparator();
    initFormFields();
  
  autocomplete = new google.maps.places.Autocomplete(
      /** @type {HTMLInputElement} */(document.getElementById('billing:street1')),
      { types: ['geocode']});
  // When the user selects an address from the dropdown,
  // populate the address fields in the form.
  google.maps.event.addListener(autocomplete, 'place_changed', function() {
    fillInAddress();
  });
  var billing_address = document.getElementById("billing:street1");
	billing_address.addEventListener("focus", function( event ) {setAutocompleteCountry()}, true);

	  var billing_country = document.getElementById("billing:country_id");
	billing_country.addEventListener("change", function( event ) {setAutocompleteCountry()}, true);
}

function initFormFields()
{
	for (var field in formFields) {
        formFields[field] = ('billing' + IdSeparator + field);
    }
    component_form =
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
}

// [START region_fillform]
function fillInAddress() {
    clearFormValues();
  // Get the place details from the autocomplete object.
  var place = autocomplete.getPlace();
 	resetForm();
    var type = '';console.log(place);
    for (var field in place.address_components) {
       for (var t in  place.address_components[field].types)
       {
           for (var f in component_form) {
               var types = place.address_components[field].types;
               if(f == types[t])
               {
                   if(f == "street_number")
                   {
                       streetNumber = place.address_components[field]['short_name'];
                   }

                   var prop = component_form[f][1];
                   if(place.address_components[field].hasOwnProperty(prop)){
                       formFieldsValue[component_form[f][0]] = place.address_components[field][prop];
                   }

               }
           }
       }
    }

    appendStreetNumber();
    fillForm();
}

function clearFormValues()
{
    for (var f in formFieldsValue) {
        formFieldsValue[f] = '';
    }
}

function appendStreetNumber()
{
    if(streetNumber != '')
    {
        console.log(formFieldsValue['street1'] );
        formFieldsValue['street1'] =  streetNumber + ' '
        + formFieldsValue['street1'];
    }
}

function fillForm()
{
    for (var f in formFieldsValue) {
        if(f == 'region_id' )
        {
            selectRegion( f,formFieldsValue[f]);
        }
        else
        {
            document.getElementById(('billing' + IdSeparator + f)).value = formFieldsValue[f];
        }
    }
}


function selectRegion(id,regionText)
{
    var el = document.getElementById(('billing' + IdSeparator + id));
	for(var i=0; i<el.options.length; i++) {
	  if ( el.options[i].text == regionText ) {
	    el.selectedIndex = i;
	    break;
	  }
	}
}

function resetForm()
{
    document.getElementById(('billing' + IdSeparator + 'street2')).value = '';
}

function getIdSeparator() {
    if (!document.getElementById('billing:street1')) {
        return "_"
    }
    return ":";
}

// [END region_fillform]

// [START region_geolocation]
// Bias the autocomplete object to the user's geographical location,
// as supplied by the browser's 'navigator.geolocation' object.
function setAutocompleteCountry() {
  var country = document.getElementById('billing:country_id').value;

   autocomplete.setComponentRestrictions({ 'country': country });

}
// [END region_geolocation]
window.addEventListener('load', function(){ initialize() });
