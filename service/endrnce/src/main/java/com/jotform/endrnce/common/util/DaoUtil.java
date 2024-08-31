package com.jotform.endrnce.common.util;

import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.util.ObjectUtils;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.StringReader;
import java.util.concurrent.ConcurrentHashMap;

public class DaoUtil {

    public static ConcurrentHashMap<String, String> sqlQueries = new ConcurrentHashMap<>();

    private DaoUtil() {}

    public static String getQuery(String sqlName) {
        // Uncomment this block to initialize sql queries each time
        /*try {
            initializeAllQueries();
        } catch (Exception e) {
            //e.printStackTrace();
        }*/
        return sqlQueries.get(sqlName);
    }

    public static void initializeAllQueries() throws IOException, ParserConfigurationException, SAXException {
        sqlQueries.clear();

        Resource resource = new ClassPathResource("sql_queries.xml");
        BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(resource.getInputStream(), "UTF8"), 1024);
        StringBuilder stringBuilder = new StringBuilder();
        String line = bufferedReader.readLine();
        while (line != null) {
            stringBuilder.append(line).append('\n');
            line = bufferedReader.readLine();
        }
        bufferedReader.close();

        String xmlString = stringBuilder.toString();
        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        DocumentBuilder builder = factory.newDocumentBuilder();
        Document document = builder.parse(new InputSource(new StringReader(xmlString)));

        NodeList nodeList = document.getElementsByTagName("query");
        for (int i = 0; i < nodeList.getLength(); i++) {
            Node n = nodeList.item(i);
            String queryName = n.getAttributes().getNamedItem("name").getNodeValue();
            Node actualNode = n.getFirstChild();
            if (actualNode != null) {
                sqlQueries.put(queryName, n.getTextContent().trim());
            }
        }
    }
}
