package ru.cromtus.routes;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RouteInfoService {
    @Autowired
    RouteBriefInfoService routeBriefInfoService;

    @Autowired
    RouteRunsService routeRunsService;

    @Autowired
    RouteStopsService routeStopsService;

    public Route find(int route_id) {
        RouteBriefInfoService.Response r = routeBriefInfoService.find(route_id);
        return new Route(route_id, r.type,
                r.name, routeRunsService.find(route_id),
                routeStopsService.find(route_id)
        );
    }
}
