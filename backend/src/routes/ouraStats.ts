import * as Router from "koa-router";
import axios from "axios";
// @ts-ignore
import simpleOauth from "koa-simple-oauth-oura-patch";
import ouraOauthConfig from "./ouraOauthConfig";
import * as moment from "moment";
import { DailySleepStats } from "../../../types";

const router = new Router();

const { isLoggedIn, requireLogin } = simpleOauth(ouraOauthConfig, router);

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
    const seconds = resp.data.sleep[0].total;
    const duration = moment.duration(seconds, "seconds");
    const stats: DailySleepStats = {
      hours: duration.get("hours"),
      minutes: duration.get("minutes")
    };
    ctx.body = stats;
  } catch (e) {
    console.log(e);
    ctx.body = { message: "No stats found" };
  }
});

export default router.routes();
