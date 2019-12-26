"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const mainServer = app_1.server.listen(app_1.app.get("port"), () => {
    console.log("Server running at http://localhost:%d in %s mode", app_1.app.get("port"), app_1.app.get("env"));
});
exports.default = mainServer;
//# sourceMappingURL=server.js.map