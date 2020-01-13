package ru.cromtus.routes;

import java.util.List;

public class Route {
    public Route(int id, Type type, String name, List<Run> runs) {
        this.id = id;
        this.type = type;
        this.name = name;
        this.runs = runs;
    }

    public enum Type {metro, trol, tram, bus}

    public final int id;
    public final Type type;
    public final String name;

    public final List<Run> runs;
}
