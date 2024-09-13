/**********************************************/
/***********  Import external modules ******************/
const bcrypt = require('bcrypt');
const prisma = require('../config/prismaConfig');
const validator = require('validator');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

/**********************************************/
/***********  Import external modules ******************/
const generateVerificationCode = require('../utils/generateVerificationCode');
const {
  generateTokenAndSetCookie,
  generateRefreshTokenAndSetCookie,
} = require('../utils/generateTokenAndSetCookie');
const sendVerificationToken = require('../middlewares/sendEmail/sendVerificationToken');
const sendWelcomeEmail = require('../middlewares/sendEmail/sendWelcomeEmail');
const sendResetPasswordToken = require('../middlewares/sendEmail/sendResetPasswordToken');

//CREATE NEW USER
exports.singup = async (req, res, next) => {
  //On récupére les information entré par l'utilisateur
  const { email, username, password } = req.body;
  try {
    //On verifie que tous les champs sois bien remplire
    if (!email || !password || !username) {
      throw new Error('Veuillez renseigner tous les champs SVP!');
    }

    //On verifive si c'est bien un email qui a ete renseigner
    if (!validator.isEmail(email)) {
      throw new Error("Format de l'address email invalide!");
    }

    //on verife si l'utilistauer exista deja
    const userExist = await prisma.user.findUnique({
      where: { email: email },
    });

    if (userExist) {
      return res.status(409).json({
        sucess: false,
        message: 'Un utilisateur utilise deja cette adresse email!',
      });
    }

    // on crypte le mot de pas de l'ustilisateur
    const hashPassword = await bcrypt.hash(password, 10);

    // on genere un code pour la verification de l'email
    const verificationToken = generateVerificationCode();

    //on genere une data d'expiration du code de verification
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10min
    const verificationTokenExpiresAt = new Date(expiresAt).toISOString();

    //On envoi le code verification de l'email a l'email renseigner par l'utilisateur
    await sendVerificationToken(email, username, verificationToken);

    //on enregistre l'utilisateur
    const newUser = await prisma.user.create({
      data: {
        email: email,
        username: username,
        password: hashPassword,
        verificationToken,
        verificationTokenExpiresAt,
      },
    });

    //On gener un Cookie pour la session de l'utilisateur qui vient d'etre crée
    generateTokenAndSetCookie(
      newUser,
      201,
      res,
      `Le compte a été créer avec success! un code de verification a été envoyer à l'address : ${newUser.email}`,
    );
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

//TOKEN VERIFICATION
exports.verifyEmail = async (req, res, next) => {
  //On recupere les données entrée par l'utilisteur
  const { code } = req.body;
  const verifAt = Date.now();

  try {
    //on veririfie site le token est identique a celui du client connecter
    const user = await prisma.user.findFirst({
      where: {
        verificationToken: code,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired verifycation code',
      });
    }
    const expVirifie = user.verificationTokenExpiresAt > verifAt;
    if (!expVirifie) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired verifycation code',
      });
    }

    //on met a jour le status du compte
    await prisma.user.update({
      where: {
        email: user.email,
      },
      data: {
        isVerified: true,
        verificationToken: 'null',
      },
    });
    //On envoie un email de bienvenue
    await sendWelcomeEmail(user.email, user.username);

    return res.status(200).json({
      success: true,
      message: 'Le compte été verifier avec success ',
    });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

//LOGIN USER
exports.login = async (req, res, next) => {
  //On récupére les information entré par l'utilisateur
  const { email, password } = req.body;
  try {
    if (!email.trim() || !password.trim()) {
      throw new Error('Merci de renseilgner tous les champs');
    }
    //on verifie si l'utilisteur existe
    const findUser = await prisma.user.findUnique({ where: { email } });
    if (!findUser) {
      throw new Error('invalid email or password');
    }
    //On verifie si le mot de passe est correct
    const hash = await bcrypt.compare(password, findUser.password);

    if (!hash) {
      throw new Error('invalid email or password');
    }

    //On gener un Cookie pour la session de l'utilisateur qui vient d'etre crée
    generateTokenAndSetCookie(
      findUser,
      201,
      res,
      `User has successfuly connected!`,
    );
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

//FORGET PASSWORD
exports.forgetPass = async (req, res, next) => {
  //On recupere l'email de l'utilistateur
  const email = req.body;
  try {
    const user = await prisma.user.findUnique({ where: email });
    if (!user) {
      throw new Error(
        'We send your a request to reset your password please check your email a follow the links',
      );
    }

    //on genere un token pour le réinitialisation du mot de passe
    const resteToken = crypto.randomBytes(20).toString('hex');

    //on genere une data d'expiration du Token de reste password
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10min
    const resetTokenExpiresAt = new Date(expiresAt).toISOString();

    //on enregistre le token et la date d'expiration
    await prisma.user.update({
      where: {
        email: user.email,
      },
      data: {
        restePasswordToken: resteToken,
        restePasswordExpiresAt: resetTokenExpiresAt,
      },
    });

    //On envoie un email de regeneration du mot de passe
    await sendResetPasswordToken(user.email, resteToken);

    return res.status(200).json({
      success: true,
      message:
        'Un email de resatauration de votre mot de passe a été envoyer a votre adress email',
    });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

//RESTE PASSWORD
exports.resetPass = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;
    const verifyAt = Date.now();

    //on recherche le token dans la base de donnée
    const user = await prisma.user.findFirst({
      where: { restePasswordToken: token },
    });
    //On verifie la validité du token
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid or expired token!!' });
    }
    const expired = user.restePasswordExpiresAt > verifyAt;

    if (!expired) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid or expired token!!' });
    }

    //On crypt le mot de passe
    const hashPassword = await bcrypt.hash(newPassword, 10);

    //On met a jour la date de changement du mot de passe
    const passwordChangeAt = new Date(verifyAt).toISOString();

    //on met a jour le mot de passe
    await prisma.user.update({
      where: { userid: user.userid },
      data: {
        password: hashPassword,
        restePasswordToken: 'null',
        passUpdateAt: passwordChangeAt,
      },
    });

    //On envoie un message de success
    return res.status(200).json({
      success: true,
      message: 'Your password has successfuly updated!',
    });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

//UPDATE PASSWORD
exports.updatePass = async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  const passwordChangeAt = Date.now();
  const user = req.user;
  try {
    //On verifie si l'ancien mot de passe est valide
    const verifPass = await bcrypt.compare(oldPassword, user.password);
    if (!verifPass) {
      return res
        .status(401)
        .json({ success: false, message: 'Old password is invalid' });
    }

    //On enregistre le nouveau mot de passe
    const newpass = await bcrypt.hash(newPassword.trim(), 10);
    await prisma.user.update({
      where: { userid: user.userid },
      data: {
        password: newpass,
        passUpdateAt: new Date(passwordChangeAt).toISOString(),
      },
    });

    //On gener un Cookie pour la session de l'utilisateur qui vient de modifier son mot de passe
    generateTokenAndSetCookie(
      user,
      201,
      res,
      `Password was successulfy updated!`,
    );
  } catch (error) {
    console.log(error);
    res.status(400).json({ sucess: false, message: error.message });
  }
};

//LOGOUT USER
exports.logout = async (req, res, next) => {
  res.clearCookie('MySuperCookie');
  res.status(200).json({
    success: true,
    message: 'User has sucessfuly logout!',
  });
};

//GET USER
exports.user = async (req, res, next) => {
  console.log('Authentification successfull');
  res.status(200).json({ success: true, message: 'Your are now loggin' });
};
