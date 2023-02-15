import { TimeRange } from "./TimeRange";

export interface DashboardQuery {
    transient: boolean;
    queryString: string;
    queryType: "Logs" | "Metrics" | "Custom";
    queryKey: string;
    parseMode: "Auto";
    timeSource: "Message";
    outputCardinalityLimit: 1000;
}

export interface DashboardPanel {
    id: string;
    key: string;
    title: string;
    visualSettings: string;
    keepVisualSettingsConsistentWithParent: boolean;
    panelType: "SumoSearchPanel" | "TextPanel",
    queries: DashboardQuery[];
    description: string,
    timeRange?: TimeRange;
    coloringRules?: any;
    linkedDashboards: any[];
}

export interface DashboardVariable {
    id: string;
    name: string;
    displayName: string;
    defaultValue?: string; 
    sourceDefinition: any;
    allowMultiSelect?: boolean;
    includeAllOption?: boolean;
    hideFromUI: boolean;
    valueType: "Any" | "String";
}

export interface Dashboard {
    title: string;
    description: string;
    folderId: string;
    domain: string;
    hierarchies?: string;
    refreshInterval?: number;
    timeRange: TimeRange;
    panels: DashboardPanel[];
    layout: {
        layoutType: "Grid",
        layoutStructures: any;
    }
    variables: DashboardVariable[];
    theme: "Light" | "Dark";
    coloringRules?: any[],
    isPublic: boolean;
    highlightViolations: boolean;
    id: string;
    contentId?: string;
    scheduleId?: any;
}