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

    const dashboard = await api.dashboard.getResultsAsJson("<dashboard-id>", {
        variableOverrides: {
        }
    });

    if ("error" in dashboard) {
        return "error fetching dashboard data: " + dashboard.error;
    }

    console.log(JSON.stringify(dashboard, null, "  "));
})());
```