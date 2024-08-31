package com.jotform.endrnce.modules.cucumber.dao.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CucumberRequestDTO {

    public Feature feature;
    public ArrayList<Comment> comments;

    public static class Background {

        public String id;
        public Location location;
        public String keyword;
        public String name;
        public String description;
        public ArrayList<Step> steps;
    }

    public static class Cell {

        public Location location;
        public String value;
    }

    public static class Child {

        public Background background;
        public Scenario scenario;
    }

    public static class Comment {

        public Location location;
        public String text;
    }

    public static class Example {

        public String id;
        public ArrayList<Tag> tags;
        public Location location;
        public String keyword;
        public String name;
        public String description;
        public TableHeader tableHeader;
        public ArrayList<TableBody> tableBody;
    }

    public static class Feature {

        public ArrayList<Tag> tags;
        public Location location;
        public String language;
        public String keyword;
        public String name;
        public String description;
        public ArrayList<Child> children;
    }

    public static class Location {

        public int line;
        public int column;
    }

    public static class Scenario {

        public String id;
        public ArrayList<Tag> tags;
        public Location location;
        public String keyword;
        public String name;
        public String description;
        public ArrayList<Step> steps;
        public ArrayList<Example> examples;
    }

    public static class Step {

        public String id;
        public Location location;
        public String keyword;
        public String keywordType;
        public String text;
        public DataTable dataTable;
        public String docString;
    }

    public static class TableBody {

        public String id;
        public Location location;
        public ArrayList<Cell> cells;
    }

    public static class TableHeader {

        public String id;
        public Location location;
        public ArrayList<Cell> cells;
    }

    public static class Tag {

        public Location location;
        public String name;
        public String id;
    }

    public static class DataTable{

        public Location location;
        public ArrayList<Row> rows;
    }

    public static class Row{

        public String id;
        public Location location;
        public ArrayList<Cell> cells;
    }
}
