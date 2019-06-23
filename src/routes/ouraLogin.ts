import * as Router from "koa-router";
// @ts-ignore
import simpleOauth from "koa-simple-oauth-oura-patch";
import { OURA_CLIENT_ID, OURA_CLIENT_SECRET } from "../../secrets";

const router = new Router();

export const oauthConfig = {
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
  redirectSuccessUrl: "http://localhost:3000/oura/success",
  redirectErrorUrl: "http://localhost:3000/oura/error",
  disableErrorReason: false,
  onSuccess: (ctx: any, data: any, status: number = 200) => {
    ctx.status = status;
    if (data) {
      ctx.body = typeof data === "object" ? JSON.stringify(data) : data;
    } else {
      ctx.redirect("http://localhost:3000/oura/success");
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

const { isLoggedIn, requireLogin } = simpleOauth(oauthConfig, router);

router.use(isLoggedIn);
router.get("", async ctx => {
  if (ctx.state.isLoggedIn()) {
    ctx.body =
      "<a href='http://localhost:3000/oura/logout'>Logout</a> <br> <a href='http://localhost:3000/oura/stats'>Get some stuff</a> <br> <a href='http://localhost:3000'> HOME </a>";
  } else {
    ctx.body =
      "<a href='http://localhost:3000/oura/login'>Login</a> <br> <a href='http://localhost:3000'> HOME </a>";
  }
});

router.get("/user", async ctx => {
  ctx.body = {
    user: { id: "user_id", isAdmin: true }
  };
});

router.get("/error", async ctx => {
  ctx.body = "Error";
});

router.get("/success", async ctx => {
  ctx.body = "<a href='http://localhost:3000/oura'>Back to OURA home</a>";
});

router.get("/admin", requireLogin, async ctx => {
  ctx.body = "<a href='http://localhost:3000/oura'>YOU ARE LOGGED IN, Back to OURA home</a>";
});

export default router.routes();
