package ru.cromtus.routes;

import java.util.List;

public class NearbyServiceResponse {
    public final List<Route> routes;

    public NearbyServiceResponse(List<Route> routes) {
        this.routes = routes;
    }
}
