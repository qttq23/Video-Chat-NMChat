var bcrypt = require('bcryptjs');

class EncryptAlgorithm{

    compareSync(raw, hashedString){
        return bcrypt.compareSync(raw, hashedString);
    }

    hashSync(stringToHash){
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(stringToHash, salt);
        return hash;
    }

}

module.exports = new EncryptAlgorithm();



