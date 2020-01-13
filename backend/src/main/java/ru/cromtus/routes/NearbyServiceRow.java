package ru.cromtus.routes;

public class NearbyServiceRow {
    public final int routeId, runId;
    public final String routeType, routeName, runPoints;

    public NearbyServiceRow(int routeId, String routeType, String routeName, int runId, String runPoints) {
        this.routeId = routeId;
        this.runId = runId;
        this.routeName = routeName;
        this.routeType = routeType;
        this.runPoints = runPoints;
    }
}
