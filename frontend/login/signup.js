// 휴대폰 인증 토큰 전송하기

const getValidationNumber = async () => {
  document.querySelector("#ValidationInputWrapper").style.display = "flex";
  const phone =
    document.getElementById("PhoneNumber01").value +
    document.getElementById("PhoneNumber02").value +
    document.getElementById("PhoneNumber03").value;
  await axios
    .post("http://localhost:5500/tokens/phone", {
      phone,
    })
    .then(() => {
      console.log("요청 성공");
    })
    .catch(() => console.log("요청 실패"));
};

// 핸드폰 인증 완료 API 요청
const submitToken = async () => {
  const phone =
    document.getElementById("PhoneNumber01").value +
    document.getElementById("PhoneNumber02").value +
    document.getElementById("PhoneNumber03").value;
  const token = document.getElementById("TokenInput").value;
  await axios
    .patch("http://localhost:5500/tokens/phone", {
      phone,
      token,
    })
    .then(() => console.log("요청 성공"))
    .catch(() => console.log("요청 실패"));
  console.log("핸드폰 인증 완료");
  return phone;
};

// 회원 가입 API 요청
const submitSignup = async () => {
  const name = document.getElementById("SignupName").value;
  const personal = document.getElementById("SignupPersonal1").value + "-";
  document.getElementById("SignupPersonal2").value;
  const phone =
    document.getElementById("PhoneNumber01").value +
    document.getElementById("PhoneNumber02").value +
    document.getElementById("PhoneNumber03").value;
  let prefer = document.getElementById("SignupPrefer").value;
  const email = document.getElementById("SignupEmail").value;
  const password = document.getElementById("SignupPwd").value;
  await axios
    .post("http://localhost:5500/user", {
      name,
      personal,
      phone,
      prefer,
      email,
      password,
    })
    .then(() => console.log("요청 성공"))
    .catch(() => console.log("요청 실패"));

  console.log("회원 가입 완료");
};
