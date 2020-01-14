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

    @CrossOrigin(origins = "*")
    @GetMapping("/api/nearby")
    public NearbyService.Response findNearbyRoutes(
            @RequestParam(value="lat") String lat,
            @RequestParam(value="lng") String lng,
            @RequestParam(value="radius") String radius
    ) {
        return nearbyService.find(
                Double.parseDouble(lat),
                Double.parseDouble(lng),
                Double.parseDouble(radius)
        );
    }

    @CrossOrigin(origins = "*")
    @GetMapping("/api/route")
    public Route routeInfoService(@RequestParam(value="id") String id) {
        return routeInfoService.find(Integer.parseInt(id));
    }
}
