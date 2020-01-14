package ru.cromtus.routes;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Service;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.*;

@Service
public class SearchService {
    private class Mapper implements RowMapper<Route> {
        @Override
        public Route mapRow(ResultSet rs, int i) throws SQLException {
            return new Route(
                    rs.getInt("id"),
                    Route.Type.valueOf(rs.getString("type")),
                    rs.getString("name"),
                    null, null
            );
        }
    }

    private static int countDigits(String s) {
        return s.chars().reduce(0, (count, c) -> count + (Character.isDigit(c) ? 1 : 0));
    }

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private static final String sql = "SELECT * FROM routes WHERE name LIKE ?";

    public List<Route> find(String pattern) {
        List<Route> result = jdbcTemplate.query(sql, preparedStatement -> {
            preparedStatement.setString(1, "%" + pattern + "%");
        }, new Mapper());
        Collections.sort(result,
                Comparator.comparingInt((Route route) -> countDigits(route.name))
                        .thenComparingInt(route -> route.name.length()));
        return result;
    }
}
