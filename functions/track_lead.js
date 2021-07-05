exports.handler = function(context, event, callback) {

    var Airtable = require('airtable');
    var base = new Airtable({apiKey: process.env.AIRTABLE_KEY}).base(process.env.AIRTABLE_BASE);

    console.log(event);

    var use_case = 0;
    var industry = parseInt(event.industry);

    switch(industry) {
        case 1:
            use_case = event.fintech;
            break;
        case 2:
            use_case = event.retail;
            break;
        case 3:
            use_case = event.travel;
            break;
        case 4:
            use_case = event.realestate;
            break;
        case 5:
            use_case = event.health;
            break;
        case 6:
            use_case = event.other;
            break;
    }

    use_case = parseInt(use_case);

    base('Industry').select({
        filterByFormula: `{industry_id} = ${industry}`
    }).eachPage(function page(records, fetchNextPage) {

        records.forEach(function(record) {

            var industry_id = record.id;

            base('Use Case').select({
                filterByFormula: `{Use Case} = ${use_case}`
            }).eachPage(function page(records, fetchNextPage) {
                
                // to do add work out recordid of the exact use case

                records.forEach(function(record) {

                    base('Leads').create([
                        {
                            "fields": {
                                "Phonenumber": event.phonenumber,
                                "Industry": [industry_id],
                                "Email" : event.email
                            }
                        }
                        ], function(err, records) {
                        if (err) {
                            console.error(err);
                            callback(null, err);
                        }
        
                        callback(null, 'done');
                    });

                });
            });

        })
    })
}