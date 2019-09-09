import * as Koa from "koa";
import * as Router from "koa-router";
import * as bodyParser from "koa-bodyparser";
import * as CSRF from "koa-csrf";
import * as session from "koa-session";
import * as compose from "koa-compose";
import * as mount from "koa-mount";
import ouraLoginRoutes from "./routes/ouraLogin";
import ouraStatsRoutes from "./routes/ouraStats";
import * as serve from "koa-static";

const app = new Koa();
const router = new Router();

app.keys = ["secretSessionKey"]; // TODO edit to proper value
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

const frontend = new Koa();
frontend.use(serve("./dist/build_frontend"));
app.use(mount("/", frontend));
app.use(mount("/success", frontend));
app.use(mount("/error", frontend));

app.use(router.routes());
app.use(router.allowedMethods());
app.listen(3000);

console.log("Server running on port 3000");
