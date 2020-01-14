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

class TestRowMapper implements RowMapper<NearbyServiceRow> {
    @Override
    public NearbyServiceRow mapRow(ResultSet rs, int rowNum) throws SQLException {
        return new NearbyServiceRow(
                rs.getInt("routes.id"),
                rs.getString("routes.type"),
                rs.getString("routes.name"),
                rs.getInt("runs.id"),
                rs.getString("runs.points"));
    }
}

@Service
public class NearbyService {
    private static final double EQUATOR_LENGTH = 4e7;
    private static final String sql = "SELECT " +
            "routes.id, routes.type, routes.name, runs.id, runs.points FROM routes " +
            "INNER JOIN runs ON routes.id=runs.route_id " +
            "INNER JOIN stops_to_runs ON runs.id=stops_to_runs.run_id " +
            "INNER JOIN stops ON stops_to_runs.stop_id=stops.id " +
            "WHERE POWER((stops.lat - ?) / ?, 2) + POWER((stops.lng - ?) / ?, 2) < 1 " +
            "GROUP BY runs.id " +
            "ORDER BY routes.id;";

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public NearbyServiceResponse find(double lat, double lng, double radius) {
        double deltaLat = 360 * radius / EQUATOR_LENGTH;
        double deltaLng = 360 * radius / (EQUATOR_LENGTH * Math.cos(Math.PI * lat / 180));

        List<NearbyServiceRow> rows = jdbcTemplate.query(sql, preparedStatement -> {
            preparedStatement.setString(1, String.valueOf(lat));
            preparedStatement.setString(2, String.valueOf(deltaLat));
            preparedStatement.setString(3, String.valueOf(lng));
            preparedStatement.setString(4, String.valueOf(deltaLng));
        }, new TestRowMapper());
        ArrayList<ArrayList<Double>> points;
        final int INITIAL = -1;
        ArrayList<Route> responseRoutes = new ArrayList<>();
        int lastRouteId = INITIAL;
        String lastRouteName = null;
        Route.Type lastRouteType = null;
        ArrayList<Run> lastRouteRuns = null;
        for (NearbyServiceRow row : rows) {
            if (lastRouteId != row.routeId) {
                if (lastRouteId != INITIAL) {
                    responseRoutes.add(new Route(lastRouteId, lastRouteType, lastRouteName, lastRouteRuns));
                }
                lastRouteId = row.routeId;
                lastRouteType = Route.Type.valueOf(row.routeType);
                lastRouteName = row.routeName;
                lastRouteRuns = new ArrayList<>();
            }
            lastRouteRuns.add(new Run(Arrays.asList(row.runPoints.split(" ")).stream().map(s -> {
                String[] latlng = s.split(",");
                return Arrays.asList(Double.parseDouble(latlng[0]), Double.parseDouble(latlng[1]));
            }).collect(Collectors.toList())));
        }
        if (lastRouteId != INITIAL) {
            responseRoutes.add(new Route(lastRouteId, lastRouteType, lastRouteName, lastRouteRuns));
        }
        return new NearbyServiceResponse(responseRoutes);
    }
}
