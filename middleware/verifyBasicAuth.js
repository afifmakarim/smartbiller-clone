const auth = require("../models/auth.model");
const CryptoJS = require("crypto-js");

const verifyBasicAuth = async (req, res, next) => {
  try {
    const headerAuth = req.headers.authorization;

    if (!headerAuth) {
      return res.status(403).json({ error: "No credentials sent!" });
    }

    const headerAuthSubstr = headerAuth.substring(6);
    const decodeBasicAuth = CryptoJS.enc.Base64.parse(headerAuthSubstr);

    const decode = decodeBasicAuth.toString(CryptoJS.enc.Utf8).split(":");
    const requestUserKey = decode[0];
    //const requestPwd = decode[1];

    const checkCredentials = await auth.findOne({
      where: {
        userKey: requestUserKey,
      },
    });

    if (!checkCredentials) {
      return res.status(403).json({ error: "Invalid credentials!" });
    }

    const validUserKey = checkCredentials.userKey;
    const validPwd = checkCredentials.pwd;

    const validate = CryptoJS.enc.Base64.stringify(
      CryptoJS.enc.Utf8.parse(`${validUserKey}:${validPwd}`)
    );

    if (headerAuthSubstr !== validate) {
      console.log(headerAuth, validate);
      return res.status(403).json({ error: "request not valid" });
    }

    next();
  } catch (error) {
    console.log(error);
  }
};

module.exports = verifyBasicAuth;
