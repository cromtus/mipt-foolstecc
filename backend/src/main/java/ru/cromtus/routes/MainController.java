package ru.cromtus.routes;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class MainController {

    @Autowired
    NearbyService nearbyService;

    @CrossOrigin(origins = "*")
    @GetMapping("/api/nearby")
    public NearbyServiceResponse findNearbyRoutes(
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
}
