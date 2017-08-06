var transaction_id;
var dialog_level_count = 0;

var customerSettings = {
	'age_group_reactions': {'fail': [10,22], 'moderate': [20,30], 'success': [31,40]},
	'age_groups': [{'this': 'youth',
					'min': 18,
					'max': 29,
					'prefs': {'slang': 'success', 'professional': 'fail', 'cordial': 'moderate'},
					'name':["Kaiden", "Paige", "Spirit", "Khaleesi", "Banana", "Raindbow", "Roxie", "Jaden", "Seven", "Cody"],
					'images': ['teen_convo_1', 'teen_convo_2', 'teen_convo_3']},
				   {'this': 'professional',
			   		'min': 30,
 			   		'max': 59,
 			   		'prefs': {'slang': 'fail', 'professional': 'success', 'cordial': 'moderate'},
					'name':["Thomas", "Janet", "Ricky", "Stevie", "Larry", "Shirley", "Jerry", "Stacey", "Leon", "Bill"],
					'images': ['middle_convo_1', 'middle_convo_2', 'middle_convo_3']},
				   {'this': 'elder',
			   		'min': 60,
  			   		'max': 89,
  			   		'prefs': {'slang': 'fail', 'professional': 'moderate', 'cordial': 'success'},
					'name':["Archibald", "Harriet", "Humphrey", "Gertrude","Bertha", "Franklin", "George", "Lincoln", "Henrietta"],
					'images': ['aged_convo_1', 'aged_convo_2', 'aged_convo_3']}],
	'region_reactions': {'fail': [-20,-5], 'moderate': [0,15], 'success': [20,40]},
	'regions': [{'this': 'canada',
				 'prefs': {'canada':'success', 'ne':'moderate', 'texas':'fail', 'south':'fail', 'cal':'fail', 'midwest':'moderate'},
				 'region':["Toronto", "Montreal", "Calgary", "Vancouver", "Winnipeg", "Ottowa", "Calgary", "Quebec City", "Halifax"]},
				{'this': 'ne',
				 'prefs': {'canada':'moderate', 'ne':'success', 'texas':'fail', 'south':'fail', 'cal':'moderate', 'midwest':'fail'},
				 'region':["Brooklyn", "Boston", "Hartford", "Philadelphia", "Buffalo", "Concord", "Providence", "Pittsburg", "Syracuse"]},
				{'this': 'texas',
				 'prefs': {'canada':'fail', 'ne':'fail', 'texas':'success', 'south':'moderate', 'cal':'moderate', 'midwest':'fail'},
				 'region':["Oklahoma City", "Austin", "Dallas", "Reno", "Kansas City", "Armarillo", "Santa Fe", "Albuquerque"]},
				{'this': 'south',
				 'prefs': {'canada':'fail', 'ne':'fail', 'texas':'moderate', 'south':'success', 'cal':'fail', 'midwest':'fail'},
				 'region': ["Atlanta", "Nashville", "Little Rock", "New Orleans", "Charlotte", "Chattanooga", "Birmingham", "Miami"]},
				{'this': 'cal',
				 'prefs': {'canada':'moderate', 'ne':'fail', 'texas':'moderate', 'south':'fail', 'cal':'success', 'midwest':'moderate'},
				 'region':["Long Beach", "San Francisco", "Portland", "Seattle", "Oakland", "Los Angeles", "Eugene", "Bakersfield"]},
				{'this': 'midwest',
				 'prefs': {'canada':'moderate', 'ne':'fail', 'texas':'fail', 'south':'fail', 'cal':'moderate', 'midwest':'success'},
				 'region':["Minneapolis", "Fargo", "Milwaukee", "Cleveland", "Chicago", "Grand Rapids", "Omaha", "Green Bay", "Cincinnati"]}],
	'disposition': {'min': 0, 'max': 0},
	'persona_reactions': {'fail': [-30,-20], 'moderate': [-5,5], 'success': [20,30]},
	'personas': [{'this': 'elitist',
	 			  'prefs': {'scented':'success', 'grass':'fail', 'bunnies':'fail', 'pollen':'fail', 'saltwater':'fail', 'fresh' :'moderate'},
				  'occupations': ["CEO", "Venture Capitalist", "Entrepreneur", "Hedge Fund Manager", "Philanthropist", "Lawyer", "Doctor"]},
				 {'this': 'hippy',
 			 	  'prefs': {'scented':'fail', 'grass':'success', 'bunnies':'fail', 'pollen':'fail', 'saltwater':'fail', 'fresh':'moderate'},
				  'occupations':["Spirit Healer", "Shaman", "Yoga Guru", "Palm Reader", "Horse Whisperer", "Acupuncturist", "Chakra Aligner"]},
				 {'this': 'house-spouse',
  			 	  'prefs': {'scented':'fail', 'grass':'fail', 'bunnies':'moderate', 'pollen':'success', 'saltwater':'fail', 'fresh':'moderate'},
				 'occupations': ["Unemployed", "Home-maker", "Full Time Parent", "Kindergarten Teacher", "Part-time Nanny", "Loving Spouse", "N/A"]},
				 {'this': 'trendy',
  			 	  'prefs': {'scented':'fail', 'grass':'fail', 'bunnies':'fail', 'pollen':'moderate', 'saltwater':'fail', 'fresh':'success'},
				  'occupations': ["Meme maker", "Musician", "Artist", "Model", "Taste-maker", "Photographer", "Club Promoter", "Entertainment Agent"]},
				 {'this': 'collector',
  			 	  'prefs': {'scented':'fail', 'grass':'fail', 'bunnies':'success', 'pollen':'fail', 'saltwater':'moderate', 'fresh':'fail'},
				  'occupations': ["Appraiser", "Historian", "Librarian", "Hoarder", "Museum Tour Guide", "Retired", "Antique Restorer", "Junk Collector"]}]
}

