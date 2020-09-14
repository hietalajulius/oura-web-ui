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
  const days = ctx.request.query.days || 1
  console.log("This manu days", days)
  const date = new Date();
  date.setDate(date.getDate() - days);
  const dateString = date.toISOString().split("T")[0];


  const token = ctx.session.token.access_token;
  try {
    const resp = await axios.get(
      `https://api.ouraring.com/v1/sleep?start=${dateString}&access_token=${token}`
    );
    const stats = resp.data.sleep.map(day => {
      console.log("Day", day)
      const duration = moment.duration(day.total, "seconds");
      return {hours: duration.get("hours"), minutes: duration.get("minutes"), date: day.summary_date}
    })
    
    ctx.body = stats;
  } catch (e) {
    console.log(e);
    ctx.body = { message: "No stats found" };
  }
});

export default router.routes();
