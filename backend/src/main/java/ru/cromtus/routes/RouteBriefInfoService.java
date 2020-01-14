package ru.cromtus.routes;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Service;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Service
public class RouteBriefInfoService {
    public class Response {
        public final String name;
        public final Route.Type type;

        public Response(Route.Type type, String name) {
            this.name = name;
            this.type = type;
        }
    }

    private class Mapper implements RowMapper<Response> {
        @Override
        public Response mapRow(ResultSet rs, int i) throws SQLException {
            return new Response(
                    Route.Type.valueOf(rs.getString("type")),
                    rs.getString("name")
            );
        }
    }

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private final static String sql = "SELECT type, name FROM routes WHERE id=?";

    public Response find(int route_id) {
        List<Response> rows = jdbcTemplate.query(sql, preparedStatement -> {
            preparedStatement.setInt(1, route_id);
        }, new Mapper());
        return rows.get(0);
    }
}


