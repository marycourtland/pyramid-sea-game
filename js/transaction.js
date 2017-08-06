var transaction_id;

var customerSettings = {
	'age_group_reactions': {'fail': [28,40], 'moderate': [20,30], 'success': [10,22]},
	'age_groups': [{'this': 'youth',
					'min': 18,
					'max': 29,
					'prefs': {'slang': 'success', 'professional': 'fail', 'cordial': 'moderate'}},
				   {'this': 'professional',
			   		'min': 30,
 			   		'max': 59,
 			   		'prefs': {'slang': 'fail', 'professional': 'success', 'cordial': 'moderate'}},
				   {'this': 'elder',
			   		'min': 60,
  			   		'max': 89,
  			   		'prefs': {'slang': 'fail', 'professional': 'moderate', 'cordial': 'success'}}],
	'region_reactions': {'fail': [-20,5], 'moderate': [0,15], 'success': [20,40]},
	'regions': [{'this': 'canada',
				 'prefs': {'canada':'success', 'ne':'moderate', 'texas':'fail', 'south':'fail', 'cal':'fail', 'pnw':'moderate'}},
				{'this': 'ne',
				 'prefs': {'canada':'moderate', 'ne':'success', 'texas':'fail', 'south':'fail', 'cal':'moderate', 'pnw':'fail'}},
				{'this': 'texas',
				 'prefs': {'canada':'fail', 'ne':'fail', 'texas':'success', 'south':'moderate', 'cal':'moderate', 'pnw':'fail'}},
				{'this': 'south',
				 'prefs': {'canada':'fail', 'ne':'fail', 'texas':'moderate', 'south':'success', 'cal':'fail', 'pnw':'fail'}},
				{'this': 'cal',
				 'prefs': {'canada':'moderate', 'ne':'fail', 'texas':'moderate', 'south':'fail', 'cal':'success', 'pnw':'moderate'}},
				{'this': 'pnw',
				 'prefs': {'canada':'moderate', 'ne':'fail', 'texas':'fail', 'south':'fail', 'cal':'moderate', 'pnw':'success'}}],
	'disposition': {'min': 0, 'max': 40},
	'persona_reactions': {'fail': [-30,-5], 'success': [5,30]},
	'personas': [{'this': 'elitist',
	 			  'prefs': {'air':'success', 'grass':'fail', 'bunnies':'fail', 'pollen':'fail', 'saltwater':'fail'}},
				 {'this': 'hippy',
 			 	  'prefs': {'air':'fail', 'grass':'success', 'bunnies':'fail', 'pollen':'fail', 'saltwater':'fail'}},
				 {'this': 'house-spouse',
  			 	  'prefs': {'air':'fail', 'grass':'fail', 'bunnies':'success', 'pollen':'fail', 'saltwater':'fail'}},
				 {'this': 'trendy',
  			 	  'prefs': {'air':'fail', 'grass':'fail', 'bunnies':'fail', 'pollen':'success', 'saltwater':'fail'}},
				 {'this': 'collector',
  			 	  'prefs': {'air':'fail', 'grass':'fail', 'bunnies':'fail', 'pollen':'fail', 'saltwater':'success'}}],
	'names': ['Bob', 'Susie', 'Evan', 'Jerome', 'Chris', 'Robin']
}

var dialogTree = {
	// Customer opening lines
	0: {'success': ["Hello?", "Who is this?"]},
	// Player age-based greeting
	1: {'slang': ["This is slang."],
		'professional': ["This is professional speak."],
		'cordial': ["This is cordial."] },
	// Customer response to greeting
	2: {'fail': {'youth': ["Young fail."],
				 'professional': ["Middle-aged fail."],
				 'elder': ["Old fail."]},
	    'moderate': {'youth': ["Young meh."],
   	    			 'professional': ["Middle-aged meh."],
   	    			 'elder': ["Old meh."]},
	    'success': {'youth': ["Young win."],
   	    			'professional': ["Middle-aged win."],
   	    			'elder': ["Old win."]}},
	3: {'product': ["[Try selling product.]"],
		  'recruit': ["[Try pitching recruitment.]"]},
	// Player offers a product
	4: {'air': ["Would you like some air?"],
		'grass': ["Would you like some grass? Not the good stuff."],
		'bunnies': ["Want a dust bunny?"],
		'pollen': ["Would you like pollen?"],
		'saltwater': ["Want salt water? Only 70% of Earth covered by it."]},
	// Customer response to product offering
	5: {'fail': {'youth': ["Young fail."],
				 'professional': ["Middle-aged fail."],
				 'elder': ["Old fail."]},
	    'moderate': {'youth': ["Young meh."],
   	    			 'professional': ["Middle-aged meh."],
   	    			 'elder': ["Old meh."]},
	    'success': {'youth': ["Young win."],
   	    			'professional': ["Middle-aged win."],
   	    			'elder': ["Old win."]}},
	// Player price product close price
	6: {'offer': [["I'll put you down for one at ", " dollars."]]},
	// Customer response to product close price
	7: {false: {'youth': ["Young fail."],
				 'professional': ["Middle-aged fail."],
				 'elder': ["Old fail."]},
	    true: {'youth': ["Young win."],
   	    			'professional': ["Middle-aged win."],
   	    			'elder': ["Old win."]}},
	// Player region-based recruitment offering
	8: {'canada': ["This is Canada speak. Would you like to work for me?"],
		'ne': ["Something New England-like. Would you like to work for me?"],
		'texas': ["Texas talk. Would you like to work for me?"],
		'south': ["Southern drawl. Would you like to work for me?"],
		'pnw': ["This is the language of PNW. Would you like to work for me?"],
		'cal': ["How one speaks in California, dude. Would you like to work for me?"] },
	9: {false: {'youth': ["Young fail."],
				 'professional': ["Middle-aged fail."],
				 'elder': ["Old fail."]},
	    true: {'youth': ["Young win."],
   	    			'professional': ["Middle-aged win."],
   	    			'elder': ["Old win."]}}
	// TODO: Consider adding a 10 and 11 where you offer a recruiting percentage.
}

