## What is this repository?

The goal of this repository is to build a Typescript/Javascript abstraction for the Sumo Logic API. It allows you to quickly
accomplish tasks with many details hidden by the package.

```typescript
import { SumoApi } from "sumo-api";

const accessId = ""
const accessKey = "";
const baseURL = "";

console.log(await (async () => {
    const api = new SumoApi({ accessId, accessKey, baseURL });

    const dashboard = await api.dashboard.get("<dashid>");

    if ("error" in dashboard) {
        return "error getting dashboard";
    }

    for (let panel of dashboard.panels) {
        if (panel.queries) {
            for (let query of panel?.queries) {
                const search = await api.search.getAll({
                    "query": query.queryString,
                    "from": "2023-01-01T12:00:00",
                    "to": "2023-01-02T12:15:00",
                    "timeZone": "PST",
                    "byReceiptTime": true
                });

                if ("error" in search) {
                    return "error starting search: " + search.error;
                }

                process.exit(0);
            }
        }
    }
})());
```