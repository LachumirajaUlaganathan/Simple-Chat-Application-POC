const bcrypt = require('bcrypt');
const saltRounds = 10;

function encrypt(plainText, secretKey) {
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(plainText, salt);
    return hash;
}


function decrypt(encryptedData, password) {
   return  bcrypt.compareSync(password, encryptedData);
}

module.exports = { encrypt, decrypt };
