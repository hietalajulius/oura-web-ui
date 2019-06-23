import * as Router from "koa-router";
import axios from "axios";
// @ts-ignore
import simpleOauth from "koa-simple-oauth-oura-patch";
import { oauthConfig } from "./ouraLogin";
import * as moment from "moment";

const router = new Router();

const { isLoggedIn, requireLogin } = simpleOauth(oauthConfig, router);

router.use(isLoggedIn);

router.get("/stats", requireLogin, async ctx => {
  const date = new Date();
  const day = date.getDate() - 1;
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const token = ctx.session.token.access_token;
  try {
    const resp = await axios.get(
      `https://api.ouraring.com/v1/sleep?start=${year}-${month}-${day}&access_token=${token}`
    );
    console.log(day, resp.data);
    const seconds = resp.data.sleep[0].total;
    const duration = moment.duration(seconds, "seconds");
    ctx.body = `<p>
      ${duration.get("hours")} Hours, ${duration.get(
      "minutes"
    )} Minutes </p> <br> <a href='http://localhost:3000/oura'>Back to OURA home</a>`;
  } catch (e) {
    console.log(e);
    ctx.body = " No Stuffz, check error from logs";
  }
});

export default router.routes();
