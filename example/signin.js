const Bitmusa = require('node-bitmusa-api');
const bitmusa = new Bitmusa('dummy_key');

(async function(){

    bitmusa.signIn("[replace_email]","[replace_password]").then(result => {
        console.log(result);
    }).catch(err => {
        console.log(err);
    });


})();