var dialogTree = {
	// Customer opening lines
	0: {'success': ["Hello?", "Who is this?"]},
	// Player age-based greeting
	1: {'slang': [["'Sup, how's it goin'? I'm "," and got this hella sick deal for you"]],
		'professional': [["Hi, I'm ",". I know you're busy, but let me quickly tell you about this offer."]],
		'cordial': [["Good day to you, my name is ", ". I'd love a moment of your time to talk about an offer."]]},
	// Customer response to greeting
	2: {'fail': {'youth': ["This sounds lame..."],
				 'professional': ["This is sounding like a waste of time."],
				 'elder': ["I don't have all the time in the world, you know."]},
	    'moderate': {'youth': ["Whatevs"],
   	    			 'professional': ["Get on with it."],
   	    			 'elder': ["If you must"]},
	    'success': {'youth': ["Oh sick, tell me more"],
   	    			'professional': ["Okay, I can spare a minute!"],
   	    			'elder': ["Oh, well that sounds wonderful, I'm all ears!"]}},
	3: {'product': ["[Sell Product]"],
		  'recruit': ["[Pitch Recruit]"]},
	// Player offers a product
	4: {'scented': ["We have an unbelievable deal on Hand-crafted Luxury Scented Air!"],
		'fresh': ["I'm able to offer you Premium Free-Range Imported Air!"],
		'bunnies': ["I have Antique Decorative Collectible Dust Bunnies at an incredible discount!"],
		'dirt': ["I have access to Organic Imported Fresh Dirt"],
		'pollen': [" I have 100% Genuine Seasonal Pollen for the home, so low it's insane!"],
		'saltwater': ["I have a select Artisanal Blended Saltwater that I'm able to offer and a fraction of it's cost!"]},
	// Customer response to product offering
	5: {'fail': {'youth': ["Chill on the scams bro."],
				 'professional': ["Wow, this is a scam."],
				 'elder': ["Shame on you for trying to scam the elderly."]},
	    'moderate': {'youth': ["That's cool, I guess..."],
   	    			 'professional': ["I've heard of worse things..."],
   	    			 'elder': ["I think I'm a bit to out of touch for this..."]},
	    'success': {'youth': ["Amazeballs! That sound like literally the best thing ever!"],
   	    			'professional': ["Well that's a sound investment indeed!"],
   	    			'elder': ["Oh well ain't that just dandy!"]}},
	// Player price product close price
	6: {'offer': [["I'll put you down for one at ", " dollars."]]},
	// Customer response to product close price
	7: {false: {'youth': ["Wow, Seriously, bro? Bye Felicia!"],
				 'professional': ["You can’t be serious? Good-bye"],
				 'elder': ["That's criminal and should be ashamed of yourself! Good evening!"]},
	    true: {'youth': ["Oh, legit!"],
   	    			'professional': ["Got to spend it, to make it!"],
   	    			'elder': ["Oh well that's just the bee's knees"]}},
	// Player region-based recruitment offering
	8: {'canada': ["How’s aboot another good deal, eh?"],
		'ne': ["Now I know a wicked Smaht person like you knows a deal, am I right?!"],
		'texas': ["I can’t see a good ol’ boy/gal like you passing on this great deal!"],
		'south': ["I’m fixin’ to tell you about a deal that’ll knock y’all socks right on off!"],
		'midwest': ["Well, you betcha, I’ve got quite the deal for you, dontcha know."],
		'cal': ["I got this gnarly deal you’re going to totally flip over."] },
	9: {false: {'youth': ["Oh this is totes a scam. Scammer no scamming bro!"],
				 'professional': ["I recognize this scam. I’ll be contacting the BBB"],
				 'elder': ["I’m too old to fall for that scam. Please don’t call here again."]},
	    true: {'youth': ["This requires a selfie"],
   	    			'professional': ["This sounds like a great opportunity."],
   	    			'elder': ["This is going to pay for all the grandkids presents"]}},
	// Scam
	10: {'youth': ["This is totally not a scam, though, right?"],
		'professional': ["Any guarantee this isn’t a scam?"],
		'elder': ["You’re not just trying to scam a senior, are you?"]}
	// TODO: Consider adding a 10 and 11 where you offer a recruiting percentage.
}

