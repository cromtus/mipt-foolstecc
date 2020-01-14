package ru.cromtus.routes;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Service;

import org.springframework.jdbc.core.JdbcTemplate;

@Service
public class NearbyService {
    public class Response {
        public final List<Route> routes;

        public Response(List<Route> routes) {
            this.routes = routes;
        }
    }

    private class DatabaseRow {
        public final int routeId, runId;
        public final String routeType, routeName, runPoints;

        public DatabaseRow(int routeId, String routeType, String routeName, int runId, String runPoints) {
            this.routeId = routeId;
            this.runId = runId;
            this.routeName = routeName;
            this.routeType = routeType;
            this.runPoints = runPoints;
        }
    }

    private class Mapper implements RowMapper<DatabaseRow> {
        @Override
        public DatabaseRow mapRow(ResultSet rs, int rowNum) throws SQLException {
            return new DatabaseRow(
                    rs.getInt("routes.id"),
                    rs.getString("routes.type"),
                    rs.getString("routes.name"),
                    rs.getInt("runs.id"),
                    rs.getString("runs.points"));
        }
    }

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private static final double EQUATOR_LENGTH = 4e7;
    private static final String sql = "SELECT " +
            "routes.id, routes.type, routes.name, runs.id, runs.points FROM routes " +
            "INNER JOIN runs ON routes.id=runs.route_id " +
            "INNER JOIN stops_to_runs ON runs.id=stops_to_runs.run_id " +
            "INNER JOIN stops ON stops_to_runs.stop_id=stops.id " +
            "WHERE POWER((stops.lat - ?) / ?, 2) + POWER((stops.lng - ?) / ?, 2) < 1 " +
            "GROUP BY runs.id " +
            "ORDER BY routes.id;";

    public Response find(double lat, double lng, double radius) {
        double deltaLat = 360 * radius / EQUATOR_LENGTH;
        double deltaLng = 360 * radius / (EQUATOR_LENGTH * Math.cos(Math.PI * lat / 180));

        List<DatabaseRow> rows = jdbcTemplate.query(sql, preparedStatement -> {
            preparedStatement.setDouble(1, lat);
            preparedStatement.setDouble(2, deltaLat);
            preparedStatement.setDouble(3, lng);
            preparedStatement.setDouble(4, deltaLng);
        }, new Mapper());
        ArrayList<ArrayList<Double>> points;
        final int INITIAL = -1;
        ArrayList<Route> responseRoutes = new ArrayList<>();
        int lastRouteId = INITIAL;
        String lastRouteName = null;
        Route.Type lastRouteType = null;
        ArrayList<Run> lastRouteRuns = null;
        for (DatabaseRow row : rows) {
            if (lastRouteId != row.routeId) {
                if (lastRouteId != INITIAL) {
                    responseRoutes.add(new Route(lastRouteId, lastRouteType, lastRouteName, lastRouteRuns, null));
                }
                lastRouteId = row.routeId;
                lastRouteType = Route.Type.valueOf(row.routeType);
                lastRouteName = row.routeName;
                lastRouteRuns = new ArrayList<>();
            }
            lastRouteRuns.add(new Run(row.runPoints));
        }
        if (lastRouteId != INITIAL) {
            responseRoutes.add(new Route(lastRouteId, lastRouteType, lastRouteName, lastRouteRuns, null));
        }
        return new Response(responseRoutes);
    }
}
