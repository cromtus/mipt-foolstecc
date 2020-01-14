package ru.cromtus.routes;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Service;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Service
public class RouteRunsService {
    private class Mapper implements RowMapper<Run> {
        @Override
        public Run mapRow(ResultSet rs, int i) throws SQLException {
            return new Run(rs.getString("points"));
        }
    }

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private final static String sql = "SELECT " +
            "points FROM routes " +
            "INNER JOIN runs ON routes.id=runs.route_id " +
            "WHERE routes.id=?";

    public List<Run> find(int route_id) {
        return jdbcTemplate.query(sql, preparedStatement -> {
            preparedStatement.setInt(1, route_id);
        }, new Mapper());
    }
}
