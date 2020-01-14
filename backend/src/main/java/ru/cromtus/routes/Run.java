package ru.cromtus.routes;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class Run {
    public final List<List<Double>> points;

    public Run(List<List<Double>> points) {
        this.points = points;
    }

    public Run(String serializedPoints) {
        points = Arrays.asList(serializedPoints.split(" ")).stream().map(s -> {
            String[] latlng = s.split(",");
            return Arrays.asList(Double.parseDouble(latlng[0]), Double.parseDouble(latlng[1]));
        }).collect(Collectors.toList());
    }
}
