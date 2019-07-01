import { OURA_CLIENT_ID, OURA_CLIENT_SECRET } from "../../secrets";

const oauthConfig = {
  clientId: OURA_CLIENT_ID,
  clientSecret: OURA_CLIENT_SECRET,
  url: "https://cloud.ouraring.com/oauth/authorize",
  redirectUrl: "http://localhost:3000/oura/auth",
  userUrl: "http://localhost:3000/oura/user",
  userMethod: "GET",
  user: (data: any) => {
    const user = data.user;
    if (!user.isAdmin) {
      return "not_admin";
    }
    return user;
  },
  oauthOptions: {},
  redirectSuccessUrl: "http://localhost:3000/success",
  redirectErrorUrl: "http://localhost:3000/error",
  disableErrorReason: false,
  onSuccess: (ctx: any, data: any, status: number = 200) => {
    ctx.status = status;
    if (data) {
      ctx.body = typeof data === "object" ? JSON.stringify(data) : data;
    } else {
      ctx.redirect("http://localhost:3000/success");
    }
  },
  onError: (ctx: any, status: any, message: any, err: any) => {
    ctx.status = status;
    ctx.body = `${message}: ${err.message}`;
  },
  logError: (err: any) => {
    if (err.message !== "Not logged in") {
      console.error(err);
    }
  },
  routes: {
    login: "/login",
    authorized: "/auth",
    whoami: "/whoami",
    logout: "/logout"
  }
};

export default oauthConfig;
