import {top} from "../api/public/index.js";

export function publicRouter(app){
    app.get("/", top);
    }