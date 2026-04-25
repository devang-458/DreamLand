import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route('visualizer/:id', 'routes/visualizerId.tsx'),
    route('*', 'routes/notfound.tsx') // Catch-all for unmatched routes
] satisfies RouteConfig;
