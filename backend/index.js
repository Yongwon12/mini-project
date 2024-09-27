import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import {
  hidePersonal,
  checkEmail,
  makeTemplate,
  scrapPage,
  sendTemplateToEmail,
} from "./user.js";
import { User } from "./models/userSchema.js";
import { Token } from "./models/tokenSchema.js";
import { getToken, phoneNumberLength, sendMessage } from "./phone.js";
import { CoffeeList } from "./models/starbucksSchema.js";

const app = express();

app.use(express.json());
app.use(cors());
app.get("/user", async function (req, res) {
  const userInfo = await User.find();
  res.send(userInfo);
});
app.post("/user", async function (req, res) {
  const email = req.body.email;
  const phone = req.body.phone;

  const findToken = await Token.findOne({ phone });
  const findPhone = await User.findOne({ phone });
  if (!findToken || findToken.isAuth === false) {
    res.statusCode = 422;
    res.send("에러!! 핸드폰 번호가 인증되지 않았습니다.");
    return;
  } else if (findPhone) {
    res.send("이미 회원정보가 존재합니다.");
    return;
  }
  const isValid = checkEmail(email);
  if (!isValid) {
    res.send("check email!");
    return;
  }

  let personal = req.body.personal;
  personal = hidePersonal(personal);

  const prefer = req.body.prefer;
  const name = req.body.name;
  const template = makeTemplate({ name, prefer, phone });
  sendTemplateToEmail(email, template);

  const pwd = req.body.pwd;
  const og = await scrapPage(prefer);
  const userCollection = new User({
    og,
    name,
    email,
    personal,
    prefer,
    pwd,
    phone,
  });
  await userCollection.save();
  const id = await User.findOne({ phone });
  res.send(id._id);
});
app.post("/tokens/phone", async function (req, res) {
  const phone = req.body.phone;
  const isValid = phoneNumberLength(phone);
  if (!isValid) {
    res.send("휴대폰번호를 확인해주세요.");
    return;
  }
  const token = getToken();

  const tokenCollection = new Token({
    token,
    phone,
    isAuth: false,
  });
  const findPhone = await Token.findOne({ phone });
  if (!findPhone || findPhone.phone !== phone) {
    tokenCollection.save();
  } else {
    await Token.updateOne({ phone }, { token });
  }
  const sendResult = await sendMessage(phone, token);
  res.send(sendResult);
});
app.patch("/tokens/phone", async function (req, res) {
  const phone = req.body.phone;
  const token = req.body.token;
  const findPhone = await Token.findOne({ phone });
  if (!findPhone || findPhone.phone !== phone || findPhone.token !== token) {
    res.send(false);
    return;
  } else {
    await Token.updateOne({ phone }, { isAuth: true });
    res.send(true);
  }
});
app.get("starbucks", async function (req, res) {
  const coffeeList = await CoffeeList.find();
  res.send(coffeeList);
});
mongoose
  .connect("mongodb://my-database/miniprojectdb")
  .then(() => console.log("DB 접속에 성공하였습니다."))
  .catch(() => console.log("DB 접속에 실패하였습니다."));
app.listen(3000);
