package ru.cromtus.routes;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Service;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Service
public class RouteStopsService {
    private class Mapper implements RowMapper<Stop> {
        @Override
        public Stop mapRow(ResultSet rs, int i) throws SQLException {
            return new Stop(
                    rs.getInt("stops.id"),
                    rs.getString("stops.name"),
                    rs.getDouble("stops.lat"),
                    rs.getDouble("stops.lng")
            );
        }
    }

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private static final String sql = "SELECT DISTINCT " +
            "stops.id, stops.name, stops.lat, stops.lng FROM stops " +
            "INNER JOIN stops_to_runs ON stops.id=stops_to_runs.stop_id " +
            "INNER JOIN runs ON stops_to_runs.run_id=runs.id " +
            "WHERE runs.route_id=?";

    List<Stop> find(int route_id) {
        return jdbcTemplate.query(sql, preparedStatement -> {
            preparedStatement.setInt(1, route_id);
        }, new Mapper());
    }
}
