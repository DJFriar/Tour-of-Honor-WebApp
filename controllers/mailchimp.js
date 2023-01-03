require('dotenv').config();

const client = require('@mailchimp/mailchimp_marketing');
const crypto = require('crypto');

const apiKey = process.env.MAILCHIMP_API_KEY;
const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX;
const CurrentRallyYear = process.env.CURRENT_RALLY_YEAR;

client.setConfig({
  apiKey,
  server: serverPrefix,
});
const addSubscriber = async (email, firstName, lastName) => {
  const userHash = crypto.createHash('md5').update(email).digest('hex');
  const createSubscriber = await client.lists.setListMember('9af8900b6e', userHash, {
    email_address: email,
    merge_fields: {
      FNAME: firstName,
      LNAME: lastName,
    },
    status_if_new: 'subscribed',
  });
  console.log('==== Mailchimp createSubscriber ====');
  console.log(createSubscriber);
  if (createSubscriber && createSubscriber.id) {
    const addTag = await client.lists.updateListMemberTags('9af8900b6e', userHash, {
      tags: [
        {
          name: `${CurrentRallyYear} Rider`,
          status: 'active',
        },
      ],
    });
    console.log('==== Mailchimp addTag ====');
    console.log(addTag);
  }
};

exports.addSubscriber = addSubscriber;
