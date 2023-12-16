const Login = require("../../model/userSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signUp = async (req, res) => {
  let { name, email, password, phone, anonymous, gender } = req.body;

  const salt = await bcrypt.genSalt(10);
  password = await bcrypt.hash(password, salt);
  email = email.toLowerCase();

  const data = await Login.findOne({ $or: [{ email }, { phone }] });

  if (data) {
    res
      .status(203)
      .json({ data: "Email or Phone Already Exists", success: false });
  } else {
    const loginObj = Login({
      email,
      name,
      password,
      phone,
      gender,
      anonymous,
    });
    const jwtToken = jwt.sign(
      {
        user: loginObj._id,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "1d",
      }
    );
    loginObj
      .save()
      .then((result) => {
        res
          .status(200)
          .send({ data: loginObj, token: jwtToken, success: true });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("Internal server error");
      });
  }
};

exports.signInUser = async (req, res) => {
  let { email, password } = req.body;
  email = email.toLowerCase();

  let data = await Login.findOne({ $or: [{ email }, { phone: email }] });

  if (data) {
    const matched = await bcrypt.compare(password, data.password);

    if (matched) {
      const jwtToken = jwt.sign(
        {
          user: data._id,
        },
        process.env.SECRET_KEY,
        {
          expiresIn: "1d",
        }
      );
      res.status(200).send({ jwtToken });
    } else {
      res.status(203).json({ data: "Invalid credentials", success: false });
    }
  } else {
    res.status(203).json({ data: "Invalid credentials", success: false });
  }
};

exports.getUser = async (req, res) => {
  const { id } = req;

  let user = await Login.findById(id);
  res.send(user);
};

exports.updateUser = async (req, res) => {
  const { id } = req;
  let {
    nationality,
    state,
    city,
    profession,
    gender,
    profile,
    languages,
    discussions,
    anonymous,
  } = req.body;

  let response = await Login.updateOne(
    { _id: id },
    {
      nationality,
      state,
      city,
      profession,
      gender,
      profile,
      languages,
      discussions,
      anonymous,
    }
  );

  res.status(200).send(response);
};
