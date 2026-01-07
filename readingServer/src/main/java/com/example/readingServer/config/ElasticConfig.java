package com.example.readingServer.config;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.transport.ElasticsearchTransport;
import co.elastic.clients.transport.rest_client.RestClientTransport;
import co.elastic.clients.json.jackson.JacksonJsonpMapper;
import org.apache.http.Header;
import org.apache.http.HttpHost;
import org.apache.http.message.BasicHeader;
import org.elasticsearch.client.RestClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ElasticConfig {

    @Bean
    public ElasticsearchClient elasticsearchClient() {
        // Tạo RestClient với header ép về compatible-with=8
        RestClient restClient = RestClient.builder(new HttpHost("localhost", 9200))
                .setDefaultHeaders(new Header[]{
                        new BasicHeader("Accept", "application/vnd.elasticsearch+json;compatible-with=8"),
                        new BasicHeader("Content-Type", "application/vnd.elasticsearch+json;compatible-with=8")
                })
                .build();

        // Transport + mapper
        ElasticsearchTransport transport = new RestClientTransport(restClient, new JacksonJsonpMapper());

        // Trả về client để inject vào service
        return new ElasticsearchClient(transport);
    }
}
