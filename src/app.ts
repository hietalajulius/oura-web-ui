import * as Koa from "koa";
import * as Router from "koa-router";
import * as bodyParser from "koa-bodyparser";
import * as CSRF from "koa-csrf";
import * as session from "koa-session";
import * as compose from "koa-compose";
import * as mount from "koa-mount";
import ouraLoginRoutes from "./routes/ouraLogin";
import ouraStatsRoutes from "./routes/ouraStats";

const app = new Koa();
const router = new Router();

app.keys = ["secretSessionKey"];
const sessionConfig = {};
app.use(session(sessionConfig, app));
app.use(bodyParser());
app.use(
  new CSRF({
    invalidTokenMessage: "Invalid CSRF token",
    invalidTokenStatusCode: 403,
    excludedMethods: ["GET", "HEAD", "OPTIONS"],
    disableQuery: false
  })
);
app.use(mount("/oura", compose([mount(ouraLoginRoutes), mount(ouraStatsRoutes)])));
router.get("/success", async ctx => {
  ctx.body = "<a href='http://localhost:3000'>Back to home</a>";
});

router.get("", async ctx => {
  ctx.body = "<a href='http://localhost:3000/oura'>Let's do that OURA stuff</a>";
});
app.use(router.routes());
app.use(router.allowedMethods());
app.listen(3000);

console.log("Server running on port 3000");
