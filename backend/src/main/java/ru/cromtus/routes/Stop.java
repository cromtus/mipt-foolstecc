package ru.cromtus.routes;

public class Stop {
    public final int id;
    public final String name;
    public final double lat, lng;

    public Stop(int id, String name, double lat, double lng) {
        this.id = id;
        this.name = name;
        this.lat = lat;
        this.lng = lng;
    }
}
