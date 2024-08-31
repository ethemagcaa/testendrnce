package com.jotform.endrnce.squareclient;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;
import org.json.JSONObject;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

@Service
public class SquareOAuthService {

    @Value("${square.authorizeUrl}")
    private String authorizeUrl;

    @Value("${square.tokenUrl}")
    private String tokenUrl;

    @Value("${square.clientId}")
    private String clientId;

    @Value("${square.clientSecret}")
    private String clientSecret;

    @Value("${square.redirectUri}")
    private String redirectUri;

    @Value("${square.state}")
    private String state;

    @Value("${square.scope}")
    private String scope;

    private RestTemplate restTemplate = new RestTemplate();

    public String initiateAuth() {
        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(authorizeUrl)
                .queryParam("client_id", clientId)
                .queryParam("redirect_uri", redirectUri)
                .queryParam("response_type", "code")
                .queryParam("state", state)
                .queryParam("scope", scope);

        return builder.toUriString();
    }

    public String completeAuth(String authorizationCode) {
        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(tokenUrl);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "authorization_code");
        body.add("code", authorizationCode);
        body.add("redirect_uri", redirectUri);
        body.add("client_id", clientId);
        body.add("client_secret", clientSecret);

        HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<>(body, headers);

        ResponseEntity<String> response = restTemplate.exchange(
            builder.toUriString(),
            HttpMethod.POST,
            requestEntity,
            String.class
        );

        if (response.getStatusCode().is2xxSuccessful()) {
            String responseBody = response.getBody();
            return extractTokenFromResponse(responseBody);
        } else {
            return null;
        }
    }

    private String extractTokenFromResponse(String responseBody) {
        JSONObject jsonObject = new JSONObject(responseBody);
        if (jsonObject.has("access_token")) {
            return jsonObject.getString("access_token");
        }
        return null;
    }
}