function generateCustomer() {
	var customer = {};
	customer['age_group'] = randomValue(customerSettings.age_groups);
	customer['age'] = randomInt(customer.age_group.min, customer.age_group.max);
	customer['name'] = randomValue(customer.age_group.name);
	customer['region'] = randomValue(customerSettings.regions);
	customer['location'] = randomValue(customer.region.region);
	customer['disposition'] = randomInt(customerSettings.disposition.min,
										customerSettings.disposition.max);
	customer['positivity'] = 0;
	customer['persona'] = randomValue(customerSettings.personas);
	customer['occupation'] = randomValue(customer.persona.occupations);
	customer['responses'] = [];
	customer['image'] = randomValue(customer.age_group.images);

	return customer;
}

var transaction = {};

function startTransaction(customer) {
	transaction.customer = customer;
	transaction.level = 0;
	transaction.last_response = null;
	return transaction;
}

transaction.getNextDialog = function(response) {
	if (transaction.level == 7 || transaction.level == 9) { return false; }
	if (response != transaction.last_response && response != null) {
		transaction.last_response = response;
	}
	var result = getCustomerDialogResponse(transaction.level, transaction.last_response, transaction.customer);
	if (transaction.level == 3 && response == 'recruit') {
		transaction.level = 8;
	} else {
		transaction.level += 1;
	}
	return result;
};

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
		var dialog = randomValue(dialogTree[dialog_level][response]);
		result['dialog'] = dialog[0] + Player.name + dialog[1];
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
		var products = {};
		if (result.reaction[0]) {
			products = [{product: result.reaction[1], price_per_unit: result.reaction[2], quantity: 1}];
		}
		//Client.sendCustomerTransaction(products, result.reaction[3]);
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
		//Client.sendCustomerRecruitment(result.reaction[1]);
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
