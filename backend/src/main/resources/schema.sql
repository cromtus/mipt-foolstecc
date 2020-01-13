CREATE TABLE stops (
    id INT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    lat DOUBLE NOT NULL,
    lng DOUBLE NOT NULL
);

CREATE TABLE routes (
    id INT PRIMARY KEY,
    type ENUM('metro', 'trol', 'tram', 'bus') NOT NULL,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE runs (
    id INT PRIMARY KEY,
    points TEXT NOT NULL,
    route_id INT NOT NULL,
    FOREIGN KEY (route_id) REFERENCES routes
);

CREATE TABLE stops_to_runs (
    stop_id INT NOT NULL,
    run_id INT NOT NULL,
    FOREIGN KEY (stop_id) REFERENCES stops,
    FOREIGN KEY (run_id) REFERENCES runs
);