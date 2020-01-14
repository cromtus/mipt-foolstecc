package ru.cromtus.routes;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class MainController {

    @Autowired
    NearbyService nearbyService;

    @Autowired
    RouteInfoService routeInfoService;

    @Autowired
    SearchService searchService;

    @CrossOrigin(origins = "*")
    @GetMapping("/api/nearby")
    public NearbyService.Response findNearbyRoutes(
            @RequestParam(value="lat") double lat,
            @RequestParam(value="lng") double lng,
            @RequestParam(value="radius") double radius
    ) {
        return nearbyService.find(lat, lng, radius);
    }

    @CrossOrigin(origins = "*")
    @GetMapping("/api/route")
    public Route routeInfoService(@RequestParam(value="id") int id) {
        return routeInfoService.find(id);
    }

    @CrossOrigin(origins = "*")
    @GetMapping("/api/search")
    public List<Route> searchService(@RequestParam(value="pattern") String pattern) {
        return searchService.find(pattern);
    }
}
