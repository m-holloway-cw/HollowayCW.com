const nodemailer = require('nodemailer');
const mailGun = require('mailgun-js');


async function send(name, email, message, mailDomain, mailGunApiKey, callback){
 try{
   const domain = mailDomain;
   const mg = mailGun({apiKey: mailGunApiKey, domain: domain});
   const data = {
	from: email,
	to: 'm.holloway.cw@gmail.com',
	subject: 'Contact(HollowayCW)',
	text: 'From: '+name+' \nMessage: '+message
	};
   mg.messages().send(data, function(err, body) {
	if(err) throw err;
	});
 } catch(e) {
	console.log(e);
	return "500";
 }
	return "200 OK";
}

module.exports.send = send;