function generateCustomer() {
	var customer = {};
	customer['age_group'] = randomValue(customerSettings.age_groups);
	customer['age'] = randomInt(customer.age_group.min, customer.age_group.max);
	customer['name'] = randomValue(customerSettings.names);
	customer['region'] = randomValue(customerSettings.regions);
	customer['location'] = randomValue(customer.region);
	customer['disposition'] = randomInt(customerSettings.disposition.min,
										customerSettings.disposition.max);
	customer['positivity'] = 0;
	customer['persona'] = randomValue(customerSettings.personas);
	customer['responses'] = [];

	return customer;
}

function getPlayerDialogOptions(dialog_level, options){
	var keys;
	var response = {};
	if (options == null) {
		keys = dialogTree[dialog_level];
	} else {
		keys = options;
	}
	for (var key in keys) {
		response[key] = randomValue(dialogTree[dialog_level][key]);
	}
	return response;
}

// TODO: Generate buttons using getPlayerDialogOptions, associate with responses

function getCustomerDialogResponse(dialog_level, response, customer){
	var result = {};
	if (dialog_level == 0) {
		result['speaker'] = 'customer';
		result['positivity_change'] = customer.disposition;
		result['dialog'] = randomValue(dialogTree[0]['success']);
		result['options'] = getPlayerDialogOptions(1, null);
	} else if (dialog_level == 1) {
		result['speaker'] = 'player';
		result['dialog'] = randomValue(dialogTree[dialog_level][response]);
		result['positivity_change'] = 0;
	} else if (dialog_level == 2) {
		result['speaker'] = 'customer';
		result['reaction'] = customer.age_group.prefs[response];
		result['positivity_change'] = randomInt(customerSettings.age_group_reactions[result.reaction][0],
				                     customerSettings.age_group_reactions[result.reaction][1]);
		result['dialog'] = randomValue(dialogTree[dialog_level][result.reaction][customer.age_group.this]);
		result['options'] = getPlayerDialogOptions(3, null);
	} else if (dialog_level == 3) {
		result['speaker'] = 'player';
		result['dialog'] = dialogTree[dialog_level][response];
		result['positivity_change'] = 0;
		result['options'] = getPlayerDialogOptions(4, null);
	} else if (dialog_level == 4) {
		result['speaker'] = 'player';
		result['dialog'] = randomValue(dialogTree[dialog_level][response]);
		result['positivity_change'] = 0;
	} else if (dialog_level == 5) {
		result['speaker'] = 'customer';
		result['reaction'] = customer.persona.prefs[response]
		result['positivity_change'] = randomInt(customerSettings.persona_reactions[result.reaction][0],
				                     customerSettings.persona_reactions[result.reaction][1]);
		result['dialog'] = randomValue(dialogTree[dialog_level][result.reaction][customer.age_group.this]);
		result['options'] = {'price': "<<input text>>"};
	} else if (dialog_level == 6) {
		result['speaker'] = 'player';
		var random_entry = randomValue(dialogTree[dialog_level]['offer']);
		result['dialog'] = random_entry[0] + response + random_entry[1];
		result['positivity_change'] = 0;
	} else if (dialog_level == 7) {
		result['speaker'] = 'customer';
		customer.responses.push(response);
		result['reaction'] = productClose(customer);
		result['dialog'] = randomValue(dialogTree[dialog_level][result.reaction[0]][customer.age_group.this]);
		result['positivity_change'] = 0;
		//Client.sendProductClose(result.reaction, customer);
	} else if (dialog_level == 8) {
		result['speaker'] = 'player';
		result['dialog'] = randomValue(dialogTree[dialog_level][response]);
		result['positivity_change'] = 0;
	} else if (dialog_level == 9) {
		result['speaker'] = 'customer';
		customer.responses.push(response);
		result['reaction'] = recruitClose(customer);
		result['dialog'] = randomValue(dialogTree[dialog_level][result.reaction[0]][customer.age_group.this]);
		result['positivity_change'] = 0;
		//Client.sendProductClose(result.reaction, customer);
	}
	// below handles dialog_level 7 and 9, where pushed early
	if (customer.responses.length <= dialog_level) { customer.responses.push(response); }
	customer.positivity += result['positivity_change'];
	console.log('Customer positivity:' + customer.positivity);
	return result;
}

function productClose(customer) {
	var rating = 0;
	var item = customer.responses[5];
	var price = customer.responses[6];
	var sale = (customer.positivity + randomInt(-5,5)) >= 30;
	rating += customer.responses[2]=='success' ? 2 : (customer.responses[2]=='moderate' ? 1 : 0);
	rating += customer.responses[5]=='success' ? 2 : (customer.responses[5]=='moderate' ? 1 : 0);
	rating += customer.responses[7]=='success' ? 1 : 0;
	return [sale, item, price, rating];
}

function recruitSale(customer) {
	var rating = 0;
	var price = customer.responses[5];
	var sale = (customer.positivity + randomInt(-5,5)) >= 30;
	rating += customer.responses[2]=='success' ? 2 : (customer.responses[2]=='moderate' ? 1 : 0);
	rating += customer.responses[5]=='success' ? 2 : (customer.responses[5]=='moderate' ? 1 : 0);
	rating += customer.responses[9]=='success' ? 1 : 0;
	return [sale, rating];
}
